import { create } from 'zustand';
import {
  NetspaceDataPoint, 
  getNetworkData,
  NetworkType,
  filterDataByTimeRange
} from '@/app/network-status/data/netspace-data';

// Export utility functions for CSV and JSON export
function exportToCsv(data: NetspaceDataPoint[]) {
  if (!data || data.length === 0) return;
  
  // Create CSV content
  const headers = ['Date', 'Netspace (bytes)', 'Netspace (PiB)', 'Node Count'];
  if (data[0].blockHeight !== undefined) headers.push('Block Height');
  if (data[0].difficulty !== undefined) headers.push('Difficulty');
  
  const csvRows = [headers.join(',')];
  
  data.forEach(point => {
    const row = [
      point.date,
      point.value,
      point.valueInPiB,
      point.nodeCount || 'N/A'
    ];
    
    if (data[0].blockHeight !== undefined) row.push(String(point.blockHeight || 'N/A'));
    if (data[0].difficulty !== undefined) row.push(String(point.difficulty || 'N/A'));
    
    csvRows.push(row.join(','));
  });
  
  const csvContent = csvRows.join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `netspace-data-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToJson(data: NetspaceDataPoint[]) {
  if (!data || data.length === 0) return;
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `netspace-data-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface NetspaceStore {
  // Data
  netspaceData: NetspaceDataPoint[];
  latestData: NetspaceDataPoint | null;
  isLoading: boolean;
  error: string | null;
  
  // UI State
  networkType: NetworkType;
  timeRange: string;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number; // in seconds
  selectedDataPoint: NetspaceDataPoint | null;
  
  // Actions
  fetchNetspaceData: (timeRange: string) => Promise<void>;
  fetchData: () => Promise<void>;
  setTimeRange: (range: string) => void;
  setNetworkType: (network: NetworkType) => void;
  toggleAutoRefresh: () => void;
  setAutoRefreshInterval: (interval: number) => void;
  setNetspaceData: (data: NetspaceDataPoint[]) => void;
  setSelectedDataPoint: (dataPoint: NetspaceDataPoint | null) => void;
  exportData: (format: 'csv' | 'json') => void;
}

export const useNetspaceStore = create<NetspaceStore>((set, get) => ({
  // Initial state
  netspaceData: [],
  latestData: null,
  isLoading: false,
  error: null,
  networkType: 'mainnet',
  timeRange: '30d',
  autoRefreshEnabled: false,
  autoRefreshInterval: 300, // 5 minutes in seconds
  selectedDataPoint: null,
  
  // Actions
  fetchNetspaceData: async (timeRange: string) => {
    const networkType = get().networkType;
    set({ isLoading: true, error: null });
    
    try {
      const data = await getNetworkData(networkType, timeRange);
      
      // Handle empty data response
      if (!data || data.length === 0) {
        set({ 
          error: `No data available for network: ${networkType} and timeRange: ${timeRange}`,
          isLoading: false,
          netspaceData: []
        });
        return;
      }
      
      set({ 
        netspaceData: data, 
        latestData: data.length > 0 ? data[data.length - 1] : null, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch data', 
        isLoading: false 
      });
    }
  },
  
  // Fetch data using current timeRange
  fetchData: async () => {
    const { timeRange, fetchNetspaceData } = get();
    await fetchNetspaceData(timeRange);
  },
  
  setTimeRange: (range: string) => {
    set({ timeRange: range });
    get().fetchNetspaceData(range);
  },
  
  setNetworkType: (network: NetworkType) => {
    set({ networkType: network });
    get().fetchNetspaceData(get().timeRange);
  },
  
  exportData: (format: 'csv' | 'json') => {
    const { netspaceData } = get();
    
    if (format === 'csv') {
      exportToCsv(netspaceData);
    } else {
      exportToJson(netspaceData);
    }
  },
  
  toggleAutoRefresh: () => {
    set(state => ({ autoRefreshEnabled: !state.autoRefreshEnabled }));
  },
  
  setAutoRefreshInterval: (interval: number) => {
    set({ autoRefreshInterval: interval });
  },
  
  setNetspaceData: (data) => {
    set({ netspaceData: data, latestData: data.length > 0 ? data[data.length - 1] : null });
  },
  
  setSelectedDataPoint: (dataPoint) => {
    set({ selectedDataPoint: dataPoint });
  }
})); 