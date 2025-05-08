'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNetspaceStore } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import {
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Brush
} from 'recharts';

const CHART_HEIGHT = 500;

const tooltipFormatter = (value: number, name: string) => {
  if (name === 'netspace') return `${formatNumber(value / Math.pow(1024, 5))} PiB`;
  if (name === 'blockHeight') return formatNumber(value);
  if (name === 'difficulty') return formatNumber(value);
  return value;
};

const dateFormatter = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export function EnhancedNetspaceChart() {
  const { netspaceData, timeRange, setTimeRange, exportData, fetchNetspaceData } = useNetspaceStore();
  const [activeMetric, setActiveMetric] = useState<string>('netspace');
  const [chartType, setChartType] = useState<string>('area');
  
  // Fetch data when component mounts
  useEffect(() => {
    if (netspaceData.length === 0) {
      fetchNetspaceData(timeRange);
    }
  }, [fetchNetspaceData, netspaceData.length, timeRange]);
  
  // Format data for the chart
  const formatChartData = () => {
    return netspaceData.map(point => ({
      date: point.date,
      netspace: point.value,
      netspacePiB: point.valueInPiB,
      blockHeight: point.blockHeight,
      difficulty: point.difficulty
    }));
  };

  // Determine y-axis domain based on active metric
  const getYAxisDomain = () => {
    if (activeMetric === 'netspace') {
      const values = netspaceData.map(d => d.valueInPiB);
      const minValue = Math.min(...values) * 0.95;
      const maxValue = Math.max(...values) * 1.05;
      return [minValue, maxValue];
    }
    if (activeMetric === 'blockHeight') {
      const values = netspaceData.filter(d => d.blockHeight).map(d => d.blockHeight as number);
      const minValue = Math.min(...values) * 0.99;
      const maxValue = Math.max(...values) * 1.01;
      return [minValue, maxValue];
    }
    if (activeMetric === 'difficulty') {
      const values = netspaceData.filter(d => d.difficulty).map(d => d.difficulty as number);
      const minValue = Math.min(...values) * 0.9;
      const maxValue = Math.max(...values) * 1.1;
      return [minValue, maxValue];
    }
    return ['auto', 'auto'];
  };
  
  // Get Y axis label based on active metric
  const getYAxisLabel = () => {
    switch (activeMetric) {
      case 'netspace': return 'Netspace (PiB)';
      case 'blockHeight': return 'Block Height';
      case 'difficulty': return 'Difficulty';
      default: return '';
    }
  };

  const chartData = formatChartData();

  // Colors for different metrics
  const metricColors = {
    netspace: '#10b981', // emerald-500
    blockHeight: '#3b82f6', // blue-500
    difficulty: '#8b5cf6'  // violet-500
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs defaultValue={activeMetric} className="w-full sm:w-auto" onValueChange={setActiveMetric}>
            <TabsList>
              <TabsTrigger value="netspace">Netspace</TabsTrigger>
              <TabsTrigger value="blockHeight">Block Height</TabsTrigger>
              <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Tabs defaultValue={timeRange} className="w-full sm:w-auto" onValueChange={setTimeRange}>
              <TabsList>
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs defaultValue={chartType} className="w-full sm:w-auto" onValueChange={setChartType}>
              <TabsList>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex justify-end mb-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportData('csv')}
            className="flex items-center gap-1"
          >
            <DownloadIcon className="h-4 w-4" /> CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportData('json')}
            className="flex items-center gap-1"
          >
            <DownloadIcon className="h-4 w-4" /> JSON
          </Button>
        </div>
        
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
              <XAxis 
                dataKey="date" 
                scale="auto" 
                tickFormatter={dateFormatter} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                domain={getYAxisDomain()}
                tickFormatter={(value) => formatNumber(value)}
                tick={{ fontSize: 12 }}
                label={{ 
                  value: getYAxisLabel(), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                  dy: 50
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'netspacePiB') return [`${formatNumber(value as number)} PiB`, 'Netspace'];
                  if (name === 'blockHeight') return [formatNumber(value as number), 'Block Height'];
                  if (name === 'difficulty') return [formatNumber(value as number), 'Difficulty'];
                  return [value, name];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              />
              <Legend />

              {/* Render different chart types based on selection */}
              {activeMetric === 'netspace' && chartType === 'area' && (
                <Area 
                  type="monotone" 
                  dataKey="netspacePiB" 
                  name="Netspace" 
                  stroke={metricColors.netspace} 
                  fill={metricColors.netspace} 
                  fillOpacity={0.2}
                  activeDot={{ r: 8 }}
                />
              )}
              
              {activeMetric === 'netspace' && chartType === 'line' && (
                <Line 
                  type="monotone" 
                  dataKey="netspacePiB" 
                  name="Netspace" 
                  stroke={metricColors.netspace} 
                  dot={{ r: 1 }}
                  activeDot={{ r: 8 }}
                />
              )}
              
              {activeMetric === 'netspace' && chartType === 'bar' && (
                <Bar 
                  dataKey="netspacePiB" 
                  name="Netspace" 
                  fill={metricColors.netspace} 
                  fillOpacity={0.8}
                  barSize={20}
                />
              )}
              
              {activeMetric === 'blockHeight' && chartType === 'area' && (
                <Area 
                  type="monotone" 
                  dataKey="blockHeight" 
                  name="Block Height" 
                  stroke={metricColors.blockHeight}
                  fill={metricColors.blockHeight}
                  fillOpacity={0.2}
                  activeDot={{ r: 8 }}
                />
              )}
              
              {activeMetric === 'blockHeight' && chartType === 'line' && (
                <Line 
                  type="monotone" 
                  dataKey="blockHeight" 
                  name="Block Height" 
                  stroke={metricColors.blockHeight}
                  dot={{ r: 1 }}
                  activeDot={{ r: 8 }}
                />
              )}
              
              {activeMetric === 'blockHeight' && chartType === 'bar' && (
                <Bar 
                  dataKey="blockHeight" 
                  name="Block Height" 
                  fill={metricColors.blockHeight}
                  fillOpacity={0.8}
                  barSize={20}
                />
              )}
              
              {activeMetric === 'difficulty' && chartType === 'area' && (
                <Area 
                  type="monotone" 
                  dataKey="difficulty" 
                  name="Difficulty" 
                  stroke={metricColors.difficulty}
                  fill={metricColors.difficulty}
                  fillOpacity={0.2}
                  activeDot={{ r: 8 }}
                />
              )}
              
              {activeMetric === 'difficulty' && chartType === 'line' && (
                <Line 
                  type="monotone" 
                  dataKey="difficulty" 
                  name="Difficulty" 
                  stroke={metricColors.difficulty}
                  dot={{ r: 1 }}
                  activeDot={{ r: 8 }}
                />
              )}
              
              {activeMetric === 'difficulty' && chartType === 'bar' && (
                <Bar 
                  dataKey="difficulty" 
                  name="Difficulty" 
                  fill={metricColors.difficulty}
                  fillOpacity={0.8}
                  barSize={20}
                />
              )}
              
              {timeRange === '30d' || timeRange === '90d' || timeRange === 'all' ? (
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke="#8884d8" 
                  tickFormatter={dateFormatter}
                />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
} 