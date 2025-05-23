import { format, subDays, parseISO, isAfter, isBefore, sub } from 'date-fns';

// Define the data structure for netspace metrics
export interface NetspaceDataPoint {
  date: string;
  value: number;
  valueInPiB: number;
  nodeCount: number;
  blockHeight: number;
  difficulty: number;
  
  // Node distribution by type
  subspaceCLINodes: number;
  spaceAcresNodes: number;
  
  // OS distribution
  linuxNodes: number;
  windowsNodes: number;
  macOSNodes: number;
}

// Define network types
export type NetworkType = 'mainnet' | 'gemini' | 'taurus';

// Interface for raw CSV data row
interface RawTelemetryData {
  dateTime: string;
  nodeCount: number;
  spacePledgedBytes: number;
  spacePledgedPiB: number;
  subspaceCLINodes?: number;
  spaceAcresNodes?: number;
  linuxNodes?: number;
  windowsNodes?: number;
  macOSNodes?: number;
}

// Cache for loaded data to avoid repeated parsing
const dataCache: Record<NetworkType, NetspaceDataPoint[]> = {
  mainnet: [],
  gemini: [],
  taurus: []
};

// Constants for difficulty and block height calculation
const BLOCKS_PER_DAY = 7200; // Approximately 12 blocks per minute
const INITIAL_BLOCK_HEIGHT: Record<NetworkType, number> = {
  mainnet: 0,
  gemini: 1000000,  // Starting point for Gemini testnet
  taurus: 3000000   // Starting point for Taurus testnet
};

