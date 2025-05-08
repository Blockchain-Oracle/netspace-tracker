import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize database
const dbPath = path.resolve(process.cwd(), 'subscriptions.db');
const db = new Database(dbPath);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification token' },
        { status: 400 }
      );
    }
    
    // Find subscription with token
    const subscription = db.prepare('SELECT * FROM email_subscriptions WHERE token = ?').get(token);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
    
    // Mark as verified
    db.prepare('UPDATE email_subscriptions SET verified = TRUE WHERE token = ?').run(token);
    
    // Redirect to success page
    return new Response(null, {
      status: 307,
      headers: {
        'Location': '/subscription-confirmed'
      }
    });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json(
      { error: 'Failed to verify subscription' },
      { status: 500 }
    );
  }
} 