import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '../lib/wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // Reduce retries for faster feedback
    },
  },
})

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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
            // Hide non-EVM wallets
            hideBalance: false,
            hideTooltips: false,
            hideQuestionMarkCTA: true,
            // Custom wallet order (MetaMask first)
            walletConnectCTA: 'link',
            bufferPolyfill: false,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}