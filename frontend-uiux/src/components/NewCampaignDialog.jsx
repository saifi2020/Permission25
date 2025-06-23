import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

export function NewCampaignDialog({ open, onOpenChange }) {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rewardAmount: '',
    tokenAddress: '',
    eligibilityCriteria: '',
    kycLevel: 'basic',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Campaign data:', formData)
    onOpenChange(false)
    setFormData({
      name: '',
      description: '',
      rewardAmount: '',
      tokenAddress: '',
      eligibilityCriteria: '',
      kycLevel: 'basic',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        {!isConnected ? (
          <div className="text-center py-8">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Please connect your wallet to create a new campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <ConnectKitButton />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a private reward distribution campaign with custom eligibility criteria.
              </DialogDescription>
            </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Early Adopter Rewards"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Reward users who participated in our testnet..."
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rewardAmount">Reward Amount</Label>
                <Input
                  id="rewardAmount"
                  type="number"
                  value={formData.rewardAmount}
                  onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tokenAddress">Token Address</Label>
                <Input
                  id="tokenAddress"
                  value={formData.tokenAddress}
                  onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
                  placeholder="0x..."
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="eligibilityCriteria">Eligibility Criteria (JSON/YAML)</Label>
              <Textarea
                id="eligibilityCriteria"
                value={formData.eligibilityCriteria}
                onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                placeholder={'{\n  "minTransactions": 10,\n  "holdingPeriod": "30d"\n}'}
                className="font-mono text-sm"
                rows={6}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="kycLevel">KYC Level</Label>
              <select
                id="kycLevel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.kycLevel}
                onChange={(e) => setFormData({ ...formData, kycLevel: e.target.value })}
              >
                <option value="none">None</option>
                <option value="basic">Basic</option>
                <option value="enhanced">Enhanced</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  )
}