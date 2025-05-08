'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNetspaceStore } from '@/lib/store';
import { timeRanges } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-lg p-3 text-xs">
        <p className="font-bold">{label}</p>
        <p className="text-emerald-500">
          Netspace: {(payload[0].value / Math.pow(1024, 5)).toFixed(2)} PiB
        </p>
        {payload[0].payload.blockHeight && (
          <p className="text-blue-500">
            Block Height: {payload[0].payload.blockHeight.toLocaleString()}
          </p>
        )}
        {payload[0].payload.difficulty && (
          <p className="text-amber-500">
            Difficulty: {payload[0].payload.difficulty.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// Format y-axis values to PiB
const formatYAxis = (value: number) => {
  return `${(value / Math.pow(1024, 5)).toFixed(1)} PiB`;
};

// Format x-axis date labels
const formatXAxis = (value: string) => {
  if (value.includes(':')) {
    // For hourly data
    return value.split(' ')[1];
  }
  // For daily data
  const parts = value.split('-');
  return `${parts[1]}/${parts[2]}`;
};

export function NetspaceChart() {
  const {
    netspaceData,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    fetchData,
    exportData,
    autoRefreshEnabled,
    autoRefreshInterval,
    toggleAutoRefresh,
  } = useNetspaceStore();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('chart');

  // Initial data fetch
  useEffect(() => {
    fetchData();
    setLastUpdated(new Date());
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoRefreshEnabled) {
      intervalId = setInterval(() => {
        fetchData();
        setLastUpdated(new Date());
      }, autoRefreshInterval * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, autoRefreshInterval, fetchData]);

  const handleExport = (format: 'csv' | 'json') => {
    exportData(format);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <div>
          <CardTitle className="text-xl font-bold">Autonomys Netspace Tracker</CardTitle>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onValueChange={(val) => setTimeRange(val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleAutoRefresh}
            className={autoRefreshEnabled ? 'bg-emerald-100 dark:bg-emerald-900' : ''}
          >
            <RefreshIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="data">Data Table</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-6">
          <TabsContent value="chart" className="m-0">
            {isLoading ? (
              <div className="flex h-[350px] items-center justify-center">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="mt-2 text-sm text-muted-foreground">Loading netspace data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex h-[350px] items-center justify-center">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={netspaceData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={formatXAxis}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={formatYAxis}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Netspace"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                    Export JSON
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="data" className="m-0">
            {isLoading ? (
              <div className="flex h-[350px] items-center justify-center">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="mt-2 text-sm text-muted-foreground">Loading netspace data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex h-[350px] items-center justify-center">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 transition-colors">
                      <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Netspace (PiB)</th>
                      {netspaceData[0]?.blockHeight && (
                        <th className="h-10 px-4 text-left align-middle font-medium">Block Height</th>
                      )}
                      {netspaceData[0]?.difficulty && (
                        <th className="h-10 px-4 text-left align-middle font-medium">Difficulty</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {netspaceData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-2 px-4 align-middle">{item.date}</td>
                        <td className="p-2 px-4 align-middle">{item.valueInPiB.toFixed(2)}</td>
                        {item.blockHeight && (
                          <td className="p-2 px-4 align-middle">{item.blockHeight.toLocaleString()}</td>
                        )}
                        {item.difficulty && (
                          <td className="p-2 px-4 align-middle">{item.difficulty.toLocaleString()}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

// Simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="animate-spin h-6 w-6 border-2 border-foreground/20 border-t-foreground rounded-full mx-auto" />
  );
}

// Refresh icon component
function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
} 