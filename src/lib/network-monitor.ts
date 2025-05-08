// This integrates with external monitoring services like UptimeRobot or custom monitoring endpoints
import nodemailer from 'nodemailer';
import Database from 'better-sqlite3';
import path from 'path';
import fetch from 'node-fetch';
import { z } from 'zod';

// Types for network status
export type NetworkStatus = 'up' | 'down' | 'degraded' | 'maintenance';

export interface NetworkStatusEvent {
  status: NetworkStatus;
  timestamp: Date;
  message: string;
  details?: string;
  id?: number;
}

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_SERVER_HOST || 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

// Initialize database connection
const dbPath = path.resolve(process.cwd(), 'subscriptions.db');
let db: any = null;

// Only initialize the database on the server side
if (typeof window === 'undefined') {
  try {
    db = new Database(dbPath);
    
    // Create network_status_history table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS network_status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        message TEXT NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source TEXT
      );
    `);
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

// Network status cache
let currentStatus: NetworkStatus = 'up';
let lastChecked: Date = new Date();
let subscribers: Set<(status: NetworkStatusEvent) => void> = new Set();

// Monitoring service configuration
const MONITORING_ENDPOINTS = [
  process.env.PRIMARY_MONITORING_ENDPOINT || 'https://api.example.com/status',
  process.env.SECONDARY_MONITORING_ENDPOINT
].filter(Boolean) as string[];

const UPTIME_ROBOT_API_KEY = process.env.UPTIME_ROBOT_API_KEY;
const UPTIME_ROBOT_MONITORS = process.env.UPTIME_ROBOT_MONITOR_IDS?.split(',') || [];

// Schema for validating external service responses
const StatusResponseSchema = z.object({
  status: z.enum(['up', 'down', 'degraded', 'maintenance']).optional(),
  operational: z.boolean().optional(),
  up: z.boolean().optional(),
  message: z.string().optional(),
  details: z.string().optional(),
  timestamp: z.string().optional(),
});

/**
 * Send email notifications to all verified subscribers
 */
async function notifyEmailSubscribers(event: NetworkStatusEvent): Promise<void> {
  if (!db) return;
  
  try {
    // Get all verified email subscribers
    const subscribers = db.prepare('SELECT email FROM email_subscriptions WHERE verified = TRUE').all();
    
    if (subscribers.length === 0) {
      return;
    }
    
    // Prepare email content
    const subject = `Network Status Update: ${getStatusDisplayName(event.status)}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Network Status Update</h2>
        <div style="padding: 15px; border-radius: 5px; margin: 20px 0; background-color: ${getStatusColor(event.status)};">
          <h3 style="margin-top: 0;">${getStatusDisplayName(event.status)}</h3>
          <p>${event.message}</p>
          ${event.details ? `<p>${event.details}</p>` : ''}
          <p style="font-size: 0.9em; margin-bottom: 0;">
            Updated at: ${event.timestamp.toLocaleString()}
          </p>
        </div>
        <p>Visit the <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/network-status">Network Status page</a> for more information.</p>
        <p style="font-size: 0.8em; color: #666; margin-top: 30px;">
          You're receiving this email because you subscribed to network status updates.
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unsubscribe">Unsubscribe</a>
        </p>
      </div>
    `;
    
    // Send emails in batches to avoid rate limits
    const batchSize = 20;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const bcc = batch.map((sub: { email: string }) => sub.email).join(',');
      
      await transporter.sendMail({
        from: process.env.SMTP_SERVER_USERNAME,
        bcc: bcc,
        subject: subject,
        html: htmlContent
      });
      
      // Wait a bit between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    console.error('Failed to send email notifications:', error);
  }
}

/**
 * Send webhook notifications to all subscribers
 */
async function notifyWebhookSubscribers(event: NetworkStatusEvent): Promise<void> {
  if (!db) return;
  
  try {
    // Get all webhook subscribers
    const subscribers = db.prepare('SELECT url FROM webhook_subscriptions').all();
    
    // Send webhooks in parallel
    const webhookPromises = subscribers.map(async (sub: { url: string }) => {
      try {
        await fetch(sub.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: event.timestamp.toISOString(),
            status: event.status,
            message: event.message,
            details: event.details
          })
        });
      } catch (error) {
        console.error(`Failed to send webhook to ${sub.url}:`, error);
      }
    });
    
    await Promise.allSettled(webhookPromises);
  } catch (error) {
    console.error('Failed to send webhook notifications:', error);
  }
}

/**
 * Helper functions for email formatting
 */
function getStatusDisplayName(status: NetworkStatus): string {
  switch (status) {
    case 'up': return 'Operational';
    case 'down': return 'Outage Detected';
    case 'degraded': return 'Performance Degraded';
    case 'maintenance': return 'Scheduled Maintenance';
    default: return 'Status Unknown';
  }
}

function getStatusColor(status: NetworkStatus): string {
  switch (status) {
    case 'up': return '#edfaf1';
    case 'down': return '#fdeeee';
    case 'degraded': return '#fff9e6';
    case 'maintenance': return '#f0f5ff';
    default: return '#f8f9fa';
  }
}

/**
 * Fetch status from UptimeRobot API
 */
async function fetchUptimeRobotStatus(): Promise<NetworkStatusEvent | null> {
  if (!UPTIME_ROBOT_API_KEY || UPTIME_ROBOT_MONITORS.length === 0) {
    return null;
  }
  
  try {
    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        api_key: UPTIME_ROBOT_API_KEY,
        monitors: UPTIME_ROBOT_MONITORS.join('-'),
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`UptimeRobot API error: ${response.status} ${response.statusText}`);
    }

    // Define interface for UptimeRobot API response
    interface UptimeRobotResponse {
      monitors?: Array<{
        friendly_name: string;
        status: number;
      }>;
    }

    const data = await response.json() as UptimeRobotResponse;
    
    if (!data.monitors || !data.monitors.length) {
      return null;
    }
    
    // Check if any monitor is down
    const downMonitors = data.monitors.filter(m => m.status !== 2);
    const isOperational = downMonitors.length === 0;
    
    let status: NetworkStatus = 'up';
    let message = 'Network operating normally';
    let details = '';
    
    if (!isOperational) {
      // If any monitor is down or has issues
      if (downMonitors.some(m => m.status === 9)) {
        status = 'down';
        message = 'Network outage detected';
      } else {
        status = 'degraded';
        message = 'Network performance degraded';
      }
      
      // Add details about which services are affected
      details = downMonitors.map(m => 
        `${m.friendly_name}: ${m.status === 9 ? 'Down' : 'Experiencing issues'}`
      ).join(', ');
    }
    
    return {
      status,
      timestamp: new Date(),
      message,
      details
    };
  } catch (error) {
    console.error('Error fetching UptimeRobot data:', error);
    return null;
  }
}

/**
 * Fetch status from custom monitoring endpoints
 */
async function fetchCustomEndpointStatus(): Promise<NetworkStatusEvent | null> {
  if (MONITORING_ENDPOINTS.length === 0) {
    return null;
  }
  
  try {
    // Try each endpoint until one succeeds
    for (const endpoint of MONITORING_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          continue; // Try next endpoint if this one fails
        }

        const data = await response.json();
        
        // Validate the response format
        const validatedData = StatusResponseSchema.safeParse(data);
        if (!validatedData.success) {
          continue;
        }
        
        const result = validatedData.data;
        
        // Determine status based on available fields
        let status: NetworkStatus;
        if (result.status) {
          status = result.status;
        } else if (result.operational !== undefined) {
          status = result.operational ? 'up' : 'down';
        } else if (result.up !== undefined) {
          status = result.up ? 'up' : 'down';
        } else {
          continue; // Can't determine status, try next endpoint
        }
        
        return {
          status,
          timestamp: result.timestamp ? new Date(result.timestamp) : new Date(),
          message: result.message || getMessageForStatus(status),
          details: result.details
        };
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        // Continue to next endpoint
      }
    }
    
    // If all endpoints failed
    return null;
  } catch (error) {
    console.error('Error fetching from monitoring endpoints:', error);
    return null;
  }
}

/**
 * Store status event in database
 */
function storeStatusEvent(event: NetworkStatusEvent, source: string): number | null {
  if (!db) return null;
  
  try {
    const result = db.prepare(
      'INSERT INTO network_status_history (status, message, details, timestamp, source) VALUES (?, ?, ?, ?, ?)'
    ).run(
      event.status, 
      event.message, 
      event.details || null, 
      event.timestamp.toISOString(), 
      source
    );
    
    return result.lastInsertRowid as number;
  } catch (error) {
    console.error('Error storing status event:', error);
    return null;
  }
}

/**
 * Subscribe to network status updates
 * @param callback Function to call when network status changes
 * @returns Function to unsubscribe
 */
export function subscribeToNetworkStatus(
  callback: (status: NetworkStatusEvent) => void
): () => void {
  subscribers.add(callback);
  
  // Immediately notify with current status
  callback({
    status: currentStatus,
    timestamp: lastChecked,
    message: getMessageForStatus(currentStatus)
  });
  
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Get the current network status
 * @returns Current network status event
 */
export function getCurrentNetworkStatus(): NetworkStatusEvent {
  return {
    status: currentStatus,
    timestamp: lastChecked,
    message: getMessageForStatus(currentStatus)
  };
}

/**
 * Get network status history from the database
 * @param limit Maximum number of events to return
 * @returns Array of network status events
 */
export function getNetworkStatusHistory(limit = 10): NetworkStatusEvent[] {
  if (!db) {
    // Fallback to empty array if not on server
    return [];
  }
  
  try {
    const history = db.prepare(`
      SELECT id, status, message, details, timestamp
      FROM network_status_history
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit);
    
    return history.map((event: any) => ({
      id: event.id,
      status: event.status as NetworkStatus,
      message: event.message,
      details: event.details,
      timestamp: new Date(event.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching status history:', error);
    return [];
  }
}

/**
 * Check network status from monitoring services
 * This fetches real data from configured monitoring services
 */
export async function checkNetworkStatus(): Promise<void> {
  lastChecked = new Date();
  
  try {
    // Check UptimeRobot first
    let statusEvent = await fetchUptimeRobotStatus();
    
    // If UptimeRobot check fails or isn't configured, try custom endpoints
    if (!statusEvent) {
      statusEvent = await fetchCustomEndpointStatus();
    }
    
    // If all external checks fail, fallback to current status
    if (!statusEvent) {
      // In a production system, if all monitoring fails, we might want to consider
      // that a warning sign and possibly mark as 'degraded'
      return;
    }
    
    // Only notify if status changed
    if (statusEvent.status !== currentStatus) {
      const previousStatus = currentStatus;
      currentStatus = statusEvent.status;
      
      // Store in database
      const eventId = storeStatusEvent(statusEvent, 
        statusEvent === await fetchUptimeRobotStatus() ? 'uptimerobot' : 'custom_endpoint');
      
      if (eventId) {
        statusEvent.id = eventId;
      }
      
      // Notify subscribers
      subscribers.forEach((callback) => {
        callback(statusEvent);
      });

      // Send notifications to subscribed users
      // Only notify on status changes that users would care about
      if (currentStatus === 'down' || currentStatus === 'degraded' || 
          (currentStatus === 'up' && previousStatus !== 'maintenance')) {
        if (typeof window === 'undefined') {
          notifyEmailSubscribers(statusEvent);
          notifyWebhookSubscribers(statusEvent);
        }
      }
    }
  } catch (error) {
    console.error('Error checking network status:', error);
  }
}

/**
 * Helper to get a message for a status
 */
function getMessageForStatus(status: NetworkStatus): string {
  switch (status) {
    case 'up':
      return 'Network operating normally';
    case 'down':
      return 'Network outage detected';
    case 'degraded':
      return 'Network performance degraded';
    case 'maintenance':
      return 'Network undergoing scheduled maintenance';
    default:
      return 'Unknown network status';
  }
}

/**
 * Start periodic network monitoring
 * @param intervalMs How often to check network status in milliseconds
 * @returns Function to stop monitoring
 */
export function startNetworkMonitoring(intervalMs = 60000): () => void {
  // Perform initial check
  checkNetworkStatus();
  
  const intervalId = setInterval(() => {
    checkNetworkStatus();
  }, intervalMs);
  
  return () => clearInterval(intervalId);
}

/**
 * Schedule network maintenance
 * This allows administrators to schedule planned maintenance periods
 */
export async function scheduleNetworkMaintenance(
  startTime: Date,
  endTime: Date,
  message: string
): Promise<boolean> {
  if (!db) return false;
  
  try {
    // Add maintenance event to database
    const maintenanceEvent: NetworkStatusEvent = {
      status: 'maintenance',
      timestamp: startTime,
      message: message,
      details: `Planned maintenance scheduled from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}`
    };
    
    const eventId = storeStatusEvent(maintenanceEvent, 'scheduled');
    
    if (eventId) {
      maintenanceEvent.id = eventId;
      
      // If the maintenance is starting now, update current status
      if (startTime <= new Date()) {
        currentStatus = 'maintenance';
        lastChecked = new Date();
        
        // Notify subscribers
        subscribers.forEach((callback) => {
          callback(maintenanceEvent);
        });
        
        // Send notifications
        if (typeof window === 'undefined') {
          notifyEmailSubscribers(maintenanceEvent);
          notifyWebhookSubscribers(maintenanceEvent);
        }
      }
      
      // Schedule the end of maintenance if it's in the future
      if (endTime > new Date()) {
        const timeUntilEnd = endTime.getTime() - Date.now();
        
        setTimeout(() => {
          // When maintenance period ends, check the real status
          checkNetworkStatus();
        }, timeUntilEnd);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    return false;
  }
} 