// Function to calculate block height based on network and date
function calculateBlockHeight(network: NetworkType, timestamp: Date): number {
  const networkStartDate: Record<NetworkType, Date> = {
    mainnet: new Date('2024-04-15'), // Approximate mainnet start date
    gemini: new Date('2024-07-21'),  // Gemini data start date
    taurus: new Date('2024-10-28')   // Taurus data start date
  };
  
  const startDate = networkStartDate[network];
  const daysSinceStart = Math.max(0, (timestamp.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(INITIAL_BLOCK_HEIGHT[network] + (daysSinceStart * BLOCKS_PER_DAY));
}

// Function to calculate network difficulty based on total space pledged
function calculateDifficulty(spacePledgedPiB: number): number {
  // Simplified difficulty calculation
  // In a real blockchain, difficulty is more complex and depends on many factors
  const baseDifficulty = 1000000;
  return Math.floor(baseDifficulty * Math.sqrt(spacePledgedPiB));
}

// Load and parse CSV data
async function loadTelemetryData(network: NetworkType): Promise<NetspaceDataPoint[]> {
  if (dataCache[network].length > 0) {
    return dataCache[network];
  }

  try {
    // File paths based on network type
    const filePath = `/data/${network === 'mainnet' ? 'Telemetry Scraper mainnet.csv' : 
                             network === 'gemini' ? 'Telemetry Scraper Gemini.csv' : 
                             'Telemetry Scraper Taurus.csv'}`;
    
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    
    const parsedData: NetspaceDataPoint[] = [];
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue;
      
      const values = row.split(',');
      const dateTimeValue = values[0];
      const nodeCountValue = parseInt(values[1], 10);
      const spacePledgedValue = parseFloat(values[2]);
      
      // Some CSV files have PiB in different columns, find the right one
      let spacePledgedPiBValue: number | undefined;
      if (values.length >= 9) {
        const parsed = parseFloat(values[8]);
        spacePledgedPiBValue = !isNaN(parsed) ? parsed : undefined;
      } else if (values.length >= 8) {
        const parsed = parseFloat(values[7]);
        spacePledgedPiBValue = !isNaN(parsed) ? parsed : undefined;
      }
      
      // Skip rows with invalid data
      if (isNaN(spacePledgedValue) || isNaN(nodeCountValue)) {
        continue;
      }
      
      // Use PiB value from CSV or calculate it if not available
      const valueInPiB = spacePledgedPiBValue !== undefined ? 
        spacePledgedPiBValue : 
        spacePledgedValue / Math.pow(1024, 5);
        
      // Extract node type distribution (if available)
      const subspaceCLINodes = parseInt(values[3], 10) || 0;
      const spaceAcresNodes = parseInt(values[4], 10) || 0;
      
      // Extract OS distribution (if available)
      const linuxNodes = parseInt(values[5], 10) || 0;
      const windowsNodes = parseInt(values[6], 10) || 0;
      const macOSNodes = parseInt(values[7], 10) || 0;
      
      const timestamp = new Date(dateTimeValue);
      
      // Calculate block height and difficulty
      const blockHeight = calculateBlockHeight(network, timestamp);
      const difficulty = calculateDifficulty(valueInPiB);
      
      parsedData.push({
        date: dateTimeValue.includes('T') ? 
          format(parseISO(dateTimeValue), 'yyyy-MM-dd HH:mm') : 
          dateTimeValue,
        value: spacePledgedValue,
        valueInPiB: valueInPiB,
        nodeCount: nodeCountValue,
        blockHeight: blockHeight,
        difficulty: difficulty,
        subspaceCLINodes: subspaceCLINodes,
        spaceAcresNodes: spaceAcresNodes,
        linuxNodes: linuxNodes,
        windowsNodes: windowsNodes,
        macOSNodes: macOSNodes
      });
    }
    
    // Sort data by date (oldest to newest)
    parsedData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Cache the loaded data
    dataCache[network] = parsedData;
    return parsedData;
  } catch (error) {
    console.error(`Error loading telemetry data for ${network}:`, error);
    return [];
  }
}

// Define time ranges for the UI based on network milestones
export function getTimeRangesForNetwork(network: NetworkType): Array<{ label: string, value: string, description?: string }> {
  // Network-specific milestone dates
  const milestones: Record<NetworkType, Record<string, string>> = {
    gemini: {
      launch: '2024-07-21',
      phase1: '2024-08-15',
      phase2: '2024-09-10',
      phase3: '2024-10-05',
    },
    mainnet: {
      launch: '2024-04-15',
      expansion1: '2024-05-01',
      expansion2: '2024-06-15',
      major_update: '2024-08-01',
    },
    taurus: {
      launch: '2024-10-28',
      initial_drop: '2024-11-13',        // First significant drop in nodes
      steady_phase: '2024-12-15',        // Period of relative stability
      growth_start: '2025-02-01',        // Start of major growth phase
      peak_phase: '2025-03-01',          // Peak network activity period
      consolidation: '2025-04-01',       // Network consolidation phase
    }
  };

  const networkMilestones = milestones[network];
  const currentDate = new Date();
  
  // Common ranges for all networks
  const commonRanges = [
    { label: 'All Data', value: 'all', description: 'View complete dataset' },
  ];
  
  // Network-specific ranges
  switch (network) {
    case 'gemini':
      return [
        ...commonRanges,
        { label: 'Since Launch', value: `since:${networkMilestones.launch}`, description: 'Since network launch' },
        { label: 'Farmer Onboarding', value: `since:${networkMilestones.phase1}`, description: 'Major farmer growth period' },
        { label: 'Protocol Update', value: `since:${networkMilestones.phase2}`, description: 'Post protocol upgrade' },
        { label: 'Recent Growth', value: `since:${networkMilestones.phase3}`, description: 'Recent network expansion' },
        { label: 'Last 2 Weeks', value: 'custom:14d', description: 'Most recent activity' },
      ];
    case 'mainnet':
      return [
        ...commonRanges,
        { label: 'Since Launch', value: `since:${networkMilestones.launch}`, description: 'Since network launch' },
        { label: 'Initial Expansion', value: `since:${networkMilestones.expansion1}`, description: 'First major growth period' },
        { label: 'Ecosystem Growth', value: `since:${networkMilestones.expansion2}`, description: 'Ecosystem adoption phase' },
        { label: 'Post Update', value: `since:${networkMilestones.major_update}`, description: 'After major protocol update' },
        { label: 'Last 30 Days', value: 'custom:30d', description: 'Recent network activity' },
      ];
    case 'taurus':
      return [
        ...commonRanges,
        { label: 'Launch Period', value: `since:${networkMilestones.launch}`, description: 'Initial network launch (Oct 2024)' },
        { label: 'Post-Drop Growth', value: `since:${networkMilestones.initial_drop}`, description: 'Recovery after initial participation drop' },
        { label: 'Steady Phase', value: `since:${networkMilestones.steady_phase}`, description: 'Period of network stabilization' },
        { label: 'Growth Phase', value: `since:${networkMilestones.growth_start}`, description: 'Major network expansion (Feb 2025)' },
        { label: 'Peak Activity', value: `since:${networkMilestones.peak_phase}`, description: 'Highest node count period (Mar 2025)' },
        { label: 'Consolidation', value: `since:${networkMilestones.consolidation}`, description: 'Network maturity phase' },
        { label: 'Last 30 Days', value: 'custom:30d', description: 'Recent network activity' },
      ];
    default:
      return commonRanges;
  }
}

// Function to filter data by time range
export function filterDataByTimeRange(
  data: NetspaceDataPoint[], 
  timeRange: string,
  network: NetworkType = 'mainnet'
): NetspaceDataPoint[] {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  
  // Handle custom time ranges (since:DATE or custom:PERIOD)
  if (timeRange.startsWith('since:')) {
    const startDateStr = timeRange.replace('since:', '');
    const startDate = new Date(startDateStr);
    
    return data.filter(point => {
      const pointDate = new Date(point.date);
      return isAfter(pointDate, startDate) && isBefore(pointDate, now);
    });
  } else if (timeRange.startsWith('custom:')) {
    const period = timeRange.replace('custom:', '');
    let startDate: Date;
    
    if (period.endsWith('d')) {
      const days = parseInt(period.replace('d', ''));
      startDate = sub(now, { days });
    } else if (period.endsWith('h')) {
      const hours = parseInt(period.replace('h', ''));
      startDate = sub(now, { hours });
    } else {
      // Default to all data if format is incorrect
      return data;
    }
    
    return data.filter(point => {
      const pointDate = new Date(point.date);
      return isAfter(pointDate, startDate) && isBefore(pointDate, now);
    });
  } else if (timeRange === 'all') {
    return data;
  } else {
    // Fallback for legacy time ranges
    let startDate: Date;
    
    switch(timeRange) {
      case '24h':
        startDate = sub(now, { hours: 24 });
        break;
      case '7d':
        startDate = sub(now, { days: 7 });
        break;
      case '30d':
        startDate = sub(now, { days: 30 });
        break;
      case '90d':
        startDate = sub(now, { days: 90 });
        break;
      default:
        return data;
    }
    
    return data.filter(point => {
      const pointDate = new Date(point.date);
      return isAfter(pointDate, startDate) && isBefore(pointDate, now);
    });
  }
}

// Main function to get network data
export async function getNetworkData(
  network: NetworkType = 'mainnet',
  timeRange: string = 'all'
): Promise<NetspaceDataPoint[]> {
  const data = await loadTelemetryData(network);
  return filterDataByTimeRange(data, timeRange, network);
}

// Legacy time ranges - keeping for backwards compatibility
export const timeRanges = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'All Time', value: 'all' },
];

