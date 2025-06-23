import { Settings, Server, Cpu } from 'lucide-react'
import zkConfig from '../config/zkConfig.json'

export function ZKConfigStatus() {
  const config = zkConfig.zkProof
  const isServiceMode = config.mode === 'service' && config.claimProverService.enabled
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
      isServiceMode 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-blue-100 text-blue-800 border border-blue-200'
    }`}>
      {isServiceMode ? (
        <>
          <Server className="h-3 w-3" />
          Service Mode
        </>
      ) : (
        <>
          <Cpu className="h-3 w-3" />
          Mock Mode
        </>
      )}
      <Settings className="h-3 w-3 opacity-60" />
    </div>
  )
} 