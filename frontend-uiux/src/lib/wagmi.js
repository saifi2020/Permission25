import { createConfig, http } from 'wagmi'
import { bsc, bscTestnet, mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet, safe } from 'wagmi/connectors'
import { CHAIN_ID, RPC_URL, ENABLE_TESTNET, WALLETCONNECT_PROJECT_ID } from './config'

// Define chains based on configuration
const chains = ENABLE_TESTNET 
  ? [bscTestnet, bsc, mainnet, polygon, optimism, arbitrum, base]
  : [bsc, mainnet, polygon, optimism, arbitrum, base]

// Create wagmi config
export const config = createConfig({
  chains,
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: false,
    }),
    coinbaseWallet({
      appName: 'Private Onchain Rewards',
    }),
    safe(),
  ],
  ssr: false,
  transports: {
    [bsc.id]: http(RPC_URL || 'https://bsc-dataseed.binance.org'),
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
})

// Export the default chain ID
export const defaultChainId = parseInt(CHAIN_ID)