import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Button } from './ui/button'
import { Plus, AlertTriangle } from 'lucide-react'

export function AuthStatus({ onNewCampaign }) {
  const { isConnected, isConnecting, isReconnecting } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Show loading state during connection
  if (isConnecting || isReconnecting) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">Connecting...</div>
      </div>
    )
  }

  // Show wrong network warning if connected but not on BNB Chain (56)
  if (isConnected && chainId !== 56) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>Wrong Network</span>
        </div>
        <Button 
          onClick={() => switchChain({ chainId: 56 })}
          size="sm" 
          variant="destructive"
        >
          Switch to BNB Chain
        </Button>
        <ConnectKitButton />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {isConnected && (
        <Button onClick={onNewCampaign} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      )}
      <ConnectKitButton />
    </div>
  )
}