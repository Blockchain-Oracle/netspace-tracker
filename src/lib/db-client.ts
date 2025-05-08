import { join } from 'path';

// Conditionally import better-sqlite3
let Database: any = null;
let db: any = null;

// Only import and initialize SQLite if not in Vercel environment
if (process.env.NEXT_PUBLIC_IS_VERCEL !== 'true') {
  try {
    // Use dynamic import to avoid issues during build
    const sqlite = require('better-sqlite3');
    Database = sqlite;
    
    // Initialize the database
    const dbPath = join(process.cwd(), 'data', 'netspace.db');
    db = new Database(dbPath);
    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error);
  }
}

// Mock/alternative implementation for Vercel environment
class MockDatabase {
  private mockData: any = {};

  prepare(query: string) {
    return {
      run: (...params: any[]) => ({ changes: 0 }),
      get: (...params: any[]) => null,
      all: (...params: any[]) => [],
    };
  }

  exec(sql: string) {
    return;
  }

  close() {
    return;
  }
}

// Export either the real DB or mock based on environment
export default function getDatabase() {
  if (!db) {
    return new MockDatabase();
  }
  return db;
}

// Export the Database constructor for type usage
export { Database }; 