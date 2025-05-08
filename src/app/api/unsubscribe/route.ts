import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize database
const dbPath = path.resolve(process.cwd(), 'subscriptions.db');
const db = new Database(dbPath);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Check if subscription exists
    const subscription = db.prepare('SELECT * FROM email_subscriptions WHERE email = ?').get(email);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Email not found in our subscription list' },
        { status: 404 }
      );
    }
    
    // Delete from database
    db.prepare('DELETE FROM email_subscriptions WHERE email = ?').run(email);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from network status updates'
    });
  } catch (error) {
    console.error('Error processing unsubscribe request:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
} 