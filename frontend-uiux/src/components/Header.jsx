import { Link } from 'react-router-dom'
import { Shield, Plus } from 'lucide-react'
import { Button } from './ui/button'

export function Header({ onNewCampaign }) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Private Onchain Rewards</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/campaigns" className="text-sm font-medium hover:text-primary">
            Campaigns
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Button onClick={onNewCampaign} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </nav>
      </div>
    </header>
  )
}