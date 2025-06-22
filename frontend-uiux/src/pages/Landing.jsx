import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ArrowRight, Lock, Zap, Shield, Users, ChevronRight } from 'lucide-react'

export function Landing({ onNewCampaign }) {
  const features = [
    {
      icon: Lock,
      title: "Privacy-First Architecture",
      description: "Leverage TEE and ZKP to ensure user data remains confidential while proving eligibility"
    },
    {
      icon: Zap,
      title: "Scalable Distribution",
      description: "Efficiently distribute rewards to thousands of users without revealing the entire participant list"
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "Built-in KYC/KYT integration through Forte's compliance layer for regulated environments"
    },
    {
      icon: Users,
      title: "Flexible Eligibility",
      description: "Support complex criteria combining onchain behavior and offchain events seamlessly"
    }
  ]

  return (
    <div className="flex-1">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Private Onchain Rewards
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Distribute rewards securely and privately using cutting-edge cryptography. 
              Your users stay anonymous while you maintain complete compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={onNewCampaign}>
                Launch Campaign
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campaigns">
                  View Active Campaigns
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Enterprise-Grade Privacy for Web3 Rewards
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="space-y-3">
                <feature.icon className="h-10 w-10 text-primary" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary/10 rounded-lg p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 pt-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <h3 className="font-semibold">Define Criteria</h3>
                <p className="text-sm text-muted-foreground">
                  Set eligibility rules using onchain data, offchain events, or both
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <h3 className="font-semibold">Generate Proofs</h3>
                <p className="text-sm text-muted-foreground">
                  TEE creates Merkle tree, users generate ZK proofs of inclusion
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <h3 className="font-semibold">Claim Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Users claim anonymously while meeting compliance requirements
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Transform Your Reward Distribution?</h2>
          <p className="text-lg text-muted-foreground">
            Join the future of private, compliant, and scalable onchain rewards
          </p>
          <Button size="lg" onClick={onNewCampaign}>
            Create Your First Campaign
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}