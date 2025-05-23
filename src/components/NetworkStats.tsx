'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetspaceStore } from "@/lib/store";
import { formatBytes, formatNumber } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NetworkType } from '@/app/network-status/data/netspace-data';
import { StorageUnitsExplainer } from './StorageUnitsExplainer';

export function NetworkStats() {
  const { netspaceData, networkType } = useNetspaceStore();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // If we don't have data yet, show loading state
  if (!netspaceData || netspaceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Network Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Get the latest data point
  const latestData = netspaceData[netspaceData.length - 1];
  
  // Prepare data for node type distribution chart
  const nodeTypeData = [
    { name: 'CLI Nodes', value: latestData.subspaceCLINodes || 0 },
    { name: 'Space Acres', value: latestData.spaceAcresNodes || 0 }
  ].filter(item => item.value > 0);
  
  // Prepare data for OS distribution chart
  const osDistributionData = [
    { name: 'Linux', value: latestData.linuxNodes || 0 },
    { name: 'Windows', value: latestData.windowsNodes || 0 },
    { name: 'macOS', value: latestData.macOSNodes || 0 }
  ].filter(item => item.value > 0);
  
  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Network Statistics</CardTitle>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nodes">Node Types</TabsTrigger>
              <TabsTrigger value="os">OS Distribution</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard 
                title="Total Nodes" 
                value={formatNumber(latestData.nodeCount)} 
                help="Active nodes in the network"
              />
              <StatCard 
                title="Netspace" 
                value={`${formatNumber(latestData.valueInPiB)} PiB`} 
                help="Total pledged space"
              />
              <StatCard 
                title="Block Height" 
                value={formatNumber(latestData.blockHeight)} 
                help="Current blockchain height"
              />
              <StatCard 
                title="Difficulty" 
                value={formatNumber(latestData.difficulty)} 
                help="Network mining difficulty"
              />
            </div>
          )}
          
          {activeTab === 'nodes' && (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nodeTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {nodeTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'Nodes']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <StatCard 
                  title="CLI Nodes" 
                  value={formatNumber(latestData.subspaceCLINodes || 0)} 
                  help="Command-line interface nodes"
                />
                <StatCard 
                  title="Space Acres" 
                  value={formatNumber(latestData.spaceAcresNodes || 0)} 
                  help="Space Acres farming app nodes"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'os' && (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {osDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'Nodes']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <StatCard 
                  title="Linux" 
                  value={formatNumber(latestData.linuxNodes || 0)} 
                  help="Linux-based nodes"
                />
                <StatCard 
                  title="Windows" 
                  value={formatNumber(latestData.windowsNodes || 0)} 
                  help="Windows-based nodes"
                />
                <StatCard 
                  title="macOS" 
                  value={formatNumber(latestData.macOSNodes || 0)} 
                  help="macOS-based nodes"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <StorageUnitsExplainer />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  help?: string;
}

function StatCard({ title, value, help }: StatCardProps) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <h3 className="text-xs font-medium text-muted-foreground mb-1">{title}</h3>
      <div className="text-2xl font-bold">{value}</div>
      {help && <p className="text-xs text-muted-foreground mt-1">{help}</p>}
    </div>
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