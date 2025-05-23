"use client"

import { useState, useEffect } from 'react'
import { ArrowUpCircle, ArrowDownCircle, HardDrive, Clock, Activity, BarChart2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNetspaceStore } from '@/lib/store'
import { formatBytes } from '@/lib/utils'

// Mock data - in real implementation, this would come from API
const NODE_TYPES = ['Space-Acre', 'CLI', 'GUI'] as const
type NodeType = typeof NODE_TYPES[number]

interface NodeStats {
  spacePledged: number
  uptime: number
  responseTime: number
  lastSeen: string
  nodeType: NodeType
  nodeVersion: string
  networkAvg: {
    spacePledged: number
    uptime: number
    responseTime: number
  }
}

function getComparisonBadge(value: number, avg: number, inverse: boolean = false) {
  const percentDiff = ((value - avg) / avg) * 100
  const isPositive = inverse ? percentDiff < 0 : percentDiff > 0
  
  if (Math.abs(percentDiff) < 5) return (
    <Badge variant="outline" className="ml-2 font-normal text-xs text-slate-400 border-slate-600">
      Average
    </Badge>
  )
  
  return (
    <Badge 
      variant="outline" 
      className={`ml-2 font-normal text-xs border-slate-700 ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}
    >
      {isPositive ? (
        <ArrowUpCircle className="w-3 h-3 mr-1" />
      ) : (
        <ArrowDownCircle className="w-3 h-3 mr-1" />
      )}
      {Math.abs(percentDiff).toFixed(1)}% {isPositive ? 'above' : 'below'} avg
    </Badge>
  )
}

export function TrendingSingleNodeStats() {
  const { networkType } = useNetspaceStore()
  const [nodeId, setNodeId] = useState<string>('demo123')
  const [nodeStats, setNodeStats] = useState<NodeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [nodeIdInput, setNodeIdInput] = useState('')
  
  // Simulating data fetch - in real implementation, this would be an API call
  useEffect(() => {
    setLoading(true)
    
    // Simulate API delay
    const timer = setTimeout(() => {
      // Mock data - would be replaced with actual API response
      const mockStats: NodeStats = {
        spacePledged: 2.5 * 1024 * 1024 * 1024 * 1024, // 2.5 TiB
        uptime: 98.7, // percentage
        responseTime: 120, // ms
        lastSeen: new Date().toISOString(),
        nodeType: 'Space-Acre',
        nodeVersion: '0.8.2',
        networkAvg: {
          spacePledged: 1.8 * 1024 * 1024 * 1024 * 1024, // 1.8 TiB
          uptime: 94.2, // percentage
          responseTime: 180, // ms
        }
      }
      
      setNodeStats(mockStats)
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [nodeId, networkType])
  
  const handleSearch = () => {
    if (nodeIdInput.trim()) {
      setNodeId(nodeIdInput.trim())
    }
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Node Performance
        </CardTitle>
        <CardDescription>
          View detailed statistics for a single node in the {networkType} network
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative grow">
            <input
              type="text"
              placeholder="Enter Node ID"
              value={nodeIdInput}
              onChange={(e) => setNodeIdInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-700 bg-slate-800/30 rounded-md text-sm text-slate-200 placeholder:text-slate-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            size="sm"
            variant="default"
          >
            Search
          </Button>
        </div>
        
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : nodeStats ? (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between gap-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700">
              <div>
                <div className="text-sm font-medium text-slate-300">Node ID</div>
                <div className="font-mono text-sm text-slate-200">{nodeId}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-300">Type</div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="bg-slate-700 text-slate-200">{nodeStats.nodeType}</Badge>
                  <span className="text-xs ml-2 text-slate-400">v{nodeStats.nodeVersion}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-300">Last Seen</div>
                <div className="text-sm text-slate-200">{new Date(nodeStats.lastSeen).toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700 shadow-sm">
                <div className="flex items-center text-sm font-medium text-slate-300 mb-1">
                  <HardDrive className="h-4 w-4 mr-1" /> Space Pledged
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-slate-200">{formatBytes(nodeStats.spacePledged)}</span>
                  {getComparisonBadge(nodeStats.spacePledged, nodeStats.networkAvg.spacePledged)}
                </div>
              </div>
              
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700 shadow-sm">
                <div className="flex items-center text-sm font-medium text-slate-300 mb-1">
                  <Clock className="h-4 w-4 mr-1" /> Uptime
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-slate-200">{nodeStats.uptime}%</span>
                  {getComparisonBadge(nodeStats.uptime, nodeStats.networkAvg.uptime)}
                </div>
              </div>
              
              <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700 shadow-sm">
                <div className="flex items-center text-sm font-medium text-slate-300 mb-1">
                  <Activity className="h-4 w-4 mr-1" /> Response Time
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-slate-200">{nodeStats.responseTime}ms</span>
                  {getComparisonBadge(nodeStats.responseTime, nodeStats.networkAvg.responseTime, true)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-slate-400 border-t border-slate-700 pt-2">
              Node statistics are updated every 15 minutes. Comparisons are against the network average.
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400">
            No node data found. Please check the Node ID and try again.
          </div>
        )}
      </CardContent>
    </Card>
  )
} 