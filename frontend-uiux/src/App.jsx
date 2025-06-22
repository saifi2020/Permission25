import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Web3Provider } from './components/Web3Provider'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { NewCampaignDialog } from './components/NewCampaignDialog'
import { Landing } from './pages/Landing'
import { Campaigns } from './pages/Campaigns'
import { CampaignDetails } from './pages/CampaignDetails'
import { About } from './pages/About'

function App() {
  const [showNewCampaign, setShowNewCampaign] = useState(false)

  return (
    <ThemeProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header onNewCampaign={() => setShowNewCampaign(true)} />
            
            <Routes>
              <Route path="/" element={<Landing onNewCampaign={() => setShowNewCampaign(true)} />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaign/:id" element={<CampaignDetails />} />
              <Route path="/about" element={<About />} />
            </Routes>
            
            <Footer />
            
            <NewCampaignDialog 
              open={showNewCampaign} 
              onOpenChange={setShowNewCampaign} 
            />
          </div>
        </Router>
      </Web3Provider>
    </ThemeProvider>
  )
}

export default App