'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { truncateAddress } from '@/lib/utils'
import {
  Wallet,
  Send,
  ArrowDownUp,
  History,
  Copy,
  ExternalLink,
  Check,
  Loader2,
  DollarSign,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'

interface TokenBalance {
  symbol: string
  name: string
  balance: string
  usdValue: number
  decimals: number
}

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  status: 'success' | 'pending' | 'failed'
  type: 'send' | 'receive'
}

export default function WalletPage() {
  const { user } = useUser()
  const { toast } = useToast()

  // State
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingBalances, setIsLoadingBalances] = useState(true)
  const [isLoadingTx, setIsLoadingTx] = useState(true)
  const [copied, setCopied] = useState(false)

  // Send form
  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')
  const [isSending, setIsSending] = useState(false)

  // Halliday on-ramp
  const [onrampAmount, setOnrampAmount] = useState('')
  const [isOnramping, setIsOnramping] = useState(false)

  useEffect(() => {
    if (user) {
      fetchBalances()
      fetchTransactions()
    }
  }, [user])

  const fetchBalances = async () => {
    if (!user) return

    setIsLoadingBalances(true)
    try {
      const response = await fetch(`/api/wallet/balance?address=${user.walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setBalances(data.balances || [])
      }
    } catch (error) {
      console.error('Failed to fetch balances:', error)
    } finally {
      setIsLoadingBalances(false)
    }
  }

  const fetchTransactions = async () => {
    if (!user) return

    setIsLoadingTx(true)
    try {
      const response = await fetch(`/api/wallet/transactions?address=${user.walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setIsLoadingTx(false)
    }
  }

  const handleCopyAddress = () => {
    if (!user) return
    navigator.clipboard.writeText(user.walletAddress)
    setCopied(true)
    toast({
      title: 'Address copied',
      description: 'Wallet address copied to clipboard',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = async () => {
    if (!sendTo || !sendAmount || !user) return

    setIsSending(true)
    try {
      const response = await fetch('/api/wallet/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: user.walletAddress,
          to: sendTo,
          amount: sendAmount,
          token: selectedToken,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Transaction sent',
          description: 'Your transaction has been submitted',
        })
        setSendTo('')
        setSendAmount('')
        fetchBalances()
        fetchTransactions()
      } else {
        const error = await response.json()
        toast({
          title: 'Transaction failed',
          description: error.error || 'Failed to send transaction',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send transaction',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleOnramp = async () => {
    if (!onrampAmount || !user) return

    setIsOnramping(true)
    try {
      const response = await fetch('/api/wallet/halliday-onramp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: user.walletAddress,
          amount: parseFloat(onrampAmount),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Open Halliday widget
        if (data.url) {
          window.open(data.url, '_blank')
        }
        toast({
          title: 'On-ramp initiated',
          description: 'Halliday widget opened in new tab',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate on-ramp',
        variant: 'destructive',
      })
    } finally {
      setIsOnramping(false)
    }
  }

  const totalUsdValue = balances.reduce((sum, token) => sum + token.usdValue, 0)

  if (!user) {
    return (
      <AppShell>
        <div className="min-h-screen bg-background">
          <PageHero
            title="WALLET"
            subtitle="CRYPTO_VAULT"
            description="Manage your digital assets and transactions"
            sideText="SIDE B"
          >
            <VinylFlip flippable={false}
              className="w-64 h-64 ml-auto"
              front={
                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                  <Wallet className="w-32 h-32" />
                </div>
              }
              back={
                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                  <span className="font-mono text-sm font-bold tracking-widest">
                    CONNECT
                    <br />
                    YOUR
                    <br />
                    WALLET
                  </span>
                </div>
              }
            />
          </PageHero>
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-muted-foreground font-mono">PLEASE_CONNECT_WALLET</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <PageHero
          title="WALLET"
          subtitle="CRYPTO_VAULT"
          description="Manage your digital assets and transactions"
          sideText="SIDE B"
        >
          <VinylFlip flippable={false}
            className="w-64 h-64 ml-auto"
            front={
              <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                <Wallet className="w-32 h-32" />
              </div>
            }
            back={
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                <span className="font-mono text-sm font-bold tracking-widest">
                  ${totalUsdValue.toFixed(2)}
                  <br />
                  TOTAL
                  <br />
                  VALUE
                </span>
              </div>
            }
          />
        </PageHero>

        <div className="container mx-auto px-4 py-12 space-y-6">
          {/* Wallet Address Card */}
          <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-mono">Wallet Address</p>
                    <p className="font-mono font-bold">{user.walletAddress}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="rounded-none border-2 border-foreground"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-none border-2 border-foreground"
                  >
                    <a
                      href={`https://basescan.org/address/${user.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="balance" className="space-y-6">
            <TabsList className="rounded-none border-2 border-foreground bg-background grid grid-cols-5 h-auto">
              <TabsTrigger value="balance" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                <Wallet className="h-4 w-4 mr-2" />
                BALANCE
              </TabsTrigger>
              <TabsTrigger value="send" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                <Send className="h-4 w-4 mr-2" />
                SEND
              </TabsTrigger>
              <TabsTrigger value="onramp" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                <DollarSign className="h-4 w-4 mr-2" />
                ON/OFF RAMP
              </TabsTrigger>
              <TabsTrigger value="bridge" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                BRIDGE
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                <History className="h-4 w-4 mr-2" />
                HISTORY
              </TabsTrigger>
            </TabsList>

            {/* Balance Tab */}
            <TabsContent value="balance">
              <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader className="border-b-2 border-foreground">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono uppercase tracking-widest">Token Balances</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchBalances}
                      disabled={isLoadingBalances}
                      className="rounded-none border-2 border-foreground"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingBalances ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingBalances ? (
                    <div className="p-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : balances.length === 0 ? (
                    <div className="p-12 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground font-mono">NO_TOKENS_FOUND</p>
                    </div>
                  ) : (
                    <div className="divide-y-2 divide-foreground/20">
                      {balances.map((token, index) => (
                        <div key={index} className="p-4 hover:bg-secondary transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold">{token.symbol}</p>
                              <p className="text-xs text-muted-foreground">{token.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold font-mono">{token.balance} {token.symbol}</p>
                              <p className="text-xs text-muted-foreground">${token.usdValue.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Send Tab */}
            <TabsContent value="send">
              <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader className="border-b-2 border-foreground">
                  <CardTitle className="font-mono uppercase tracking-widest">Send Tokens</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="send-to" className="font-mono uppercase text-xs">Recipient Address</Label>
                    <Input
                      id="send-to"
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      placeholder="0x..."
                      className="rounded-none border-2 border-foreground font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="send-amount" className="font-mono uppercase text-xs">Amount</Label>
                    <Input
                      id="send-amount"
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.00"
                      className="rounded-none border-2 border-foreground font-mono"
                    />
                  </div>

                  <Button
                    onClick={handleSend}
                    disabled={!sendTo || !sendAmount || isSending}
                    className="w-full rounded-none border-2 border-foreground"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        SEND TRANSACTION
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* On/Off Ramp Tab (Halliday) */}
            <TabsContent value="onramp">
              <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader className="border-b-2 border-foreground">
                  <CardTitle className="font-mono uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Halliday On/Off-Ramp
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Buy crypto with fiat or sell crypto for fiat</p>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="onramp-amount" className="font-mono uppercase text-xs">USD Amount</Label>
                    <Input
                      id="onramp-amount"
                      type="number"
                      value={onrampAmount}
                      onChange={(e) => setOnrampAmount(e.target.value)}
                      placeholder="100.00"
                      className="rounded-none border-2 border-foreground font-mono"
                    />
                  </div>

                  <Button
                    onClick={handleOnramp}
                    disabled={!onrampAmount || isOnramping}
                    className="w-full rounded-none border-2 border-foreground"
                  >
                    {isOnramping ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        OPENING_HALLIDAY...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        BUY CRYPTO WITH HALLIDAY
                      </>
                    )}
                  </Button>

                  <div className="p-4 border-2 border-foreground/20 bg-secondary/20">
                    <p className="text-xs text-muted-foreground font-mono">
                      ℹ️ Halliday provides secure fiat on/off-ramp services. You'll be redirected to complete the purchase.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bridge Tab */}
            <TabsContent value="bridge">
              <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader className="border-b-2 border-foreground">
                  <CardTitle className="font-mono uppercase tracking-widest">Bridge Assets</CardTitle>
                  <p className="text-xs text-muted-foreground">Transfer tokens between networks</p>
                </CardHeader>
                <CardContent className="p-12 text-center">
                  <ArrowDownUp className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground font-mono mb-4">BRIDGE_COMING_SOON</p>
                  <p className="text-xs text-muted-foreground">
                    Bridge functionality will allow you to transfer assets between Base and other networks
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transaction History Tab */}
            <TabsContent value="history">
              <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader className="border-b-2 border-foreground">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono uppercase tracking-widest">Transaction History</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchTransactions}
                      disabled={isLoadingTx}
                      className="rounded-none border-2 border-foreground"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingTx ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingTx ? (
                    <div className="p-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground font-mono">NO_TRANSACTIONS_YET</p>
                    </div>
                  ) : (
                    <div className="divide-y-2 divide-foreground/20">
                      {transactions.map((tx) => (
                        <div key={tx.hash} className="p-4 hover:bg-secondary transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-none border-2 border-foreground flex items-center justify-center ${
                                tx.type === 'send' ? 'bg-red-500' : 'bg-green-500'
                              }`}>
                                {tx.type === 'send' ? (
                                  <Send className="h-4 w-4 text-white" />
                                ) : (
                                  <ArrowDownUp className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-sm uppercase">{tx.type}</p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {tx.type === 'send' ? `To: ${truncateAddress(tx.to)}` : `From: ${truncateAddress(tx.from)}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold">{tx.value} ETH</p>
                              <div className="flex items-center gap-2 justify-end mt-1">
                                <Badge className={`rounded-none text-xs ${
                                  tx.status === 'success' ? 'bg-green-500' :
                                  tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                  {tx.status.toUpperCase()}
                                </Badge>
                                <a
                                  href={`https://basescan.org/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
