import { format, subDays } from 'date-fns';

// Define the data structure for netspace metrics
export interface NetspaceDataPoint {
  date: string;
  value: number;
  valueInPiB: number;
  blockHeight?: number;
  difficulty?: number;
}

// Generate mock netspace data for the past 30 days with a realistic growth trend
export function generateMockNetspaceData(days: number = 30): NetspaceDataPoint[] {
  const data: NetspaceDataPoint[] = [];
  
  // Starting with a base value (in bytes) that we'll grow over time
  // 5 EiB in bytes = 5 * 1024^6
  const baseValue = 5 * Math.pow(1024, 6);
  
  // Growth factor per day (small percentage)
  const dailyGrowthFactor = 1.005; // 0.5% daily growth
  
  // Random fluctuation maximum (as a fraction of the value)
  const maxFluctuation = 0.02; // 2% max random fluctuation
  
  // Generate data for each day
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    
    // Calculate growth over time
    let growthMultiplier = Math.pow(dailyGrowthFactor, days - i);
    
    // Add some randomness to make it look more realistic
    const randomFactor = 1 + (Math.random() * 2 - 1) * maxFluctuation;
    
    // Calculate the value with growth and randomness
    const value = baseValue * growthMultiplier * randomFactor;
    
    // Convert to PiB for display (1 PiB = 1024^5 bytes)
    const valueInPiB = value / Math.pow(1024, 5);
    
    // Add mock block height (assuming ~5 minute block times)
    const blockHeight = 1000000 + Math.floor((days - i) * 24 * 60 / 5);
    
    // Add mock difficulty (correlated with netspace size)
    const difficulty = Math.floor(value / 1e15 * randomFactor);
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.floor(value),
      valueInPiB: Math.round(valueInPiB * 100) / 100,
      blockHeight,
      difficulty
    });
  }
  
  return data;
}

// Generate a more detailed dataset with hourly data for the last day
export function generateHourlyNetspaceData(hours: number = 24): NetspaceDataPoint[] {
  const data: NetspaceDataPoint[] = [];
  
  // Get the last day's value as our base
  const lastDayData = generateMockNetspaceData(1)[0];
  const baseValue = lastDayData.value;
  
  // Hourly fluctuation (smaller than daily)
  const maxHourlyFluctuation = 0.005; // 0.5% max fluctuation per hour
  
  // Generate data for each hour
  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(date.getHours() - i);
    
    // Add some randomness to make it look more realistic
    const randomFactor = 1 + (Math.random() * 2 - 1) * maxHourlyFluctuation;
    
    // Calculate the value with randomness
    const value = baseValue * randomFactor;
    
    // Convert to PiB for display
    const valueInPiB = value / Math.pow(1024, 5);
    
    data.push({
      date: format(date, 'yyyy-MM-dd HH:00'),
      value: Math.floor(value),
      valueInPiB: Math.round(valueInPiB * 100) / 100
    });
  }
  
  return data;
}

// Define time ranges for the UI
export const timeRanges = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'All Time', value: 'all' },
]; 