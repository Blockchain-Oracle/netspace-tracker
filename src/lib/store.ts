import { create } from 'zustand';
import {
  NetspaceDataPoint, 
  generateMockNetspaceData, 
  generateHourlyNetspaceData 
} from './mock-data';

// Function to get data for a specific time range
function getDataForTimeRange(range: string): NetspaceDataPoint[] {
  switch (range) {
    case '24h':
      return generateHourlyNetspaceData(24);
    case '7d':
      return generateMockNetspaceData(7);
    case '30d':
      return generateMockNetspaceData(30);
    case '90d':
      return generateMockNetspaceData(90);
    case 'all':
      return generateMockNetspaceData(365);
    default:
      return generateMockNetspaceData(30);
  }
}

interface NetspaceStore {
  // Data
  netspaceData: NetspaceDataPoint[];
  latestData: NetspaceDataPoint | null;
  isLoading: boolean;
  error: string | null;
  
  // UI State
  timeRange: string;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number; // in seconds
  selectedDataPoint: NetspaceDataPoint | null;
  
  // Actions
  fetchNetspaceData: (timeRange: string) => Promise<void>;
  setTimeRange: (range: string) => void;
  toggleAutoRefresh: () => void;
  setAutoRefreshInterval: (interval: number) => void;
  setNetspaceData: (data: NetspaceDataPoint[]) => void;
  setSelectedDataPoint: (dataPoint: NetspaceDataPoint | null) => void;
  exportData: (format: 'csv' | 'json') => void;
}

// Helper for exporting data
const exportToCsv = (data: NetspaceDataPoint[]): void => {
  const csvContent = [
    // CSV Header
    ['Date', 'Netspace (Bytes)', 'Netspace (PiB)', 'Block Height', 'Difficulty'].join(','),
    // CSV Data rows
    ...data.map(item => 
      [
        item.date, 
        item.value, 
        item.valueInPiB, 
        item.blockHeight || '', 
        item.difficulty || ''
      ].join(',')
    )
  ].join('\n');

  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `netspace-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToJson = (data: NetspaceDataPoint[]): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `netspace-data-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const useNetspaceStore = create<NetspaceStore>((set, get) => ({
  // Initial state
  netspaceData: [],
  latestData: null,
  isLoading: false,
  error: null,
  timeRange: '30d',
  autoRefreshEnabled: false,
  autoRefreshInterval: 300, // 5 minutes in seconds
  selectedDataPoint: null,
  
  // Actions
  fetchNetspaceData: async (timeRange: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get data based on time range
      const data = getDataForTimeRange(timeRange);
      
      set({ netspaceData: data, latestData: data.length > 0 ? data[data.length - 1] : null, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch data', 
        isLoading: false 
      });
    }
  },
  
  setTimeRange: (range: string) => {
    set({ timeRange: range });
    get().fetchNetspaceData(range);
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