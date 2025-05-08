import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize database
const dbPath = path.resolve(process.cwd(), 'subscriptions.db');
const db = new Database(dbPath);

export async function GET() {
  try {
    // Get network status history
    const history = db.prepare(`
      SELECT id, status, message, details, timestamp, source
      FROM network_status_history
      ORDER BY timestamp DESC
      LIMIT 50
    `).all();
    
    // Get subscription stats
    const emailCount = db.prepare('SELECT COUNT(*) as count FROM email_subscriptions WHERE verified = TRUE').get() as { count: number };
    const webhookCount = db.prepare('SELECT COUNT(*) as count FROM webhook_subscriptions').get() as { count: number };
    const browserCount = db.prepare('SELECT COUNT(*) as count FROM browser_subscriptions').get() as { count: number };
    
    return NextResponse.json({
      history,
      subscriptionStats: {
        total: emailCount.count + webhookCount.count + browserCount.count,
        email: emailCount.count,
        webhook: webhookCount.count,
        browser: browserCount.count,
      }
    });
  } catch (error) {
    console.error('Error fetching network status data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network status data' },
      { status: 500 }
    );
  }
} 