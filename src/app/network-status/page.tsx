"use client"

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { NetworkStatusMonitor } from '@/components/NetworkStatusMonitor';
import { NetworkStats } from '@/components/NetworkStats';
import { NetworkSelector } from '@/components/NetworkSelector';
import { NetworkTrends } from '@/components/NetworkTrends';
import { StorageConversionBanner } from '@/components/StorageConversionBanner';
import { TrendingSingleNodeStats } from '@/components/TrendingSingleNodeStats';
import { NotificationSubscription } from '@/components/ui/notification-subscription';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NetworkStatus, NetworkStatusEvent } from '@/lib/network-monitor';
import { getRelativeTimeString } from '@/lib/utils';

// Map network status to colors with better dark mode support
const statusColors: Record<NetworkStatus, { bg: string, text: string, border: string }> = {
  up: { bg: 'bg-emerald-950/20', text: 'text-emerald-400', border: 'border-emerald-800' },
  down: { bg: 'bg-red-950/20', text: 'text-red-400', border: 'border-red-800' },
  degraded: { bg: 'bg-amber-950/20', text: 'text-amber-400', border: 'border-amber-800' },
  maintenance: { bg: 'bg-blue-950/20', text: 'text-blue-400', border: 'border-blue-800' },
};

// Map network status to display text
const statusText: Record<NetworkStatus, string> = {
  up: 'Operational',
  down: 'Outage',
  degraded: 'Degraded',
  maintenance: 'Maintenance',
};

export default function NetworkStatusPage() {
  const [history, setHistory] = useState<NetworkStatusEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetworkStatusHistory() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/network-status');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch network status: ${response.status}`);
        }
        
        const data = await response.json();
        setHistory(data.history);
        setError(null);
      } catch (err) {
        console.error('Error fetching network status history:', err);
        setError('Failed to load network status history');
      } finally {
        setIsLoading(false);
      }
    }

    // Fetch initial data
    fetchNetworkStatusHistory();
    
    // Set up polling interval - check every 5 minutes
    const intervalId = setInterval(fetchNetworkStatusHistory, 300000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container px-4 sm:px-6 mx-auto max-w-6xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Status</h1>
        <p className="text-muted-foreground mt-2">
          Monitor the current state of the Autonomys network
        </p>
      </div>

      {/* Network Selector */}
      <NetworkSelector />

      {/* Storage Conversion Banner */}
      <StorageConversionBanner />

      {/* Network Stats Section */}
      <NetworkStats />
      
      {/* Network Trends Section */}
      <NetworkTrends />
      
      {/* Single Node Performance */}
      <TrendingSingleNodeStats />

      {/* Status History */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Status History</CardTitle>
          <CardDescription>
            Recent network status events and incidents
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-600">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No history available</div>
          ) : (
            <div className="space-y-3 w-full">
              {history.slice(0, 5).map((event, index) => {
                const style = statusColors[event.status];
                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${style.border} ${style.bg} w-full`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${style.text} bg-slate-900/50`}>
                            {statusText[event.status]}
                          </Badge>
                          <span className="text-xs font-medium text-slate-400">
                            {getRelativeTimeString(event.timestamp)}
                          </span>
                        </div>
                        <p className={`mt-2 ${style.text} font-medium`}>
                          {event.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}