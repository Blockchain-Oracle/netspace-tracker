#!/usr/bin/env node

/**
 * Database initialization script for netspace-tracker
 * This script creates the required database tables if they don't exist.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const dbPath = path.resolve(dataDir, 'subscriptions.db');
console.log(`Initializing database at: ${dbPath}`);

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create email_subscriptions table
db.exec(`
  CREATE TABLE IF NOT EXISTS email_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log('Created email_subscriptions table');

// Create webhook_subscriptions table
db.exec(`
  CREATE TABLE IF NOT EXISTS webhook_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log('Created webhook_subscriptions table');

// Create browser_subscriptions table
db.exec(`
  CREATE TABLE IF NOT EXISTS browser_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    auth TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log('Created browser_subscriptions table');

// Create network_status_history table
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
console.log('Created network_status_history table');

// Insert initial status if table is empty
const statusCount = db.prepare('SELECT COUNT(*) as count FROM network_status_history').get();
if (statusCount.count === 0) {
  console.log('Adding initial network status entry');
  db.prepare(`
    INSERT INTO network_status_history (status, message, timestamp, source)
    VALUES (?, ?, ?, ?)
  `).run('up', 'Network operating normally', new Date().toISOString(), 'initialization');
}

// Close the database connection
db.close();

console.log('Database initialization completed successfully'); 