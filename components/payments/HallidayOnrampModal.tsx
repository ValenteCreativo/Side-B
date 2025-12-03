'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { DollarSign, Loader2, ExternalLink, CheckCircle2, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Quote {
  payment_id: string
  provider: string
  input_amount: string
  output_amount: string
  fees: {
    total_fee_usd: string
    network_fee_usd: string
    provider_fee_usd: string
  }
  rate: string
  estimated_time_seconds: number
}

interface HallidayOnrampModalProps {
  isOpen: boolean
  onClose: () => void
  suggestedAmount?: number
  destinationAddress: string
  onSuccess?: (txHash: string) => void
}

export function HallidayOnrampModal({
  isOpen,
  onClose,
  suggestedAmount,
  destinationAddress,
  onSuccess,
}: HallidayOnrampModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<'input' | 'quotes' | 'payment'>('input')
  const [inputAmount, setInputAmount] = useState(suggestedAmount?.toString() || '20')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('input')
        setQuotes([])
        setSelectedQuote(null)
        setWidgetUrl(null)
      }, 300)
    }
  }, [isOpen])

  const handleGetQuotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/halliday/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputAmount,
          outputAsset: {
            symbol: 'USDC',
            chain_id: '8453', // Base
            contract_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          },
          destinationAddress,
          onrampMethods: ['CREDIT_DEBIT_CARD'],
          countryCode: 'USA',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get quotes')
      }

      const data = await response.json()
      setQuotes(data.quotes)
      setStep('quotes')
    } catch (error) {
      console.error('Error getting quotes:', error)
      toast({
        title: 'Error',
        description: 'Failed to get quotes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectQuote = async (quote: Quote) => {
    setIsLoading(true)
    setSelectedQuote(quote)

    try {
      const response = await fetch('/api/halliday/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: quote.payment_id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to confirm quote')
      }

      const data = await response.json()
      setWidgetUrl(data.widget_url)
      setStep('payment')

      // Open Halliday widget in new window
      if (data.widget_url) {
        window.open(data.widget_url, '_blank', 'width=500,height=800')
      }
    } catch (error) {
      console.error('Error confirming quote:', error)
      toast({
        title: 'Error',
        description: 'Failed to confirm quote. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-2 border-foreground rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <DialogHeader className="border-b-2 border-foreground pb-4">
          <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
            Buy Crypto
          </DialogTitle>
          <DialogDescription className="font-mono text-xs uppercase tracking-widest">
            Powered by Halliday • Fiat to USDC
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Input Amount */}
        {step === 'input' && (
          <div className="space-y-6 py-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">
                How much USD?
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  min="20"
                  max="10000"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="pl-12 text-2xl font-bold h-16 border-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="20"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                MIN: $20 • MAX: $10,000
              </p>
            </div>

            <div className="p-4 border-2 border-foreground bg-muted/20">
              <h4 className="font-bold uppercase text-sm mb-2">You'll receive:</h4>
              <p className="text-xs text-muted-foreground font-mono">
                ≈ ${inputAmount} USDC on Base Network
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                (Actual amount depends on fees and exchange rate)
              </p>
            </div>

            <div className="flex gap-2">
              {['20', '50', '100', '250'].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputAmount(amount)}
                  className="flex-1 rounded-none border-foreground hover:bg-foreground hover:text-background"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleGetQuotes}
              disabled={isLoading || !inputAmount || parseFloat(inputAmount) < 20}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none text-sm font-bold uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Quotes...
                </>
              ) : (
                'Get Quotes'
              )}
            </Button>
          </div>
        )}

        {/* Step 2: Select Quote */}
        {step === 'quotes' && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold uppercase">Available Providers</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('input')}
                className="rounded-none text-xs uppercase"
              >
                Back
              </Button>
            </div>

            {quotes.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-foreground/20">
                <p className="font-mono text-muted-foreground">No quotes available</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {quotes.map((quote) => (
                  <div
                    key={quote.payment_id}
                    className="group relative cursor-pointer"
                    onClick={() => handleSelectQuote(quote)}
                  >
                    <div className="absolute inset-0 bg-foreground translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                    <div className="relative bg-background border-2 border-foreground p-4 hover:-translate-y-1 transition-transform">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="rounded-none border-foreground bg-foreground text-background uppercase text-xs font-bold">
                            {quote.provider}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {parseFloat(quote.output_amount).toFixed(2)} USDC
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            Rate: ${parseFloat(quote.rate).toFixed(4)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-muted-foreground">Input:</span>{' '}
                          <span className="font-bold">${parseFloat(quote.input_amount).toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fees:</span>{' '}
                          <span className="font-bold">${parseFloat(quote.fees.total_fee_usd).toFixed(2)}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>≈{Math.round(quote.estimated_time_seconds / 60)} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && selectedQuote && (
          <div className="space-y-6 py-6">
            <div className="text-center py-8 border-2 border-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold uppercase mb-2">Quote Confirmed</h3>
              <p className="text-sm text-muted-foreground font-mono">
                Complete payment in the popup window
              </p>
            </div>

            <div className="p-4 border-2 border-foreground bg-muted/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-mono text-muted-foreground">Provider:</span>
                <span className="font-bold uppercase">{selectedQuote.provider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-muted-foreground">Amount:</span>
                <span className="font-bold">${parseFloat(selectedQuote.input_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-muted-foreground">Receiving:</span>
                <span className="font-bold">{parseFloat(selectedQuote.output_amount).toFixed(2)} USDC</span>
              </div>
            </div>

            {widgetUrl && (
              <Button
                onClick={() => window.open(widgetUrl, '_blank', 'width=500,height=800')}
                variant="outline"
                className="w-full rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Reopen Payment Window
              </Button>
            )}

            <div className="text-center">
              <Button
                onClick={onClose}
                className="rounded-none bg-foreground text-background hover:bg-foreground/90"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
