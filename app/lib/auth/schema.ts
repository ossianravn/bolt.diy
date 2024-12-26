import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

let db: sqlite3.Database | null = null;

async function getDb(): Promise<sqlite3.Database> {
  if (!db) {
    db = new sqlite3.Database('./data.db', (err: Error | null) => {
      if (err) {
        console.error('Error opening database:', err);
      }
    });
  }
  return db;
}

export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createTables(): Promise<boolean> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `, (err: Error | null) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (id, username, password, is_admin) VALUES (?, ?, ?, ?)',
      [crypto.randomUUID(), user.username, user.password, user.isAdmin ? 1 : 0],
      function(this: sqlite3.RunResult, err: Error | null) {
        if (err) reject(err);
        else resolve({ id: this.lastID.toString(), ...user } as User);
      }
    );
  });
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err: Error | null, row: User | undefined) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err: Error | null, row: any) => {
      if (err) reject(err);
      else if (!row) resolve(undefined);
      else {
        // Convert SQLite integer to boolean
        resolve({
          ...row,
          isAdmin: Boolean(row.is_admin),
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        });
      }
    });
  });
}

export async function listUsers(): Promise<User[]> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err: Error | null, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows.map(row => ({
        ...row,
        isAdmin: Boolean(row.is_admin),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      })));
    });
  });
}

export async function createNewUser(user: { username: string; password: string; isAdmin: boolean }): Promise<User> {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return createUser({
    username: user.username,
    password: hashedPassword,
    isAdmin: user.isAdmin,
  });
} 