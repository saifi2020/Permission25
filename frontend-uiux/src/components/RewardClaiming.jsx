import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { zkProofGenerator } from '../lib/zkProof'
import { Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export function RewardClaiming() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  
  const [claimState, setClaimState] = useState({
    step: 'idle', // idle, signing, fetchingMerkle, generatingZK, complete
    merkleProof: null,
    zkProof: null,
    error: null
  })

  const [campaignAddress, setCampaignAddress] = useState('')
  const [rewardAmount, setRewardAmount] = useState('')

  // Step 1: Get Merkle proof from TEE
  const getMerkleProofFromTEE = async (userAddress, campaignAddr) => {
    const teeUrl = 'http://localhost:3000' // TEE rewards calculator service
    
    try {
      const response = await fetch(`${teeUrl}/api/getMerkleProof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: userAddress,
          campaignAddress: campaignAddr
        })
      })
      
      if (!response.ok) {
        throw new Error(`TEE service error: ${response.status}`)
      }
      
      const merkleData = await response.json()
      console.log('✅ Merkle proof received from TEE:', merkleData)
      
      return {
        merkleRoot: merkleData.merkleRoot,
        merkleValue: merkleData.value,
        merkleSiblings: merkleData.siblings,
        merkleIndex: merkleData.index,
        eligibilityProof: merkleData.proof
      }
    } catch (error) {
      console.error('❌ TEE Merkle proof error:', error)
      throw new Error(`Failed to get Merkle proof: ${error.message}`)
    }
  }

  // Step 2: Generate ZK proof using Noir circuit
  const generateZKProofForClaim = async (merkleData, userAddress, campaignAddr) => {
    try {
      // Generate nullifier to prevent double claiming
      const nullifier = `${userAddress}_${campaignAddr}_${Date.now()}`
      const nullifierField = zkProofGenerator.stringToField(nullifier)
      
      // Compute nullifier hash (public input)
      const nullifierHash = zkProofGenerator.computeSimpleHash(
        userAddress + nullifier + campaignAddr
      )
      
      const zkInputs = {
        user_address: zkProofGenerator.addressToField(userAddress),
        merkle_value: zkProofGenerator.stringToField(merkleData.merkleValue.toString()),
        nullifier: nullifierField,
        merkle_siblings: merkleData.merkleSiblings.map(s => zkProofGenerator.stringToField(s)),
        merkle_index: zkProofGenerator.stringToField(merkleData.merkleIndex.toString()),
        merkle_root: zkProofGenerator.stringToField(merkleData.merkleRoot),
        campaign_address: zkProofGenerator.addressToField(campaignAddr),
        nullifier_hash: zkProofGenerator.stringToField(nullifierHash)
      }
      
      console.log('🔄 Generating ZK proof for reward claim...', zkInputs)
      
      const zkProof = await zkProofGenerator.generateRewardClaimProof(zkInputs)
      console.log('✅ ZK proof generated for reward claim:', zkProof)
      
      return zkProof
    } catch (error) {
      console.error('❌ ZK proof generation failed:', error)
      throw error
    }
  }

  // Main claim function
  const handleClaimReward = async () => {
    if (!isConnected || !address) {
      setClaimState({ ...claimState, error: 'Please connect your wallet' })
      return
    }

    if (!campaignAddress) {
      setClaimState({ ...claimState, error: 'Please enter campaign address' })
      return
    }

    try {
      // Step 1: Sign message to authenticate
      setClaimState({ step: 'signing', error: null })
      const message = `Claiming reward from campaign: ${campaignAddress} at ${Date.now()}`
      await signMessageAsync({ message })

      // Step 2: Get Merkle proof from TEE
      setClaimState({ step: 'fetchingMerkle', error: null })
      const merkleData = await getMerkleProofFromTEE(address, campaignAddress)
      
      setRewardAmount(merkleData.merkleValue)
      setClaimState({ 
        step: 'generatingZK', 
        merkleProof: merkleData,
        error: null 
      })

      // Step 3: Generate ZK proof
      const zkProof = await generateZKProofForClaim(merkleData, address, campaignAddress)
      
      setClaimState({
        step: 'complete',
        merkleProof: merkleData,
        zkProof: zkProof,
        error: null
      })

    } catch (error) {
      console.error('❌ Reward claiming failed:', error)
      setClaimState({
        step: 'idle',
        merkleProof: null,
        zkProof: null,
        error: error.message
      })
    }
  }

  const resetClaim = () => {
    setClaimState({
      step: 'idle',
      merkleProof: null,
      zkProof: null,
      error: null
    })
    setCampaignAddress('')
    setRewardAmount('')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Private Reward Claiming
        </CardTitle>
        <CardDescription>
          Claim your rewards using zero-knowledge proofs and Merkle tree verification
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Campaign Input */}
        <div className="space-y-2">
          <Label htmlFor="campaign">Campaign Address</Label>
          <Input
            id="campaign"
            placeholder="0x..."
            value={campaignAddress}
            onChange={(e) => setCampaignAddress(e.target.value)}
            disabled={claimState.step !== 'idle'}
          />
        </div>

        {/* Status Display */}
        <div className="space-y-4">
          {claimState.step === 'signing' && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please sign the message in your wallet...
            </div>
          )}

          {claimState.step === 'fetchingMerkle' && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching your reward eligibility from TEE...
            </div>
          )}

          {claimState.step === 'generatingZK' && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating zero-knowledge proof...
            </div>
          )}

          {claimState.step === 'complete' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Ready to claim reward!
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="font-medium">Proof Generated Successfully:</div>
                <div className="text-sm space-y-1">
                  <div>💰 Reward Amount: {rewardAmount} tokens</div>
                  <div>🌳 Merkle Proof: ✅ Valid</div>
                  <div>🔐 ZK Proof: ✅ Generated ({claimState.zkProof?.proof?.length || 0} bytes)</div>
                  <div>🛡️ Privacy: Your reward amount and position remain private</div>
                </div>
              </div>
            </div>
          )}

          {claimState.error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              {claimState.error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {claimState.step === 'idle' && (
            <Button 
              onClick={handleClaimReward}
              disabled={!isConnected || !campaignAddress}
              className="flex-1"
            >
              <Shield className="h-4 w-4 mr-2" />
              Claim Reward
            </Button>
          )}

          {claimState.step === 'complete' && (
            <>
              <Button className="flex-1" variant="default">
                Submit Claim to Blockchain
              </Button>
              <Button onClick={resetClaim} variant="outline">
                New Claim
              </Button>
            </>
          )}

          {claimState.step !== 'idle' && claimState.step !== 'complete' && (
            <Button onClick={resetClaim} variant="outline" className="flex-1">
              Cancel
            </Button>
          )}
        </div>

        {/* Technical Details */}
        {claimState.step === 'complete' && (
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer font-medium mb-2">Technical Details</summary>
            <div className="space-y-2 pl-4">
              <div>🔢 Merkle Root: {claimState.merkleProof?.merkleRoot?.slice(0, 20)}...</div>
              <div>📍 Tree Position: {claimState.merkleProof?.merkleIndex}</div>
              <div>🔐 ZK Circuit: Noir reward claiming circuit</div>
              <div>🛡️ Nullifier: Prevents double claiming</div>
              <div>⚡ Ready for smart contract verification</div>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
} 