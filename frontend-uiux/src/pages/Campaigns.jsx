import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { ExternalLink, Users, Coins } from 'lucide-react'

export function Campaigns() {
  const campaigns = [
    {
      id: 1,
      name: 'Early Adopter Rewards',
      status: 'active',
      totalRewards: '10,000 USDC',
      participants: 1234,
      claimed: 892,
      endDate: '2025-07-15',
      kycRequired: 'Basic',
    },
    {
      id: 2,
      name: 'DeFi Power Users',
      status: 'active',
      totalRewards: '50,000 ARB',
      participants: 5678,
      claimed: 3421,
      endDate: '2025-06-30',
      kycRequired: 'Enhanced',
    },
    {
      id: 3,
      name: 'NFT Holder Airdrop',
      status: 'pending',
      totalRewards: '25,000 MATIC',
      participants: 10000,
      claimed: 0,
      endDate: '2025-08-01',
      kycRequired: 'None',
    },
    {
      id: 4,
      name: 'Testnet Contributors',
      status: 'completed',
      totalRewards: '100,000 TEST',
      participants: 2500,
      claimed: 2500,
      endDate: '2025-05-01',
      kycRequired: 'Basic',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'completed': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Campaigns</h1>
        <p className="text-muted-foreground">
          View and manage your private reward distribution campaigns
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all reward campaigns</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Rewards</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Claimed</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
                    {campaign.totalRewards}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {campaign.participants.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  {campaign.claimed.toLocaleString()} ({Math.round(campaign.claimed / campaign.participants * 100)}%)
                </TableCell>
                <TableCell>{campaign.endDate}</TableCell>
                <TableCell>{campaign.kycRequired}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/campaign/${campaign.id}`}>
                      View
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}