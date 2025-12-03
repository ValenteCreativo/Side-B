'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DollarSign, Loader2 } from 'lucide-react'
import { HallidayOnrampModal } from './HallidayOnrampModal'
import { useUser } from '@/components/auth/UserContext'
import { useToast } from '@/hooks/use-toast'

interface HallidayOnrampButtonProps {
  /**
   * Amount in USD to pre-fill (optional)
   */
  suggestedAmount?: number
  /**
   * Callback when on-ramp is successful
   */
  onSuccess?: (txHash: string) => void
  /**
   * Button variant
   */
  variant?: 'default' | 'outline' | 'ghost'
  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg'
  /**
   * Custom className
   */
  className?: string
  /**
   * Button text
   */
  children?: React.ReactNode
}

export function HallidayOnrampButton({
  suggestedAmount,
  onSuccess,
  variant = 'outline',
  size = 'default',
  className,
  children,
}: HallidayOnrampButtonProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to purchase crypto',
        variant: 'destructive',
      })
      return
    }

    setIsModalOpen(true)
  }

  const handleSuccess = (txHash: string) => {
    setIsModalOpen(false)
    onSuccess?.(txHash)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        {children || 'Buy Crypto'}
      </Button>

      {user && (
        <HallidayOnrampModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          suggestedAmount={suggestedAmount}
          destinationAddress={user.walletAddress}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
