-- ============================================================
--  ARYAVARTA — SQLite Schema
--  Database: server/aryavarta.db
--  Generated: 2026-04-19
-- ============================================================

-- Admin users (for portal login)
CREATE TABLE IF NOT EXISTS admins (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Partner schools
CREATE TABLE IF NOT EXISTS schools (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  location        TEXT NOT NULL,
  revenue_share   INTEGER NOT NULL DEFAULT 30,
  status          TEXT NOT NULL DEFAULT 'active',  -- 'active' | 'inactive'
  total_students  INTEGER NOT NULL DEFAULT 0,
  monthly_revenue INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT
);

-- Faculty members
CREATE TABLE IF NOT EXISTS faculty (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  school      TEXT NOT NULL,
  school_id   TEXT NOT NULL,
  rating      REAL NOT NULL DEFAULT 0,
  students    INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'active',   -- 'active' | 'inactive'
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  experience  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT
);

-- Enrolled students
CREATE TABLE IF NOT EXISTS students (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  class       TEXT NOT NULL,
  school      TEXT NOT NULL,
  school_id   TEXT NOT NULL,
  fee_status  TEXT NOT NULL DEFAULT 'pending',  -- 'paid' | 'pending' | 'overdue'
  amount      INTEGER NOT NULL DEFAULT 0,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT
);

-- Applications (student, faculty, and school applicants from public forms)
CREATE TABLE IF NOT EXISTS applications (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  type         TEXT NOT NULL,  -- 'student' | 'faculty' | 'school'
  role_or_class TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new',  -- 'new' | 'reviewed' | 'approved' | 'rejected'
  notes        TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT
);

-- CRM Leads
CREATE TABLE IF NOT EXISTS leads (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  location   TEXT NOT NULL DEFAULT '',
  type       TEXT NOT NULL DEFAULT 'student',  -- 'student' | 'faculty' | 'school'
  status     TEXT NOT NULL DEFAULT 'new',      -- 'new' | 'contacted' | 'converted' | 'lost'
  notes      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Admin portal preferences and institute contact details
CREATE TABLE IF NOT EXISTS admin_settings (
  id                   TEXT PRIMARY KEY,
  profileName          TEXT,
  institute_name       TEXT,
  admin_email          TEXT,
  support_phone        TEXT,
  profile_photo        TEXT,
  emailNotifications   INTEGER NOT NULL DEFAULT 1,
  pushNotifications    INTEGER NOT NULL DEFAULT 1,
  weeklyReports        INTEGER NOT NULL DEFAULT 0,
  twoFactorAuth        INTEGER NOT NULL DEFAULT 0,
  theme                TEXT NOT NULL DEFAULT 'system',
  updated_at           TEXT
);
