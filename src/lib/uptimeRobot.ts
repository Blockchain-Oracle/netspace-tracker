// UptimeRobot API integration
// Documentation: https://uptimerobot.com/api/

import { NetworkStatus, NetworkStatusEvent } from './network-monitor';

// Replace with your actual UptimeRobot API key
const UPTIME_ROBOT_API_KEY = process.env.UPTIME_ROBOT_API_KEY || 'your-api-key';

// UptimeRobot API endpoints
const UPTIME_ROBOT_API_URL = 'https://api.uptimerobot.com/v2';

// Interfaces for UptimeRobot API responses
interface UptimeMonitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number; // 0 - paused, 1 - not checked yet, 2 - up, 8 - seems down, 9 - down
  all_time_uptime_ratio: string;
  average_response: number;
}

interface UptimeRobotResponse {
  stat: string;
  monitors: UptimeMonitor[];
}

// Map UptimeRobot status to our application status
function mapUptimeRobotStatus(status: number): NetworkStatus {
  switch (status) {
    case 2:
      return 'up';
    case 8:
      return 'degraded';
    case 9:
      return 'down';
    case 0:
      return 'maintenance';
    default:
      return 'up';
  }
}

// Fetch current network status from UptimeRobot
export async function fetchNetworkStatus(): Promise<NetworkStatusEvent[]> {
  try {
    const response = await fetch(`${UPTIME_ROBOT_API_URL}/getMonitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        api_key: UPTIME_ROBOT_API_KEY,
        format: 'json',
        logs: 1, // Include logs
      }),
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`UptimeRobot API responded with status: ${response.status}`);
    }

    const data = await response.json() as UptimeRobotResponse;
    
    if (data.stat !== 'ok' || !data.monitors?.length) {
      throw new Error('No valid monitors found in UptimeRobot response');
    }

    // Sort monitors by status priority (down > degraded > maintenance > up)
    const sortedMonitors = [...data.monitors].sort((a, b) => {
      // Priority: down (9) > seems down (8) > paused (0) > up (2)
      const priorityMap: Record<number, number> = { 9: 3, 8: 2, 0: 1, 2: 0 };
      return priorityMap[b.status] - priorityMap[a.status];
    });

    // The most critical status becomes the current network status
    const currentStatus = mapUptimeRobotStatus(sortedMonitors[0]?.status || 2);
    const now = new Date();
    
    // Create history from the last 7 days
    const statusEvents: NetworkStatusEvent[] = [
      {
        status: currentStatus,
        timestamp: now,
        message: currentStatus !== 'up' ? 
          `${sortedMonitors[0]?.friendly_name || 'Network'} experiencing issues` : 
          'Network operating normally'
      }
    ];
    
    return statusEvents;
  } catch (error) {
    console.error('Error fetching data from UptimeRobot:', error);
    // Return fallback data in case of errors
    return [{
      status: 'up',
      timestamp: new Date(),
      message: 'Network operating normally'
    }];
  }
} 