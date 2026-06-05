import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = path.join(__dirname, '..', 'aryavarta.db');

export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for better performance & concurrent reads
db.exec(`PRAGMA journal_mode = WAL`);
db.exec(`PRAGMA foreign_keys = ON`);

const newLocal = `
  CREATE TABLE IF NOT EXISTS admins (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS schools (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    location        TEXT NOT NULL,
    revenue_share   INTEGER NOT NULL DEFAULT 30,
    status          TEXT NOT NULL DEFAULT 'active',
    total_students  INTEGER NOT NULL DEFAULT 0,
    monthly_revenue INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT
  );

  CREATE TABLE IF NOT EXISTS faculty (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    subject    TEXT NOT NULL,
    school     TEXT NOT NULL,
    school_id  TEXT NOT NULL,
    rating     REAL NOT NULL DEFAULT 0,
    students   INTEGER NOT NULL DEFAULT 0,
    status     TEXT NOT NULL DEFAULT 'active',
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL,
    experience INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS students (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    class       TEXT NOT NULL,
    school      TEXT NOT NULL,
    school_id   TEXT NOT NULL,
    fee_status  TEXT NOT NULL DEFAULT 'pending',
    amount      INTEGER NOT NULL DEFAULT 0,
    email       TEXT NOT NULL,
    phone       TEXT NOT NULL,
    enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT
  );

  CREATE TABLE IF NOT EXISTS applications (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT NOT NULL,
    type          TEXT NOT NULL,
    role_or_class TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'new',
    notes         TEXT NOT NULL DEFAULT '',
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT
  );

  CREATE TABLE IF NOT EXISTS leads (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL,
    location   TEXT NOT NULL DEFAULT '',
    type       TEXT NOT NULL DEFAULT 'student',
    status     TEXT NOT NULL DEFAULT 'new',
    notes      TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
  );
  CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY,
  profileName TEXT,
  institute_name TEXT,
  admin_email TEXT,
  support_phone TEXT,
  profile_photo TEXT,
  emailNotifications INTEGER NOT NULL DEFAULT 1,
  pushNotifications INTEGER NOT NULL DEFAULT 1,
  weeklyReports INTEGER NOT NULL DEFAULT 0,
  twoFactorAuth INTEGER NOT NULL DEFAULT 0,
  theme TEXT NOT NULL DEFAULT 'system',
  updated_at TEXT
);
`;
// ─── Create tables ──────────────────────────────────────────────────────────

db.exec(newLocal);

function ensureColumn(table: string, column: string, definition: string): void {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!columns.some((existing) => existing.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

[
  ['profileName', 'TEXT'],
  ['institute_name', 'TEXT'],
  ['admin_email', 'TEXT'],
  ['support_phone', 'TEXT'],
  ['profile_photo', 'TEXT'],
  ['emailNotifications', 'INTEGER NOT NULL DEFAULT 1'],
  ['pushNotifications', 'INTEGER NOT NULL DEFAULT 1'],
  ['weeklyReports', 'INTEGER NOT NULL DEFAULT 0'],
  ['twoFactorAuth', 'INTEGER NOT NULL DEFAULT 0'],
  ['theme', "TEXT NOT NULL DEFAULT 'system'"],
  ['updated_at', 'TEXT'],
].forEach(([column, definition]) => ensureColumn('admin_settings', column, definition));

// ─── Seed default admin ──────────────────────────────────────────────────────

function seedAdmin(): void {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('[db] Admin credentials not seeded. Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env.');
    return;
  }

  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 10);
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)').run(id, email, hash);
    console.log(`[db] Default admin created: ${email}`);
  }
}

seedAdmin();

export default db;
