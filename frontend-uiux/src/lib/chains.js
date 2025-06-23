// Chain configuration with proper BNB Chain support
export const CHAIN_CONFIG = {
  56: {
    name: 'BNB Smart Chain',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org',
  },
  97: {
    name: 'BNB Smart Chain Testnet',
    currency: 'tBNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  },
  1: {
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://eth.llamarpc.com',
  },
  137: {
    name: 'Polygon',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com',
  },
}

export const getChainConfig = (chainId) => {
  return CHAIN_CONFIG[chainId] || CHAIN_CONFIG[56] // Default to BSC
}

export const getExplorerUrl = (chainId, address) => {
  const config = getChainConfig(chainId)
  return `${config.explorerUrl}/address/${address}`
}