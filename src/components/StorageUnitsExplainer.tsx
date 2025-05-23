"use client"

import { useState } from 'react'
import { 
  Info, 
  HelpCircle,
  ChevronDown, 
  ChevronUp,
  HardDrive
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const unitDefinitions = [
  { 
    unit: "bytes", 
    abbr: "B", 
    base: 1, 
    description: "Basic unit of digital information (8 bits)" 
  },
  { 
    unit: "kilobytes", 
    abbr: "KB", 
    base: Math.pow(1024, 1), 
    description: "1 KB = 1,024 bytes (2^10)" 
  },
  { 
    unit: "megabytes", 
    abbr: "MB", 
    base: Math.pow(1024, 2), 
    description: "1 MB = 1,048,576 bytes (2^20)" 
  },
  { 
    unit: "gigabytes", 
    abbr: "GB", 
    base: Math.pow(1024, 3), 
    description: "1 GB = 1,073,741,824 bytes (2^30)" 
  },
  { 
    unit: "terabytes", 
    abbr: "TB", 
    base: Math.pow(1024, 4), 
    description: "1 TB = 1,099,511,627,776 bytes (2^40)" 
  },
  { 
    unit: "petabytes", 
    abbr: "PB", 
    base: Math.pow(1000, 5), 
    description: "1 PB = 1,000,000,000,000,000 bytes (10^15)" 
  },
  { 
    unit: "pebibytes", 
    abbr: "PiB", 
    base: Math.pow(1024, 5), 
    description: "1 PiB = 1,125,899,906,842,624 bytes (2^50)" 
  }
]

// Example conversion to demonstrate
const exampleBytes = 2884089913802752 // 2.56 PiB approximately

export function StorageUnitsExplainer() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <Card className="overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Storage Units Explained</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        <CardDescription>
          Understanding how network storage metrics are calculated
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pb-3 pt-0">
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3">
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Key Unit in Autonomys Network
              </h3>
              <p className="text-sm text-muted-foreground">
                The Autonomys Network primarily displays storage metrics in <span className="font-semibold">Pebibytes (PiB)</span>, 
                which is the binary-based measurement used in computing storage (1 PiB = 2^50 bytes).
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Storage Unit Hierarchy</h3>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/20 rounded-md" />
                <div className="grid grid-cols-2 gap-2 md:grid-cols-7 relative">
                  {unitDefinitions.map((unit, i) => (
                    <div 
                      key={unit.abbr} 
                      className="bg-card p-2 rounded-md shadow-sm border border-border relative z-10"
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <Badge 
                          variant={unit.abbr === "PiB" ? "default" : "outline"}
                          className={`mb-1 ${unit.abbr === "PiB" ? "" : "bg-muted"}`}
                        >
                          {unit.abbr}
                        </Badge>
                        <span className="text-xs text-center text-muted-foreground truncate max-w-full">
                          {unit.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Example Conversion</h3>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-xs block mb-2">Space Pledged (byte): {exampleBytes.toLocaleString()}</code>
                <div className="flex items-center gap-1 text-sm">
                  <span>= {exampleBytes.toLocaleString()}</span>
                  <span className="text-muted-foreground">÷</span>
                  <span>1,125,899,906,842,624</span>
                  <span className="text-muted-foreground">≈</span>
                  <span className="font-semibold">{(exampleBytes / Math.pow(1024, 5)).toFixed(2)} PiB</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-amber-50 rounded-md p-3 border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-1">Binary vs Decimal</h4>
                <p className="text-xs text-amber-700">
                  <span className="font-medium">PiB (Pebibyte, 2^50):</span> Used in computing and represents 1,125,899,906,842,624 bytes.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  <span className="font-medium">PB (Petabyte, 10^15):</span> Used by storage manufacturers and equals 1,000,000,000,000,000 bytes.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Why We Use PiB</h4>
                <p className="text-xs text-blue-700">
                  In blockchain networks, binary units (KiB, MiB, GiB, TiB, PiB) are preferred as they align with 
                  how computers actually allocate memory and storage (in powers of 2).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className={`flex justify-between py-2 text-xs ${isExpanded ? 'border-t' : ''}`}>
        <span className="text-muted-foreground">
          {isExpanded ? "Click to collapse" : "Click to expand for storage unit details"}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <HelpCircle size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                The network telemetry data records raw bytes but displays in Pebibytes (PiB) for readability.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
} 