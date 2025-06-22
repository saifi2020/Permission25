import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { ArrowLeft, Download, Shield, Users, Coins, Calendar, CheckCircle, Clock } from 'lucide-react'

export function CampaignDetails() {
  const { id } = useParams()

  const campaign = {
    id: 1,
    name: 'Early Adopter Rewards',
    description: 'Reward users who participated in our testnet phase and provided valuable feedback. This campaign aims to recognize and incentivize our early community members who helped shape our protocol.',
    status: 'active',
    totalRewards: '10,000 USDC',
    tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    participants: 1234,
    claimed: 892,
    startDate: '2025-06-01',
    endDate: '2025-07-15',
    kycRequired: 'Basic',
    merkleRoot: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    ipfsMetadata: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    eligibilityCriteria: {
      minTransactions: 10,
      holdingPeriod: '30d',
      testnetParticipation: true,
      minBalance: '0.1 ETH'
    }
  }

  const stats = [
    { label: 'Total Participants', value: campaign.participants.toLocaleString(), icon: Users },
    { label: 'Claims Processed', value: campaign.claimed.toLocaleString(), icon: CheckCircle },
    { label: 'Claim Rate', value: `${Math.round(campaign.claimed / campaign.participants * 100)}%`, icon: Clock },
    { label: 'Total Rewards', value: campaign.totalRewards, icon: Coins },
  ]

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/campaigns">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{campaign.name}</h1>
            <p className="text-muted-foreground max-w-3xl">{campaign.description}</p>
          </div>
          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
            {campaign.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">{campaign.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">{campaign.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">KYC Required</span>
                <span className="font-medium">{campaign.kycRequired}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Token Contract</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {campaign.tokenAddress.slice(0, 6)}...{campaign.tokenAddress.slice(-4)}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(campaign.eligibilityCriteria).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').trim()}: {value.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>
              Cryptographic proofs and metadata for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Merkle Root</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <code className="block w-full text-xs bg-muted p-3 rounded overflow-x-auto">
                {campaign.merkleRoot}
              </code>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">IPFS Metadata</span>
                <Download className="h-4 w-4 text-muted-foreground" />
              </div>
              <code className="block w-full text-xs bg-muted p-3 rounded">
                {campaign.ipfsMetadata}
              </code>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            Export Participant List
          </Button>
          <Button>
            Manage Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}