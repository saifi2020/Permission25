import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Github, Twitter, Linkedin, Globe, MapPin, Calendar, Trophy } from 'lucide-react'

export function About() {
  const team = [
    {
      name: "Adrian Self",
      role: "Smart Contract Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      github: "alexchen",
      twitter: "alexchen_dev",
      description: "Blockchain architect with expertise in ZK proofs and DeFi protocols"
    },
    {
      name: "Jie Peng",
      role: "Frontend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      github: "sarahj",
      linkedin: "sarah-johnson",
      description: "React specialist focused on Web3 UX and wallet integrations"
    },
    {
      name: "Mike C",
      role: "Backend Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      github: "mwilliams",
      twitter: "marcus_web3",
      description: "TEE integration expert and distributed systems engineer"
    },
    {
      name: "Brandon Shaw",
      role: "Frontend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      linkedin: "priya-patel",
      website: "priyapatil.design",
      description: "UX/UI designer specializing in privacy-preserving interfaces"
    },
    {
      name: "Saif",
      role: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      linkedin: "priya-patel",
      website: "priyapatil.design",
      description: "UX/UI designer specializing in privacy-preserving interfaces"
    }
  ]

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Private Onchain Rewards</h1>
          <div className="flex items-center justify-center space-x-4 text-muted-foreground">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              <span className="text-sm">Permissionless Hackathon IV</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Industry City, Brooklyn NY</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">June 22-23, 2025</span>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Private Onchain Rewards is a cutting-edge platform that revolutionizes how organizations distribute rewards 
              while maintaining complete privacy and regulatory compliance. Built during the Permissionless Hackathon IV, 
              our solution addresses the critical challenge of rewarding users based on complex eligibility criteria without 
              exposing sensitive data or participant lists.
            </p>
            <p>
              By leveraging a powerful combination of Trusted Execution Environments (TEE), Zero-Knowledge Proofs (ZKP), 
              and smart contract composability, we enable organizations to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Privately verify user eligibility without revealing identity</li>
              <li>Distribute rewards based on both onchain and offchain criteria</li>
              <li>Maintain full regulatory compliance through Forte's KYC/KYT integration</li>
              <li>Scale to thousands of participants while preserving privacy</li>
            </ul>
            <p>
              Our platform is designed for the future of Web3, where privacy and compliance coexist seamlessly. 
              Whether you're rewarding early adopters, incentivizing specific behaviors, or conducting airdrops, 
              Private Onchain Rewards ensures that your distribution is secure, private, and compliant.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Meet the Team</h2>
            <p className="text-muted-foreground">
              The builders who brought Private Onchain Rewards to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="h-20 w-20 rounded-full bg-muted"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.description}
                      </p>
                      <div className="flex items-center space-x-3 pt-2">
                        {member.github && (
                          <a 
                            href={`https://github.com/${member.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {member.twitter && (
                          <a 
                            href={`https://twitter.com/${member.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a 
                            href={`https://linkedin.com/in/${member.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {member.website && (
                          <a 
                            href={`https://${member.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>
              Built with cutting-edge Web3 technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="outline" className="justify-center py-2">React + Vite</Badge>
              <Badge variant="outline" className="justify-center py-2">BNB Chain</Badge>
              <Badge variant="outline" className="justify-center py-2">Zero-Knowledge Proofs</Badge>
              <Badge variant="outline" className="justify-center py-2">TEE Integration</Badge>
              <Badge variant="outline" className="justify-center py-2">ConnectKit</Badge>
              <Badge variant="outline" className="justify-center py-2">Tailwind CSS</Badge>
              <Badge variant="outline" className="justify-center py-2">shadcn/ui</Badge>
              <Badge variant="outline" className="justify-center py-2">Forte Compliance</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}