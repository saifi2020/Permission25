import { useState, useEffect } from 'react'
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
import { zkProofGenerator } from '../lib/zkProof'
import { ZKConfigStatus } from './ZKConfigStatus'
import { Loader2, Shield, CheckCircle, Settings, Plus, Trash2 } from 'lucide-react'

// Inner component that uses wagmi hooks safely
function NewCampaignDialogInner({ open, onOpenChange }) {
  const { isConnected, address } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenAddress: '',
    rewardTiers: [{ wallets: '', amount: '' }],
    shareRewardAmount: '',
    shareWalletCap: '',
    eligibilityCriteria: '',
    kycLevel: 'basic',
  })
  
  const [proofState, setProofState] = useState({
    isGenerating: false,
    isGenerated: false,
    proof: null,
    error: null
  })

  const addRewardTier = () => {
    setFormData({
      ...formData,
      rewardTiers: [...formData.rewardTiers, { wallets: '', amount: '' }]
    })
  }

  const removeRewardTier = (index) => {
    if (formData.rewardTiers.length > 1) {
      const newTiers = formData.rewardTiers.filter((_, i) => i !== index)
      setFormData({ ...formData, rewardTiers: newTiers })
    }
  }

  const updateRewardTier = (index, field, value) => {
    const newTiers = formData.rewardTiers.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    )
    setFormData({ ...formData, rewardTiers: newTiers })
  }

  const calculateTotalRewards = () => {
    const tiersTotal = formData.rewardTiers.reduce((total, tier) => {
      const wallets = parseInt(tier.wallets) || 0
      const amount = parseFloat(tier.amount) || 0
      return total + (wallets * amount)
    }, 0)
    
    const shareRewardAmount = parseFloat(formData.shareRewardAmount) || 0
    
    return tiersTotal + shareRewardAmount
  }

  const generateZKProof = async (campaignData) => {
    setProofState({ ...proofState, isGenerating: true, error: null })
    
    try {
      console.log('Starting ZK proof generation for campaign...')
      
      const proofData = await zkProofGenerator.generateCampaignCreationProof({
        creatorAddress: address,
        campaignId: `${campaignData.name}_${Date.now()}`,
        secretKey: `campaign_${campaignData.name}_${campaignData.rewardAmount}`
      })
      
      setProofState({
        isGenerating: false,
        isGenerated: true,
        proof: proofData,
        error: null
      })
      
      console.log('ZK proof generated successfully:', proofData)
      return proofData
      
    } catch (error) {
      console.error('ZK proof generation failed:', error)
      setProofState({
        isGenerating: false,
        isGenerated: false,
        proof: null,
        error: error.message
      })
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Generate ZK proof before submitting campaign
      const proof = await generateZKProof(formData)
      
      const campaignWithProof = {
        ...formData,
        zkProof: proof,
        creatorAddress: address,
        timestamp: Date.now()
      }
      
      console.log('✅ Campaign data with ZK proof (DEMO):', campaignWithProof)
      console.log('🔐 In production, this would integrate with the Noir circuit in /claim-prover directory')
      
      // Here you would typically send to backend/smart contract
      // For demo purposes, we'll just log it
      
      // Reset form
      onOpenChange(false)
      setFormData({
        name: '',
        description: '',
        tokenAddress: '',
        rewardTiers: [{ wallets: '', amount: '' }],
        shareRewardAmount: '',
        shareWalletCap: '',
        eligibilityCriteria: '',
        kycLevel: 'basic',
      })
      setProofState({
        isGenerating: false,
        isGenerated: false,
        proof: null,
        error: null
      })
      
    } catch (error) {
      console.error('Campaign creation failed:', error)
    }
  }

  if (!isConnected) {
    return (
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
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Create New Campaign</DialogTitle>
          <ZKConfigStatus />
        </div>
        <DialogDescription>
          Create a private reward distribution campaign with custom criteria.
        </DialogDescription>
      </DialogHeader>
    
      <div className="max-h-[80vh] overflow-y-auto">
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
        

        
        <div className="py-2">
          <div className="space-y-4">
            {formData.rewardTiers.map((tier, index) => (
            <div key={index}>
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-1 flex items-center justify-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <div className="col-span-4">
                  <div className="grid gap-1">
                    <Label htmlFor={`rewardAmount-${index}`} className="text-xs text-muted-foreground">Token Amount</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`rewardAmount-${index}`}
                        type="number"
                        value={tier.amount}
                        onChange={(e) => updateRewardTier(index, 'amount', e.target.value)}
                        placeholder="50"
                        min="0"
                        step="0.01"
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-400 font-medium">BNB</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <select
                    id={`walletCount-${index}`}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={tier.wallets}
                    onChange={(e) => updateRewardTier(index, 'wallets', e.target.value)}
                  >
                    <option value="">Select wallet count</option>
                    <option value="10">10 wallets</option>
                    <option value="25">25 wallets</option>
                    <option value="50">50 wallets</option>
                    <option value="100">100 wallets</option>
                    <option value="200">200 wallets</option>
                    <option value="500">500 wallets</option>
                    <option value="1000">1000 wallets</option>
                  </select>
                </div>
                
                <div className="col-span-1 flex justify-center">
                  {formData.rewardTiers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRewardTier(index)}
                      className="h-10 w-10 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {index === formData.rewardTiers.length - 1 && (
                <div className="mt-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addRewardTier}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tier
                  </Button>
                </div>
              )}
            </div>
                      ))}
          </div>
          
          {/* Share Reward Section */}
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-1 flex items-center justify-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                  S
                </div>
              </div>
              
              <div className="col-span-4">
                <div className="grid gap-1">
                  <Label htmlFor="shareRewardAmount" className="text-xs text-muted-foreground">Share Reward Amount (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="shareRewardAmount"
                      type="number"
                      value={formData.shareRewardAmount}
                      onChange={(e) => setFormData({ ...formData, shareRewardAmount: e.target.value })}
                      placeholder="10"
                      min="0"
                      step="0.01"
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 font-medium">BNB</span>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="grid gap-1">
                  <Label htmlFor="shareWalletCap" className="text-xs text-muted-foreground">Wallet Cap</Label>
                  <Input
                    id="shareWalletCap"
                    type="number"
                    value={formData.shareWalletCap}
                    onChange={(e) => setFormData({ ...formData, shareWalletCap: e.target.value })}
                    placeholder="unlimited"
                    min="1"
                  />
                </div>
              </div>
            </div>
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
            rows={5}
            required
          />
        </div>
        
        {/* Campaign Summary */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="space-y-2">
            {formData.rewardTiers.map((tier, index) => {
              const wallets = parseInt(tier.wallets) || 0
              const amount = parseFloat(tier.amount) || 0
              const tierTotal = wallets * amount
              
              if (wallets === 0 || amount === 0) return null
              
              return (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {index === 0 ? 'First' : index === 1 ? 'Second' : index === 2 ? 'Third' : `${index + 1}th`} {wallets} wallets × {amount} BNB
                  </span>
                  <span className="font-medium">{tierTotal.toLocaleString()} BNB</span>
                </div>
              )
            })}
            
            {/* Share Reward Display */}
            {formData.shareRewardAmount && parseFloat(formData.shareRewardAmount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Share reward pool ({formData.shareWalletCap ? `max ${formData.shareWalletCap}` : 'unlimited'} wallets)
                </span>
                <span className="font-medium">{parseFloat(formData.shareRewardAmount).toLocaleString()} BNB</span>
              </div>
            )}
            
            {(formData.rewardTiers.some(tier => (parseInt(tier.wallets) || 0) > 0 && (parseFloat(tier.amount) || 0) > 0) || (formData.shareRewardAmount && parseFloat(formData.shareRewardAmount) > 0)) && (
              <>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Campaign Cost</span>
                    <span className="text-lg">{calculateTotalRewards().toLocaleString()} BNB</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Fixed tier wallets: {formData.rewardTiers.reduce((total, tier) => total + (parseInt(tier.wallets) || 0), 0).toLocaleString()}
                  {formData.shareRewardAmount && parseFloat(formData.shareRewardAmount) > 0 && (
                    <span> + Share pool ({formData.shareWalletCap ? `max ${formData.shareWalletCap}` : 'unlimited'})</span>
                  )}
                </div>
              </>
            )}
            
            {!formData.rewardTiers.some(tier => (parseInt(tier.wallets) || 0) > 0 && (parseFloat(tier.amount) || 0) > 0) && (
              <div className="text-sm text-muted-foreground italic">
                Add reward tiers above to see campaign summary
              </div>
            )}
          </div>
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
      </div>
      
      <DialogFooter className="flex-col gap-4">
        {/* ZK Proof Status Display */}
        {proofState.isGenerating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating zero-knowledge proof...
          </div>
        )}
        
        {proofState.isGenerated && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              ZK proof generated successfully
            </div>
            <div className={`text-xs p-2 rounded flex items-center gap-2 ${
              proofState.proof?.mode === 'service' 
                ? 'text-green-700 bg-green-50 border border-green-200' 
                : 'text-blue-700 bg-blue-50 border border-blue-200'
            }`}>
              <Settings className="h-3 w-3" />
              {proofState.proof?.mode === 'service' 
                ? '🚀 Production Mode: Real ZK proof generated via claim-prover service'
                : '💡 Demo Mode: Mock proof for browser compatibility. Ready for claim-prover integration!'
              }
            </div>
          </div>
        )}
        
        {proofState.error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Proof generation failed: {proofState.error}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={proofState.isGenerating}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={proofState.isGenerating}
            className="flex items-center gap-2"
          >
            {proofState.isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Proof...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Create Campaign with ZK Proof
              </>
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}

// Main component wrapper that only renders when mounted to prevent hydration warnings
export function NewCampaignDialog({ open, onOpenChange }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        {mounted ? (
          <NewCampaignDialogInner open={open} onOpenChange={onOpenChange} />
        ) : (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}