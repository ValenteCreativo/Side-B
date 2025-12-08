'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Loader2, CheckCircle2, AlertCircle, Wallet } from 'lucide-react'

interface SessionData {
    id: string
    title: string
    description: string
    priceUsd: number
    contentType: string
    ownerWalletAddress: string
    ownerDisplayName?: string
}

interface PurchaseModalProps {
    isOpen: boolean
    onClose: () => void
    session: SessionData | null
    buyerId: string
    onSuccess?: () => void
}

export function PurchaseModal({
    isOpen,
    onClose,
    session,
    buyerId,
    onSuccess,
}: PurchaseModalProps) {
    const { toast } = useToast()
    const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [txHash, setTxHash] = useState<string | null>(null)

    const handlePurchase = async () => {
        if (!session) return

        setStep('processing')
        setErrorMessage(null)

        try {
            // Check if ethereum provider is available (MetaMask, Coinbase Wallet, etc.)
            const ethereum = (window as any).ethereum
            if (!ethereum) {
                throw new Error('No wallet detected. Please install a Web3 wallet.')
            }

            // Request account access
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            const userAddress = accounts[0]

            // Base USDC contract address
            const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

            // Calculate USDC amount (6 decimals) as hex
            const usdcAmount = BigInt(Math.floor(session.priceUsd * 1e6))
            const amountHex = '0x' + usdcAmount.toString(16).padStart(64, '0')

            // Recipient address padded to 32 bytes
            const recipientPadded = '0x' + session.ownerWalletAddress.slice(2).toLowerCase().padStart(64, '0')

            // ERC20 transfer function signature: transfer(address,uint256)
            const transferFunctionSig = '0xa9059cbb'
            const data = transferFunctionSig + recipientPadded.slice(2) + amountHex.slice(2)

            // Send transaction
            const txHashResult = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: userAddress,
                    to: USDC_ADDRESS,
                    data: data,
                }],
            })

            setTxHash(txHashResult)

            // Wait a bit for transaction to be indexed, then create license
            // In production, you'd poll for confirmation
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Create license with txHash
            const response = await fetch('/api/licenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: session.id,
                    buyerId,
                    txHash: txHashResult,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create license')
            }

            setStep('success')
            onSuccess?.()

            toast({
                title: 'License purchased!',
                description: `You now own a commercial license for "${session.title}"`,
            })
        } catch (error: any) {
            console.error('Purchase error:', error)
            setStep('error')

            // Handle user rejection
            if (error.code === 4001) {
                setErrorMessage('Transaction cancelled by user')
            } else {
                setErrorMessage(error?.message || 'Failed to complete purchase')
            }
        }
    }

    // Reset state when modal closes
    const handleClose = () => {
        setStep('confirm')
        setErrorMessage(null)
        setTxHash(null)
        onClose()
    }

    if (!session) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md bg-background border border-zinc-200 dark:border-zinc-800 rounded-md shadow-refined">
                <DialogHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <DialogTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-bronze" />
                        License Track
                    </DialogTitle>
                    <DialogDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Purchase commercial license
                    </DialogDescription>
                </DialogHeader>

                {/* Confirm Step */}
                {step === 'confirm' && (
                    <div className="space-y-6 py-4">
                        {/* Track Info */}
                        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50/50 dark:bg-zinc-900/50">
                            <h3 className="font-bold text-lg mb-1 tracking-tight">{session.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                by {session.ownerDisplayName || 'Unknown Artist'}
                            </p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="rounded-sm font-mono text-[10px]">
                                    {session.contentType}
                                </Badge>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                            <span className="font-mono text-sm text-muted-foreground">LICENSE PRICE</span>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-bronze">${session.priceUsd}</span>
                                <span className="text-xs text-muted-foreground ml-1 font-mono">USDC</span>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-3">
                            <Button
                                onClick={handlePurchase}
                                className="w-full h-12 rounded-sm shadow-refined hover:shadow-refined-md"
                            >
                                <Wallet className="h-4 w-4 mr-2" />
                                Pay with Wallet (USDC on Base)
                            </Button>

                            <p className="text-center text-xs text-muted-foreground font-mono">
                                Payment goes directly to the artist
                            </p>
                        </div>
                    </div>
                )}

                {/* Processing Step */}
                {step === 'processing' && (
                    <div className="py-12 text-center">
                        <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-bronze" />
                        <h3 className="text-lg font-bold uppercase mb-2">Processing Payment</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                            Confirm the transaction in your wallet...
                        </p>
                    </div>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <div className="py-8 text-center space-y-4">
                        <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />
                        <h3 className="text-xl font-bold uppercase">License Acquired!</h3>
                        <p className="text-sm text-muted-foreground">
                            You now own a commercial license for "{session.title}"
                        </p>
                        {txHash && (
                            <a
                                href={`https://basescan.org/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-bronze hover:underline block"
                            >
                                View transaction on BaseScan →
                            </a>
                        )}
                        <Button
                            onClick={handleClose}
                            className="rounded-sm shadow-refined"
                        >
                            Done
                        </Button>
                    </div>
                )}

                {/* Error Step */}
                {step === 'error' && (
                    <div className="py-8 text-center space-y-4">
                        <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
                        <h3 className="text-xl font-bold uppercase">Purchase Failed</h3>
                        <p className="text-sm text-muted-foreground">
                            {errorMessage || 'Something went wrong'}
                        </p>
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStep('confirm')
                                    setErrorMessage(null)
                                }}
                                className="rounded-sm"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={handleClose}
                                className="rounded-sm"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
