import { Github, Twitter, FileText } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 Private Onchain Rewards. Built for Web3 Privacy.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by TEE, ZKP, and Smart Contracts
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <FileText className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}