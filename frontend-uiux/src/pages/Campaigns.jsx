import { useState } from 'react'
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination'
import { ChevronRight, Users, Coins } from 'lucide-react'

export function Campaigns() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const allCampaigns = [
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
    {
      id: 5,
      name: 'Governance Participants',
      status: 'active',
      totalRewards: '75,000 GOV',
      participants: 3200,
      claimed: 1800,
      endDate: '2025-09-01',
      kycRequired: 'Basic',
    },
    {
      id: 6,
      name: 'Bug Bounty Program',
      status: 'active',
      totalRewards: '200,000 USDT',
      participants: 450,
      claimed: 125,
      endDate: '2025-12-31',
      kycRequired: 'Enhanced',
    },
    {
      id: 7,
      name: 'Community Contributors',
      status: 'completed',
      totalRewards: '30,000 COMM',
      participants: 890,
      claimed: 890,
      endDate: '2025-04-15',
      kycRequired: 'None',
    },
    {
      id: 8,
      name: 'Liquidity Providers',
      status: 'active',
      totalRewards: '150,000 LP',
      participants: 7500,
      claimed: 4200,
      endDate: '2025-10-01',
      kycRequired: 'Basic',
    },
  ]

  const totalPages = Math.ceil(allCampaigns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const campaigns = allCampaigns.slice(startIndex, endIndex)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'completed': return 'outline'
      default: return 'outline'
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Rewards</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Claimed</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="group">
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
                  <Link 
                    to={`/campaign/${campaign.id}`}
                    className="flex items-center justify-center p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}