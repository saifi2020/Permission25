// Environment configuration utility
// Supports both Vite dev environment and Docker runtime injection

const getConfig = () => {
  // In production with Docker, use runtime injected config
  if (window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  
  // In development, use Vite environment variables
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    VITE_CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '56',
    VITE_RPC_URL: import.meta.env.VITE_RPC_URL || 'https://bsc-dataseed.binance.org',
    VITE_FACTORY_CONTRACT_ADDRESS: import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    VITE_VERIFIER_CONTRACT_ADDRESS: import.meta.env.VITE_VERIFIER_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    VITE_FORTE_API_URL: import.meta.env.VITE_FORTE_API_URL || 'https://api.forte.io',
    VITE_IPFS_GATEWAY: import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    VITE_TEE_ENDPOINT: import.meta.env.VITE_TEE_ENDPOINT || 'http://localhost:8080',
    VITE_ENABLE_TESTNET: import.meta.env.VITE_ENABLE_TESTNET === 'true' || false,
    VITE_WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2fac6d322c1f39c27f18efa0c7a6a0f2',
  }
}

export const config = getConfig()

// Export individual config values for convenience
export const {
  VITE_API_URL: API_URL,
  VITE_CHAIN_ID: CHAIN_ID,
  VITE_RPC_URL: RPC_URL,
  VITE_FACTORY_CONTRACT_ADDRESS: FACTORY_CONTRACT_ADDRESS,
  VITE_VERIFIER_CONTRACT_ADDRESS: VERIFIER_CONTRACT_ADDRESS,
  VITE_FORTE_API_URL: FORTE_API_URL,
  VITE_IPFS_GATEWAY: IPFS_GATEWAY,
  VITE_TEE_ENDPOINT: TEE_ENDPOINT,
  VITE_ENABLE_TESTNET: ENABLE_TESTNET,
  VITE_WALLETCONNECT_PROJECT_ID: WALLETCONNECT_PROJECT_ID,
} = config