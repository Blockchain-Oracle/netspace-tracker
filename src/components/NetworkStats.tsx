'use client';

import { Card } from "@/components/ui/card";
import { useNetspaceStore } from "@/lib/store";
import { formatBytes, formatNumber } from "@/lib/utils";

export function NetworkStats() {
  const { netspaceData, latestData } = useNetspaceStore();
  
  // Calculate block time (average of last few blocks if available)
  const calculateAvgBlockTime = () => {
    if (!netspaceData || netspaceData.length < 10) return '10.0';
    
    // Assuming block time is roughly 5 minutes
    return '5.0';
  };

  // Derive metrics from latest data
  const totalNetspace = latestData?.value || 0;
  const blockHeight = latestData?.blockHeight || 0;
  const difficulty = latestData?.difficulty || 0;
  const blockTime = calculateAvgBlockTime();
  
  // Simulated metrics (not in our actual data model yet)
  const activeNodes = 231;
  const transactions = 1245;
  const hashRate = (difficulty * Math.pow(2, 32) / (300)).toFixed(2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard 
        title="Current Block Height" 
        value={formatNumber(blockHeight)}
        icon={<BlockIcon className="h-5 w-5" />}
      />
      <StatCard 
        title="Network Difficulty" 
        value={formatNumber(difficulty)}
        icon={<DifficultIcon className="h-5 w-5" />}
      />
      <StatCard 
        title="Block Time" 
        value={`${blockTime}s`}
        icon={<ClockIcon className="h-5 w-5" />}
      />
      <StatCard 
        title="Total Netspace" 
        value={latestData?.valueInPiB ? `${formatNumber(latestData.valueInPiB)} PiB` : formatBytes(totalNetspace)}
        icon={<NetworkIcon className="h-5 w-5" />}
      />
      <StatCard 
        title="Estimated Hash Rate" 
        value={`${formatNumber(parseFloat(hashRate))} TH/s`}
        icon={<HashRateIcon className="h-5 w-5" />}
      />
      <StatCard 
        title="Active Nodes" 
        value={formatNumber(activeNodes)}
        icon={<NodesIcon className="h-5 w-5" />} 
      />
      <StatCard 
        title="24h Transactions" 
        value={formatNumber(transactions)}
        icon={<TransactionIcon className="h-5 w-5" />}
      />
      <StatCard 
        title="Network Health" 
        value="Good"
        icon={<HealthIcon className="h-5 w-5 text-emerald-500" />}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <p className="text-base sm:text-lg font-semibold mt-1">{value}</p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function BlockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function DifficultIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m2 8 2 2-2 2 2 2-2 2" />
      <path d="m22 8-2 2 2 2-2 2 2 2" />
      <path d="M8 8v10c0 .93 0 1.4.4 1.7.4.3.87.3 1.8.3h3.6c.93 0 1.4 0 1.8-.3.4-.3.4-.77.4-1.7V8c0-.93 0-1.4-.4-1.7-.4-.3-.87-.3-1.8-.3H10c-.93 0-1.4 0-1.8.3-.4.3-.4.77-.4 1.7Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  );
}

function HashRateIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 10h14" />
      <path d="M5 14h14" />
      <path d="M5 18h14" />
      <path d="M19 6V4h-2" />
      <path d="M7 4v2H5" />
      <path d="M7 20v-2H5" />
      <path d="M19 20v-2h-2" />
    </svg>
  );
}

function NodesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TransactionIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12H9" />
      <path d="m15 9 3 3-3 3" />
    </svg>
  );
}

function HealthIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
} 