import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { NewCampaignDialog } from './components/NewCampaignDialog'
import { Landing } from './pages/Landing'
import { Campaigns } from './pages/Campaigns'
import { CampaignDetails } from './pages/CampaignDetails'

function App() {
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header onNewCampaign={() => setShowNewCampaign(true)} />
        
        <Routes>
          <Route path="/" element={<Landing onNewCampaign={() => setShowNewCampaign(true)} />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/about" element={<div className="flex-1 container mx-auto px-4 py-8">About Page</div>} />
        </Routes>
        
        <Footer />
        
        <NewCampaignDialog 
          open={showNewCampaign} 
          onOpenChange={setShowNewCampaign} 
        />
      </div>
    </Router>
  )
}

export default App