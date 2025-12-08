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
import { ShoppingCart, Loader2, CheckCircle2, AlertCircle, Wallet, CreditCard, Copy, Check, ExternalLink } from 'lucide-react'
import { useEvmAddress } from '@coinbase/cdp-hooks'
import { SendEvmTransactionButton } from '@coinbase/cdp-react'
import { HallidayOnrampModal } from '@/components/payments/HallidayOnrampModal'
import { NETWORK, getExplorerTxUrl } from '@/lib/network-config'

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

// Encode ERC20 transfer call data
function encodeTransferData(to: string, amount: bigint): `0x${string}` {
    // transfer(address,uint256) function signature
    const functionSig = '0xa9059cbb'
    const toAddress = to.slice(2).toLowerCase().padStart(64, '0')
    const amountHex = amount.toString(16).padStart(64, '0')
    return `${functionSig}${toAddress}${amountHex}` as `0x${string}`
}

export function PurchaseModal({
    isOpen,
    onClose,
    session,
    buyerId,
    onSuccess,
}: PurchaseModalProps) {
    const { toast } = useToast()
    const { evmAddress } = useEvmAddress()

    const [step, setStep] = useState<'funding' | 'confirm' | 'processing' | 'success' | 'error'>('funding')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [txHash, setTxHash] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [showOnramp, setShowOnramp] = useState(false)

    // Calculate USDC amount (6 decimals)
    const usdcAmount = session ? BigInt(Math.floor(session.priceUsd * 1e6)) : BigInt(0)

    const copyAddress = async () => {
        if (evmAddress) {
            await navigator.clipboard.writeText(evmAddress)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleTransactionSuccess = async (hash: string) => {
        setTxHash(hash)
        setStep('processing')

        try {
            // Wait for transaction to be indexed
            await new Promise(resolve => setTimeout(resolve, 3000))

            // Create license with txHash
            const response = await fetch('/api/licenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: session?.id,
                    buyerId,
                    txHash: hash,
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
                description: `You now own a commercial license for "${session?.title}"`,
            })
        } catch (error: any) {
            console.error('License creation error:', error)
            setStep('error')
            setErrorMessage('Payment received but license creation failed. Please contact support.')
        }
    }

    const handleTransactionError = (error: Error) => {
        console.error('Transaction error:', error)
        setStep('error')
        setErrorMessage(error.message || 'Transaction failed')
    }

    // Reset state when modal closes
    const handleClose = () => {
        setStep('funding')
        setErrorMessage(null)
        setTxHash(null)
        setCopied(false)
        onClose()
    }

    const handleOnrampSuccess = () => {
        setShowOnramp(false)
        toast({
            title: 'Funds added!',
            description: 'Your wallet has been funded. You can now complete your purchase.',
        })
    }

    if (!session) return null

    // Prepare the ERC20 transfer transaction
    const transferData = encodeTransferData(session.ownerWalletAddress, usdcAmount)

    return (
        <>
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

                    {/* Funding Step */}
                    {step === 'funding' && (
                        <div className="space-y-6 py-4">
                            {/* Track Summary */}
                            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50/50 dark:bg-zinc-900/50">
                                <h3 className="font-bold text-lg mb-1 tracking-tight">{session.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    by {session.ownerDisplayName || 'Unknown Artist'}
                                </p>
                                <div className="mt-2 text-2xl font-bold text-bronze">
                                    ${session.priceUsd.toFixed(2)}
                                </div>
                            </div>

                            {/* Wallet Info */}
                            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Your Side-B wallet needs <span className="font-bold text-foreground">${session.priceUsd.toFixed(2)}</span> to complete this purchase.
                                </p>

                                {evmAddress && (
                                    <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-900 rounded-sm">
                                        <code className="text-xs font-mono flex-1 truncate">
                                            {evmAddress}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={copyAddress}
                                        >
                                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Funding Options */}
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setStep('confirm')}
                                    className="w-full h-12 rounded-sm shadow-refined hover:shadow-refined-md"
                                >
                                    <Wallet className="h-4 w-4 mr-2" />
                                    I Have Funds — Continue
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => setShowOnramp(true)}
                                    className="w-full h-12 rounded-sm border-bronze/50 hover:border-bronze hover:bg-bronze/5"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Buy with Card
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    You can also send funds from any exchange or wallet to the address above.
                                </p>
                            </div>
                        </div>
                    )}

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
                                <span className="font-mono text-sm text-muted-foreground">TOTAL</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-bronze">${session.priceUsd.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment Action */}
                            <div className="space-y-3">
                                {evmAddress ? (
                                    <SendEvmTransactionButton
                                        account={evmAddress}
                                        network={NETWORK.cdpNetwork}
                                        transaction={{
                                            to: NETWORK.usdcAddress,
                                            data: transferData,
                                            chainId: NETWORK.chainId,
                                            type: 'eip1559',
                                        }}
                                        onSuccess={handleTransactionSuccess}
                                        onError={handleTransactionError}
                                        pendingLabel="Confirming..."
                                        className="w-full h-12 rounded-sm shadow-refined hover:shadow-refined-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                                    >
                                        <Wallet className="h-4 w-4 mr-2" />
                                        Complete Purchase
                                    </SendEvmTransactionButton>
                                ) : (
                                    <Button disabled className="w-full h-12 rounded-sm">
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Loading wallet...
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    onClick={() => setStep('funding')}
                                    className="w-full text-muted-foreground"
                                >
                                    ← Back to funding options
                                </Button>

                                <p className="text-center text-xs text-muted-foreground font-mono">
                                    97% goes to the artist, 3% platform fee
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Processing Step */}
                    {step === 'processing' && (
                        <div className="py-12 text-center">
                            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-bronze" />
                            <h3 className="text-lg font-bold uppercase mb-2">Processing</h3>
                            <p className="text-sm text-muted-foreground">
                                Confirming your purchase...
                            </p>
                            {txHash && (
                                <a
                                    href={getExplorerTxUrl(txHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono text-bronze hover:underline mt-2 inline-flex items-center gap-1"
                                >
                                    View transaction <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
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
                                    href={getExplorerTxUrl(txHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono text-bronze hover:underline block"
                                >
                                    View transaction on {NETWORK.explorerName} →
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
                            <h3 className="text-xl font-bold uppercase">Something Went Wrong</h3>
                            <p className="text-sm text-muted-foreground">
                                {errorMessage || 'Please try again'}
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setStep('funding')
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

            {/* Halliday On-ramp Modal */}
            {evmAddress && (
                <HallidayOnrampModal
                    isOpen={showOnramp}
                    onClose={() => setShowOnramp(false)}
                    suggestedAmount={session.priceUsd}
                    destinationAddress={evmAddress}
                    onSuccess={handleOnrampSuccess}
                />
            )}
        </>
    )
}
