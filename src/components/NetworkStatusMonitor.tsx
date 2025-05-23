"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { NotificationSubscription } from '@/components/ui/notification-subscription';
import { 
  NetworkStatus, 
  NetworkStatusEvent, 
  subscribeToNetworkStatus, 
  getCurrentNetworkStatus,
  getNetworkStatusHistory,
  startNetworkMonitoring 
} from '@/lib/network-monitor';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRelativeTimeString } from '@/lib/utils';

// Map network status to colors
const statusColors: Record<NetworkStatus, { bg: string, text: string, badge: string }> = {
  up: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  down: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  degraded: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  maintenance: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
};

// Map network status to display text
const statusText: Record<NetworkStatus, string> = {
  up: 'Operational',
  down: 'Outage',
  degraded: 'Degraded',
  maintenance: 'Maintenance',
};

export function NetworkStatusMonitor() {
  const [currentStatus, setCurrentStatus] = useState<NetworkStatusEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetworkStatus() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/network-status');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch network status: ${response.status}`);
        }
        
        const data = await response.json();
        setCurrentStatus(data.currentStatus);
        setError(null);
      } catch (err) {
        console.error('Error fetching network status:', err);
        setError('Failed to load network status');
      } finally {
        setIsLoading(false);
      }
    }

    // Fetch initial data
    fetchNetworkStatus();
    
    // Set up polling interval - check every minute
    const intervalId = setInterval(fetchNetworkStatus, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Get status styling
  const statusStyle = currentStatus ? statusColors[currentStatus.status] : statusColors.up;
  
  return (
    <div>
      {/* Info banner for historic/mock data */}
      <div className="bg-blue-50 border border-blue-200 rounded-md mb-4 p-3 text-sm text-blue-800 flex items-start">
        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Demo Mode</p>
          <p className="mt-1">
            Currently showing historical status data. Live network monitoring coming soon!
          </p>
        </div>
      </div>
      
      <Card className={`${statusStyle.bg} border-0 shadow-sm w-full`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center flex-wrap gap-2">
            <span>Network Status</span>
            {currentStatus && (
              <Badge variant="outline" className={statusStyle.badge}>
                {statusText[currentStatus.status]}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className={`${statusStyle.text} mt-1`}>
            {isLoading ? 'Checking status...' : 
             error ? error :
             currentStatus ? currentStatus.message : 'Status unavailable'}
          </CardDescription>
        </CardHeader>
        {currentStatus && (
          <CardFooter className="pt-0 text-xs text-slate-500">
            Last updated: {getRelativeTimeString(currentStatus.timestamp)}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function StatusIcon({ status, size = 20 }: { status: NetworkStatus; size?: number }) {
  switch (status) {
    case 'up':
      return <CheckCircle className="text-emerald-500" size={size} />;
    case 'down':
      return <XCircle className="text-orange-500" size={size} />;
    case 'degraded':
      return <AlertTriangle className="text-amber-500" size={size} />;
    case 'maintenance':
      return <Clock className="text-blue-500" size={size} />;
    default:
      return <AlertTriangle className="text-gray-500" size={size} />;
  }
}

function StatusBadge({ status }: { status: NetworkStatus }) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";
  
  switch (status) {
    case 'up':
      return (
        <span className={`${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100`}>
          <CheckCircle className="mr-1 h-3 w-3" /> Operational
        </span>
      );
    case 'down':
      return (
        <span className={`${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100`}>
          <XCircle className="mr-1 h-3 w-3" /> Outage
        </span>
      );
    case 'degraded':
      return (
        <span className={`${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100`}>
          <AlertTriangle className="mr-1 h-3 w-3" /> Performance Issues
        </span>
      );
    case 'maintenance':
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100`}>
          <Clock className="mr-1 h-3 w-3" /> Scheduled Maintenance
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100`}>
          <AlertTriangle className="mr-1 h-3 w-3" /> Unknown
        </span>
      );
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
} 