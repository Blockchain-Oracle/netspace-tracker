import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Database from 'better-sqlite3';
import path from 'path';
import { createHash } from 'crypto';

// Define interfaces for subscription types
interface EmailSubscription {
  type: 'email';
  email: string;
}

interface WebhookSubscription {
  type: 'webhook';
  url: string;
}

interface BrowserSubscription {
  type: 'browser';
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

type Subscription = EmailSubscription | WebhookSubscription | BrowserSubscription;

// Initialize database
const dbPath = path.resolve(process.cwd(), 'subscriptions.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS email_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS webhook_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS browser_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    auth TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

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

// Function to generate verification token
function generateToken(email: string): string {
  return createHash('sha256')
    .update(email + Date.now().toString() + Math.random().toString())
    .digest('hex')
    .slice(0, 32);
}

// Function to send verification email
async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/verify?token=${token}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_SERVER_USERNAME,
      to: email,
      subject: 'Verify your Network Status subscription',
      text: `Please verify your subscription to network status updates by clicking on this link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your Network Status subscription</h2>
          <p>Thank you for subscribing to network status updates. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify My Email
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// POST endpoint to handle new subscriptions
export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    
    // Validate subscription data
    if (!subscription.type) {
      return NextResponse.json(
        { error: 'Missing subscription type' },
        { status: 400 }
      );
    }
    
    // Handle based on subscription type
    switch (subscription.type) {
      case 'email': {
        if (!subscription.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscription.email)) {
          return NextResponse.json(
            { error: 'Invalid email address' },
            { status: 400 }
          );
        }
        
        // Check if already exists
        const existingSubscription = db.prepare('SELECT * FROM email_subscriptions WHERE email = ?').get(subscription.email) as {
          id: number;
          email: string;
          token: string;
          verified: boolean;
          created_at: string;
        } | undefined;
        
        if (existingSubscription) {
          // If not verified, resend verification email
          if (!existingSubscription.verified) {
            const emailSent = await sendVerificationEmail(subscription.email, existingSubscription.token);
            
            if (!emailSent) {
              return NextResponse.json(
                { error: 'Failed to send verification email' },
                { status: 500 }
              );
            }
            
            return NextResponse.json({
              success: true,
              message: 'Verification email resent. Please check your inbox.'
            });
          }
          
          return NextResponse.json({
            success: true,
            message: 'You are already subscribed to network status updates.'
          });
        }
        
        // Generate verification token
        const token = generateToken(subscription.email);
        
        // Store in database
        db.prepare('INSERT INTO email_subscriptions (email, token) VALUES (?, ?)').run(subscription.email, token);
        
        // Send verification email
        const emailSent = await sendVerificationEmail(subscription.email, token);
        
        if (!emailSent) {
          // Remove from database if email fails
          db.prepare('DELETE FROM email_subscriptions WHERE email = ?').run(subscription.email);
          
          return NextResponse.json(
            { error: 'Failed to send verification email' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          success: true,
          message: 'Please check your email to verify your subscription.'
        });
      }
      
      case 'webhook': {
        if (!subscription.url || !/^https?:\/\//.test(subscription.url)) {
          return NextResponse.json(
            { error: 'Invalid webhook URL' },
            { status: 400 }
          );
        }
        
        // Check if already exists
        const existingSubscription = db.prepare('SELECT * FROM webhook_subscriptions WHERE url = ?').get(subscription.url);
        
        if (existingSubscription) {
          return NextResponse.json({
            success: true,
            message: 'Webhook is already subscribed to network status updates.'
          });
        }
        
        // Store in database
        db.prepare('INSERT INTO webhook_subscriptions (url) VALUES (?)').run(subscription.url);
        
        return NextResponse.json({
          success: true,
          message: 'Webhook successfully subscribed to network status updates.'
        });
      }
      
      case 'browser': {
        if (!subscription.endpoint || !subscription.keys) {
          return NextResponse.json(
            { error: 'Invalid browser notification subscription' },
            { status: 400 }
          );
        }
        
        // Check if already exists
        const existingSubscription = db.prepare('SELECT * FROM browser_subscriptions WHERE endpoint = ?').get(subscription.endpoint);
        
        if (existingSubscription) {
          return NextResponse.json({
            success: true,
            message: 'Browser is already subscribed to network status updates.'
          });
        }
        
        // Store in database
        db.prepare('INSERT INTO browser_subscriptions (endpoint, auth, p256dh) VALUES (?, ?, ?)')
          .run(subscription.endpoint, subscription.keys.auth, subscription.keys.p256dh);
        
        return NextResponse.json({
          success: true,
          message: 'Browser successfully subscribed to network status updates.'
        });
      }
      
      default:
        return NextResponse.json(
          { error: 'Unsupported subscription type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve subscription count
export async function GET() {
  interface CountResult {
    count: number;
  }
  
  const emailCount = db.prepare('SELECT COUNT(*) as count FROM email_subscriptions WHERE verified = TRUE').get() as CountResult;
  const webhookCount = db.prepare('SELECT COUNT(*) as count FROM webhook_subscriptions').get() as CountResult;
  const browserCount = db.prepare('SELECT COUNT(*) as count FROM browser_subscriptions').get() as CountResult;
  
  return NextResponse.json({
    totalSubscriptions: emailCount.count + webhookCount.count + browserCount.count,
    typeCounts: {
      email: emailCount.count,
      webhook: webhookCount.count,
      browser: browserCount.count,
    }
  });
} 