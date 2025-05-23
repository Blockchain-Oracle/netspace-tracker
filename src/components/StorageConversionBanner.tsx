"use client"

import { useState } from 'react'
import { Info, Calculator } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNetspaceStore } from '@/lib/store'

export function StorageConversionBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { networkType } = useNetspaceStore()
  
  if (!isVisible) return null
  
  const exampleBytes = 2884089913802752 // 2.56 PiB
  
  return (
    <Alert className="mb-6 bg-slate-900/20 border border-slate-700 text-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-2 items-center">
            <Calculator className="h-4 w-4 text-primary" />
            <AlertTitle className="text-sm font-medium">
              Storage Unit Conversion
            </AlertTitle>
          </div>
          <AlertDescription className="text-xs mt-1 text-slate-300">
            The {networkType} network displays space in <Badge variant="outline" className="font-mono text-xs border-slate-600">PiB</Badge> (Pebibytes). 
            Raw telemetry data is stored in bytes and converted for readability.
          </AlertDescription>
          
          <div className="mt-3 bg-slate-800/50 p-2 rounded-md border border-slate-700 shadow-sm">
            <code className="text-xs flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-semibold text-slate-300">Conversion formula:</span>
              <span className="font-mono ml-1 bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">
                Raw bytes ÷ 1,125,899,906,842,624 (2^50) = PiB value
              </span>
            </code>
            <div className="mt-2 pt-2 border-t border-slate-700 text-xs flex flex-wrap justify-between items-center gap-2 text-slate-300">
              <span className="font-mono">
                Example: {exampleBytes.toLocaleString()} bytes ÷ 2^50 ≈ {(exampleBytes / Math.pow(1024, 5)).toFixed(2)} PiB
              </span>
              <Badge variant="secondary" className="text-[10px] bg-slate-700 text-slate-200">Used in blockchain networks</Badge>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 -mt-1 -mr-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          onClick={() => setIsVisible(false)}
        >
          ✕
        </Button>
      </div>
    </Alert>
  )
} 