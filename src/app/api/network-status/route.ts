import { NextResponse } from 'next/server';
import { fetchNetworkStatus } from '@/lib/uptimeRobot';
import { getCurrentNetworkStatus, getNetworkStatusHistory } from '@/lib/network-monitor';

// GET endpoint to fetch network status data
export async function GET() {
  try {
    // In production, we'd use fetchNetworkStatus() to get real data
    // For now, we'll use a combination of real data (if available) and mock data
    
    // Use mock data as fallback
    const mockStatus = getCurrentNetworkStatus();
    const mockHistory = getNetworkStatusHistory(10);
    
    try {
      // Try to get real data from UptimeRobot
      const realStatus = await fetchNetworkStatus();
      
      // Return the most recent real data if available
      return NextResponse.json({
        currentStatus: realStatus[0] || mockStatus,
        history: realStatus.concat(mockHistory).slice(0, 10)
      });
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      // Fallback to mock data
      return NextResponse.json({
        currentStatus: mockStatus,
        history: mockHistory
      });
    }
  } catch (error) {
    console.error('Error fetching network status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network status' },
      { status: 500 }
    );
  }
} 