// Stats calculation helper functions
export function getLatestStats(data: NetspaceDataPoint[]): { 
  netspace: number;
  nodeCount: number;
  blockHeight: number;
  difficulty: number;
  growthRate24h?: number;
  nodeDistribution: {
    cli: number;
    spaceAcres: number;
  };
  osDistribution: {
    linux: number;
    windows: number;
    macOS: number;
  };
} {
  if (!data || data.length === 0) {
    return { 
      netspace: 0, 
      nodeCount: 0, 
      blockHeight: 0,
      difficulty: 0,
      nodeDistribution: { cli: 0, spaceAcres: 0 },
      osDistribution: { linux: 0, windows: 0, macOS: 0 }
    };
  }
  
  const latest = data[data.length - 1];
  
  // Calculate 24h growth rate if we have enough data
  let growthRate24h;
  if (data.length >= 2) {
    const comparePoint = findComparePoint(data, 24);
    if (comparePoint && comparePoint.valueInPiB > 0) {
      growthRate24h = (latest.valueInPiB - comparePoint.valueInPiB) / comparePoint.valueInPiB * 100;
    }
  }
  
  return {
    netspace: latest.valueInPiB,
    nodeCount: latest.nodeCount,
    blockHeight: latest.blockHeight,
    difficulty: latest.difficulty,
    growthRate24h,
    nodeDistribution: {
      cli: latest.subspaceCLINodes || 0,
      spaceAcres: latest.spaceAcresNodes || 0
    },
    osDistribution: {
      linux: latest.linuxNodes || 0,
      windows: latest.windowsNodes || 0,
      macOS: latest.macOSNodes || 0
    }
  };
}

// Helper to find a data point approximately hours ago
function findComparePoint(data: NetspaceDataPoint[], hours: number): NetspaceDataPoint | null {
  if (data.length <= 1) return null;
  
  const latestDate = new Date(data[data.length - 1].date);
  const targetDate = sub(latestDate, { hours });
  
  // Find the closest data point to the target date
  let closestPoint = data[0];
  let closestDiff = Math.abs(new Date(closestPoint.date).getTime() - targetDate.getTime());
  
  for (let i = 1; i < data.length; i++) {
    const point = data[i];
    const diff = Math.abs(new Date(point.date).getTime() - targetDate.getTime());
    
    if (diff < closestDiff) {
      closestPoint = point;
      closestDiff = diff;
    }
  }
  
  return closestPoint;
} 