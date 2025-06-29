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
import { Loader2, Shield, CheckCircle, Settings } from 'lucide-react'

// Inner component that uses wagmi hooks safely
function NewCampaignDialogInner({ open, onOpenChange }) {
  const { isConnected, address } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rewardAmount: '',
    tokenAddress: '',
    eligibilityCriteria: '',
    kycLevel: 'basic',
  })
  
  const [proofState, setProofState] = useState({
    isGenerating: false,
    isGenerated: false,
    proof: null,
    error: null
  })

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
        rewardAmount: '',
        tokenAddress: '',
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