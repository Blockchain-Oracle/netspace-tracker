'use client';

import { useState } from 'react';
import { useNetspaceStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatNumber } from '@/lib/utils';

// Define data interface
interface NetspaceDataPoint {
  timestamp: string;
  valueInPiB: number;
}

type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';

export function EnhancedNetspaceChart() {
  const { netspaceData } = useNetspaceStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Calculate time cutoffs for different ranges
  const now = Date.now();
  const dayMs = 86400000; // milliseconds in a day
  
  const filterDataByTimeRange = () => {
    switch (timeRange) {
      case '24h':
        return netspaceData.filter((d: NetspaceDataPoint) => new Date(d.timestamp).getTime() > now - dayMs);
      case '7d':
        return netspaceData.filter((d: NetspaceDataPoint) => new Date(d.timestamp).getTime() > now - (7 * dayMs));
      case '30d':
        return netspaceData.filter((d: NetspaceDataPoint) => new Date(d.timestamp).getTime() > now - (30 * dayMs));
      case '90d':
        return netspaceData.filter((d: NetspaceDataPoint) => new Date(d.timestamp).getTime() > now - (90 * dayMs));
      case 'all':
      default:
        return netspaceData;
    }
  };

  const filteredData = filterDataByTimeRange();

  // Format dates for x-axis
  const formatDateTick = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg sm:text-xl">Netspace Growth</CardTitle>
        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          className="h-8"
        >
          <TabsList className="grid grid-cols-5 w-[350px]">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDateTick}
                minTickGap={40}
              />
              <YAxis 
                tickFormatter={(value) => `${formatNumber(value)} PiB`}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`${formatNumber(value)} PiB`, 'Netspace']}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="valueInPiB"
                name="Netspace"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 