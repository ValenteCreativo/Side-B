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
import { NETWORK, getExplorerAddressUrl, getExplorerTxUrl, isTestnet } from '@/lib/network-config'
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
  AlertCircle,
  Coins
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
            subtitle="YOUR_BALANCE"
            description="Manage your funds and transactions securely"
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
                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                  <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                    SIGN
                    <br />
                    IN
                    <br />
                    TO VIEW
                  </span>
                </div>
              }
            />
          </PageHero>
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_VIEW_WALLET</p>
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
          subtitle="YOUR_BALANCE"
          description="Manage your funds and transactions securely"
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
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
          <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <Wallet className="h-5 w-5 text-bronze" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Wallet Address</p>
                    <p className="font-mono font-bold tracking-tight">{user.walletAddress}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="rounded-sm border border-zinc-200 dark:border-zinc-800 hover-bronze hover:text-bronze"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-sm border border-zinc-200 dark:border-zinc-800 hover-bronze hover:text-bronze"
                  >
                    <a
                      href={getExplorerAddressUrl(user.walletAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              {isTestnet() && (
                <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <Badge variant="outline" className="rounded-sm text-[10px] border-amber-500 text-amber-600">
                    ⚠️ {NETWORK.name} (Testnet)
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="balance" className="space-y-6">
            <TabsList className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 grid grid-cols-5 h-auto p-1">
              <TabsTrigger value="balance" className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-bronze data-[state=active]:shadow-sm transition-refined">
                <Wallet className="h-4 w-4 mr-2" />
                BALANCE
              </TabsTrigger>
              <TabsTrigger value="send" className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-bronze data-[state=active]:shadow-sm transition-refined">
                <Send className="h-4 w-4 mr-2" />
                SEND
              </TabsTrigger>
              <TabsTrigger value="onramp" className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-bronze data-[state=active]:shadow-sm transition-refined">
                <DollarSign className="h-4 w-4 mr-2" />
                ON/OFF RAMP
              </TabsTrigger>
              <TabsTrigger value="bridge" className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-bronze data-[state=active]:shadow-sm transition-refined">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                BRIDGE
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-bronze data-[state=active]:shadow-sm transition-refined">
                <History className="h-4 w-4 mr-2" />
                HISTORY
              </TabsTrigger>
            </TabsList>

            {/* Balance Tab */}
            <TabsContent value="balance">
              <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono uppercase tracking-widest text-sm">Token Balances</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchBalances}
                      disabled={isLoadingBalances}
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingBalances ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingBalances ? (
                    <div className="p-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-bronze" />
                    </div>
                  ) : balances.length === 0 ? (
                    <div className="p-12 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground font-mono">NO_TOKENS_FOUND</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {balances.map((token, index) => (
                        <div key={index} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-refined">
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
              <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <CardTitle className="font-mono uppercase tracking-widest text-sm">Send Tokens</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="send-to" className="font-mono uppercase text-xs tracking-wider">Recipient Address</Label>
                    <Input
                      id="send-to"
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      placeholder="0x..."
                      className="rounded-sm border-zinc-200 dark:border-zinc-800 font-mono focus-visible:ring-bronze"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="send-amount" className="font-mono uppercase text-xs tracking-wider">Amount</Label>
                    <Input
                      id="send-amount"
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.00"
                      className="rounded-sm border-zinc-200 dark:border-zinc-800 font-mono focus-visible:ring-bronze"
                    />
                  </div>

                  <Button
                    onClick={handleSend}
                    disabled={!sendTo || !sendAmount || isSending}
                    className="w-full rounded-sm shadow-refined hover-lift"
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
              <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <CardTitle className="font-mono uppercase tracking-widest flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-bronze" />
                    Halliday On/Off-Ramp
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Buy crypto with fiat or sell crypto for fiat</p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="onramp-amount" className="font-mono uppercase text-xs tracking-wider">USD Amount</Label>
                    <Input
                      id="onramp-amount"
                      type="number"
                      value={onrampAmount}
                      onChange={(e) => setOnrampAmount(e.target.value)}
                      placeholder="100.00"
                      className="rounded-sm border-zinc-200 dark:border-zinc-800 font-mono focus-visible:ring-bronze"
                    />
                  </div>

                  <Button
                    onClick={handleOnramp}
                    disabled={!onrampAmount || isOnramping}
                    className="w-full rounded-sm shadow-refined hover:shadow-refined-md"
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

                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm">
                    <p className="text-xs text-muted-foreground font-mono">
                      ℹ️ Halliday provides secure fiat on/off-ramp services. You'll be redirected to complete the purchase.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bridge/Swap Tab */}
            <TabsContent value="bridge">
              <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <CardTitle className="font-mono uppercase tracking-widest text-sm">Get Funds</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {isTestnet() ? 'Get test tokens for development' : 'Bridge assets between networks'}
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {isTestnet() ? (
                    <>
                      {/* Testnet Faucets */}
                      <div className="space-y-4">
                        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                              <Coins className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold">Get Test ETH</p>
                              <p className="text-xs text-muted-foreground">Free testnet ETH for gas fees</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full rounded-sm"
                            asChild
                          >
                            <a
                              href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Base Faucet
                            </a>
                          </Button>
                        </div>

                        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-bold">Get Test USDC</p>
                              <p className="text-xs text-muted-foreground">Free testnet USDC for purchases</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full rounded-sm"
                            asChild
                          >
                            <a
                              href="https://faucet.circle.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Circle USDC Faucet
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 rounded-sm">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          💡 <strong>Tip:</strong> After getting test tokens, copy your wallet address above and paste it into the faucet. Tokens usually arrive within a few seconds.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <ArrowDownUp className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground font-mono mb-4">BRIDGE_COMING_SOON</p>
                      <p className="text-xs text-muted-foreground">
                        Bridge functionality will allow you to transfer assets between Base and other networks
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transaction History Tab */}
            <TabsContent value="history">
              <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono uppercase tracking-widest text-sm">Transaction History</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchTransactions}
                      disabled={isLoadingTx}
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingTx ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingTx ? (
                    <div className="p-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-bronze" />
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground font-mono">NO_TRANSACTIONS_YET</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {transactions.map((tx) => (
                        <div key={tx.hash} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-refined">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center ${tx.type === 'send' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500'
                                }`}>
                                {tx.type === 'send' ? (
                                  <Send className="h-4 w-4" />
                                ) : (
                                  <ArrowDownUp className="h-4 w-4" />
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
                                <Badge className={`rounded-sm text-[10px] px-1.5 py-0 ${tx.status === 'success' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200' :
                                  tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200' : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200'
                                  }`} variant="outline">
                                  {tx.status.toUpperCase()}
                                </Badge>
                                <a
                                  href={getExplorerTxUrl(tx.hash)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-bronze transition-refined"
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
