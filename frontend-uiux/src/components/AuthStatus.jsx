import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

export function AuthStatus({ onNewCampaign }) {
  const { isConnected, isConnecting, isReconnecting } = useAccount()

  // Show loading state during connection
  if (isConnecting || isReconnecting) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">Connecting...</div>
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