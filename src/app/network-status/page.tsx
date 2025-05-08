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
import { NotificationSubscription } from '@/components/ui/notification-subscription';
import { Badge } from '@/components/ui/badge';
import { NetworkStatus, NetworkStatusEvent } from '@/lib/network-monitor';
import { getRelativeTimeString } from '@/lib/utils';

// Map network status to colors
const statusColors: Record<NetworkStatus, { bg: string, text: string, border: string }> = {
  up: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  down: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  degraded: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  maintenance: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
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
    <div className="container px-4 sm:px-6 mx-auto max-w-6xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Status</h1>
        <p className="text-muted-foreground mt-2">
          Monitor the current state of the Autonomys network and subscribe to status updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1 w-full">
          <NetworkStatusMonitor />
          
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle className="text-lg">Status Notifications</CardTitle>
              <CardDescription>
                Get notified when there are changes to the network status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSubscription />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Status History</CardTitle>
              <CardDescription>
                Recent network status events and incidents.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No history available</div>
              ) : (
                <div className="space-y-4 w-full">
                  {history.map((event, index) => {
                    const style = statusColors[event.status];
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${style.border} ${style.bg} w-full`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={style.text}>
                                {statusText[event.status]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {getRelativeTimeString(event.timestamp)}
                              </span>
                            </div>
                            <p className={`mt-2 ${style.text}`}>
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
      </div>
    </div>
  );
} 