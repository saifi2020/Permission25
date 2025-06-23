// Configurable ZK Proof System
// Supports both mock mode for development and claim-prover service integration
import zkConfig from '../config/zkConfig.json'

// Mock ZK proof generation for browser compatibility
function simulateZKProofGeneration(inputs, config) {
  return new Promise((resolve) => {
    const delay = config.mockSettings?.generationDelay || 2000
    
    if (config.mockSettings?.enableLogs) {
      console.log('🔄 Mock ZK Proof: Simulating circuit execution...')
    }
    
    setTimeout(() => {
      const mockProof = {
        proof: Array.from(crypto.getRandomValues(new Uint8Array(64))),
        publicInputs: [
          inputs.creator_address,
          inputs.campaign_id
        ],
        verificationKey: Array.from(crypto.getRandomValues(new Uint8Array(32))),
        mode: 'mock'
      }
      
      if (config.mockSettings?.enableLogs) {
        console.log('✅ Mock ZK Proof: Generated successfully')
      }
      
      resolve(mockProof)
    }, delay)
  })
}

// Real ZK proof generation using claim-prover service
async function generateProofViaService(inputs, config) {
  const { baseUrl, endpoints, timeout } = config.claimProverService
  
  try {
    console.log('🔄 Claim-Prover Service: Generating real ZK proof...')
    
    const response = await fetch(`${baseUrl}${endpoints.generateProof}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: inputs,
        circuitPath: config.claimProverService.circuitPath
      }),
      signal: AbortSignal.timeout(timeout)
    })
    
    if (!response.ok) {
      throw new Error(`Claim-prover service error: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Claim-Prover Service: Real ZK proof generated')
    
    return {
      ...result,
      mode: 'service'
    }
    
  } catch (error) {
    console.error('❌ Claim-Prover Service error:', error)
    throw new Error(`Failed to generate proof via claim-prover service: ${error.message}`)
  }
}

// Real ZK proof verification using claim-prover service
async function verifyProofViaService(proofData, config) {
  const { baseUrl, endpoints, timeout } = config.claimProverService
  
  try {
    console.log('🔄 Claim-Prover Service: Verifying real ZK proof...')
    
    const response = await fetch(`${baseUrl}${endpoints.verifyProof}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proof: proofData.proof,
        publicInputs: proofData.publicInputs,
        verificationKey: proofData.verificationKey
      }),
      signal: AbortSignal.timeout(timeout)
    })
    
    if (!response.ok) {
      throw new Error(`Claim-prover verification error: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Claim-Prover Service: Proof verification complete')
    
    return result.isValid
    
  } catch (error) {
    console.error('❌ Claim-Prover Service verification error:', error)
    throw new Error(`Failed to verify proof via claim-prover service: ${error.message}`)
  }
}

class ZKProofGenerator {
  constructor() {
    this.isInitialized = false
    this.config = zkConfig.zkProof
  }

  async initialize() {
    try {
      if (this.isInitialized) return

      const mode = this.config.mode
      const isServiceMode = mode === 'service' && this.config.claimProverService.enabled
      
      console.log(`🔧 Initializing ZK proof system in ${isServiceMode ? 'SERVICE' : 'MOCK'} mode...`)
      
      if (isServiceMode) {
        // Test connection to claim-prover service
        await this.testServiceConnection()
      } else {
        // Mock initialization
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      this.isInitialized = true
      console.log(`✅ ZK proof system initialized successfully (${isServiceMode ? 'SERVICE' : 'MOCK'} mode)`)
    } catch (error) {
      console.error('❌ Failed to initialize ZK proof system:', error)
      throw error
    }
  }

  async testServiceConnection() {
    try {
      const { baseUrl } = this.config.claimProverService
      
      // Test connection using REST API health endpoint
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      
      if (!response.ok) {
        throw new Error(`Service health check failed: ${response.status}`)
      }
      
      const result = await response.json()
      
      // Check if we got a valid health response
      if (!result.status || result.status !== 'healthy') {
        throw new Error('Invalid health response from service')
      }
      
      console.log('✅ ZK Proof service connection verified:', result.service)
    } catch (error) {
      console.warn('⚠️ ZK Proof service connection failed, falling back to mock mode')
      this.config.claimProverService.enabled = false
      throw error
    }
  }

  // Note: Campaign creation doesn't need ZK proofs anymore
  // This method kept for backward compatibility but not recommended
  async generateCampaignCreationProof(campaignData) {
    console.warn('⚠️ Campaign creation no longer requires ZK proofs')
    return {
      proof: [],
      publicInputs: [],
      verificationKey: [],
      mode: 'deprecated',
      timestamp: Date.now()
    }
  }

  // NEW: Generate ZK proof for reward claiming (this is where ZK is actually needed)
  async generateRewardClaimProof(claimInputs) {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      console.log('🔄 Generating ZK proof for reward claim...')

      console.log('📝 Reward claim inputs prepared:', claimInputs)

      // Choose proof generation method based on config
      const isServiceMode = this.config.mode === 'service' && this.config.claimProverService.enabled
      let proof

      if (isServiceMode) {
        // Use real claim-prover service with Noir circuit
        proof = await generateProofViaService(claimInputs, this.config)
      } else {
        // Use mock generation for development
        proof = await simulateZKProofGeneration(claimInputs, this.config)
      }

      console.log('✅ ZK proof for reward claim generated successfully')

      return {
        proof: proof.proof,
        publicInputs: proof.publicInputs,
        verificationKey: proof.verificationKey,
        claimData: claimInputs,
        timestamp: Date.now(),
        mode: proof.mode,
        type: 'reward_claim'
      }
    } catch (error) {
      console.error('❌ Failed to generate reward claim ZK proof:', error)
      throw error
    }
  }

  // Helper method to compute simple hash for nullifiers
  computeSimpleHash(input) {
    // Simple hash function for demo purposes
    // In production, this should match the circuit's hash function
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString()
  }

  async verifyProof(proofData) {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      const isServiceMode = this.config.mode === 'service' && this.config.claimProverService.enabled
      console.log(`🔍 Verifying ZK proof (${isServiceMode ? 'SERVICE' : 'MOCK'} mode)...`)
      
      let verification

      if (isServiceMode) {
        // Use real claim-prover service verification
        verification = await verifyProofViaService(proofData, this.config)
      } else {
        // Mock verification
        const delay = this.config.mockSettings?.verificationDelay || 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        
        verification = (proofData.mode === 'mock' || proofData.mockProof === true) && 
                      proofData.proof && 
                      proofData.publicInputs && 
                      proofData.verificationKey
      }

      console.log('✅ Proof verification result:', verification)
      return verification
    } catch (error) {
      console.error('❌ Failed to verify ZK proof:', error)
      throw error
    }
  }

  // Utility functions to convert data to field elements
  addressToField(address) {
    if (!address || address === '0x') return '0x1'
    // Take last 8 characters of address for simplicity
    const hex = address.slice(-8)
    return '0x' + hex.padStart(16, '0')
  }

  stringToField(str) {
    if (!str) return '0x1'
    // Convert string to hex representation (simplified)
    let hex = ''
    for (let i = 0; i < Math.min(str.length, 8); i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0')
    }
    return '0x' + hex.padStart(16, '0')
  }
}

// Export singleton instance
export const zkProofGenerator = new ZKProofGenerator()

// Export utility functions
export { ZKProofGenerator } 