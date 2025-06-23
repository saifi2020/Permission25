import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '../lib/wagmi'
import { ClientOnly } from './ClientOnly'

// Create QueryClient with configuration optimized for wallet persistence
let queryClient

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: true, // Allow refetch on mount for wallet state
          refetchOnReconnect: true, // Allow refetch on reconnect
          retry: 1, // Allow limited retries for wallet connection
          staleTime: 5000, // Shorter stale time for wallet state
        },
        mutations: {
          retry: false,
        },
      },
    })
  }
  return queryClient
}

function Web3ProviderInner({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={getQueryClient()}>
        <ConnectKitProvider
          theme="auto"
          mode="light"
          customTheme={{
            "--ck-font-family": '"Inter", sans-serif',
            "--ck-border-radius": "8px",
            "--ck-connectbutton-border-radius": "8px",
            "--ck-connectbutton-background": "hsl(var(--primary))",
            "--ck-connectbutton-color": "hsl(var(--primary-foreground))",
            "--ck-connectbutton-hover-background": "hsl(var(--primary) / 0.9)",
          }}
          options={{
            embedGoogleFonts: true,
            walletConnectName: "Private Onchain Rewards",
            initialChainId: 56, // Force BNB Chain
            enforceSupportedChains: true, // Only allow supported chains
            disclaimer: (
              <>
                By connecting your wallet, you agree to our{' '}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  Terms of Service
                </a>
                <br />
                <strong>Note:</strong> Only BNB Chain (BSC) is supported. MetaMask recommended.
              </>
            ),
            // Wallet connection options
            hideBalance: false,
            hideTooltips: false,
            hideQuestionMarkCTA: true,
            walletConnectCTA: 'link',
            bufferPolyfill: false,
            // Reduce motion for better performance
            reducedMotion: true,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function Web3Provider({ children }) {
  return (
    <ClientOnly fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Web3ProviderInner>{children}</Web3ProviderInner>
    </ClientOnly>
  )
}