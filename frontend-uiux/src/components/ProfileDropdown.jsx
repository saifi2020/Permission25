import { useAccount, useDisconnect, useEnsName, useEnsAvatar, useChainId } from 'wagmi'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { 
  User, 
  LogOut, 
  Copy, 
  ExternalLink,
  Plus
} from 'lucide-react'
import { useState } from 'react'
import { getExplorerUrl, getChainConfig } from '../lib/chains'

export function ProfileDropdown({ onNewCampaign }) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })
  const [copied, setCopied] = useState(false)
  
  const chainConfig = getChainConfig(chainId)

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openBlockExplorer = () => {
    window.open(getExplorerUrl(chainId, address), '_blank')
  }

  return (
    <div className="flex items-center space-x-3">
      <Button onClick={onNewCampaign} size="sm" variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        New Campaign
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-primary hover:ring-offset-2"
          >
            {ensAvatar ? (
              <img 
                src={ensAvatar} 
                alt="Profile" 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {ensName || 'Anonymous'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {shortenAddress(address)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={openBlockExplorer} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>View on {chainConfig.name}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => disconnect()} 
            className="cursor-pointer text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}