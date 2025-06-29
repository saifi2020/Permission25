import { createConfig, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { WALLETCONNECT_PROJECT_ID } from './config'

// Only BNB Chain
const chains = [bsc]

// Minimal, reliable config with SSR support
export const config = createConfig({
  chains,
  connectors: [
    // Primary: MetaMask and other browser wallets
    injected(),
    // Secondary: WalletConnect (minimal config)
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: false,
    }),
  ],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true, // Enable SSR support to prevent hydration mismatches
})

export const defaultChainId = 56