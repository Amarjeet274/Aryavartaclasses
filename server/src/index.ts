import express, { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'aryavarta_dev_secret';

// ─── Middleware ─────────────────────────────────────────────────────────────

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CORS_ORIGIN, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
// Increase JSON payload size limit to handle base64-encoded images (up to 5MB)
app.use(express.json({ limit: '5mb' }));

// ─── Auth middleware ─────────────────────────────────────────────────────────

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function uuid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

const EMAIL_VERIFICATION_TTL_MS = 10 * 60 * 1000;
const pendingAuthChallenges = new Map<string, {
  adminId: string;
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}>();
const pendingPasswordResets = new Map<string, {
  adminId: string;
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}>();
const pendingEmailChanges = new Map<string, {
  adminId: string;
  currentEmail: string;
  newEmail: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}>();

function hashVerificationCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function createVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${'*'.repeat(Math.max(1, name.length - visible.length))}@${domain}`;
}

async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const from = process.env.EMAIL_FROM;
  const resendApiKey = process.env.RESEND_API_KEY;
  const subject = 'ARYAVARTA admin verification code';
  const text = `Your ARYAVARTA admin verification code is ${code}. It expires in 10 minutes.`;

  if (from && resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Email provider failed: ${errorBody}`);
    }
    return;
  }

  console.warn('[auth] Email provider is not configured. Set EMAIL_FROM and RESEND_API_KEY to send real email.');
  console.log(`[auth] Verification code for ${email}: ${code}`);
}

async function sendPasswordResetEmail(email: string, code: string): Promise<void> {
  const from = process.env.EMAIL_FROM;
  const resendApiKey = process.env.RESEND_API_KEY;
  const subject = 'ARYAVARTA admin password reset code';
  const text = `Your ARYAVARTA admin password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`;

  if (from && resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Email provider failed: ${errorBody}`);
    }
    return;
  }

  console.warn('[auth] Email provider is not configured. Set EMAIL_FROM and RESEND_API_KEY to send real email.');
  console.log(`[auth] Password reset code for ${email}: ${code}`);
}

async function sendEmailChangeCode(email: string, code: string): Promise<void> {
  const from = process.env.EMAIL_FROM;
  const resendApiKey = process.env.RESEND_API_KEY;
  const subject = 'ARYAVARTA admin email change code';
  const text = `Your ARYAVARTA admin email change code is ${code}. It expires in 10 minutes. If you did not request this, change your password immediately.`;

  if (from && resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: email, subject, text }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Email provider failed: ${errorBody}`);
    }
    return;
  }

  console.warn('[auth] Email provider is not configured. Set EMAIL_FROM and RESEND_API_KEY to send real email.');
  console.log(`[auth] Email change code for ${email}: ${code}`);
}

function issueAdminSession(admin: { id: string; email: string }) {
  const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: admin.id, email: admin.email } };
}

// ─── Safe dynamic update helper ─────────────────────────────────────────────
// Prevents SQL injection by whitelisting allowed fields per table
const ALLOWED_FIELDS: Record<string, string[]> = {
  schools: ['name', 'location', 'revenue_share', 'status', 'total_students', 'monthly_revenue'],
  faculty: ['name', 'subject', 'school', 'school_id', 'rating', 'students', 'status', 'email', 'phone', 'experience'],
  students: ['name', 'class', 'school', 'school_id', 'fee_status', 'amount', 'email', 'phone', 'enrolled_at'],
  applications: ['name', 'email', 'phone', 'type', 'role_or_class', 'status', 'notes'],
  leads: ['name', 'email', 'phone', 'location', 'type', 'status', 'notes'],
  admin_settings: [
    'profileName',
    'institute_name',
    'admin_email',
    'support_phone',
    'profile_photo',
    'profilePhoto',
    'emailNotifications',
    'pushNotifications',
    'weeklyReports',
    'twoFactorAuth',
    'theme',
  ],
};

function buildSafeUpdate(table: string, fields: Record<string, any>): { query: string; values: any[] } {
  const allowed = ALLOWED_FIELDS[table];
  if (!allowed) throw new Error(`Unknown table: ${table}`);

  const updates: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (!allowed.includes(key)) {
      console.warn(`Ignored disallowed field: ${key} for table ${table}`);
      continue;
    }
    updates.push(`${key} = ?`);
    values.push(value);
  }

  if (updates.length === 0) throw new Error('No valid fields to update');

  return {
    query: updates.join(', '),
    values,
  };
}

// ─── Health ──────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: 'sqlite' }));

// ─── AUTH ────────────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) { res.status(400).json({ error: 'Email and password are required' }); return; }

    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as any;
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const code = createVerificationCode();
    const challengeId = uuid();
    pendingAuthChallenges.set(challengeId, {
      adminId: admin.id,
      email: admin.email,
      codeHash: hashVerificationCode(code),
      expiresAt: Date.now() + EMAIL_VERIFICATION_TTL_MS,
      attempts: 0,
    });

    await sendVerificationEmail(admin.email, code);

    res.json({
      data: {
        requiresVerification: true,
        challengeId,
        email: maskEmail(admin.email),
        expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
      },
    });
  } catch (e) {
    console.error('Error during login:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/verify-email', (req: Request, res: Response) => {
  try {
    const { challengeId, code } = req.body || {};
    if (!challengeId || !code) {
      res.status(400).json({ error: 'Verification code is required' });
      return;
    }

    const challenge = pendingAuthChallenges.get(challengeId);
    if (!challenge) {
      res.status(400).json({ error: 'Verification session was not found' });
      return;
    }

    if (Date.now() > challenge.expiresAt) {
      pendingAuthChallenges.delete(challengeId);
      res.status(400).json({ error: 'Verification code expired. Please sign in again.' });
      return;
    }

    if (challenge.attempts >= 5) {
      pendingAuthChallenges.delete(challengeId);
      res.status(429).json({ error: 'Too many verification attempts. Please sign in again.' });
      return;
    }

    if (hashVerificationCode(String(code).trim()) !== challenge.codeHash) {
      challenge.attempts += 1;
      res.status(401).json({ error: 'Invalid verification code' });
      return;
    }

    const admin = db.prepare('SELECT id, email FROM admins WHERE id = ?').get(challenge.adminId) as any;
    pendingAuthChallenges.delete(challengeId);

    if (!admin) {
      res.status(401).json({ error: 'Admin account no longer exists' });
      return;
    }

    res.json({ data: issueAdminSession(admin) });
  } catch (e) {
    console.error('Error during email verification:', e);
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const email = String(req.body?.email || '').trim();
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }

    const admin = db.prepare('SELECT id, email FROM admins WHERE email = ?').get(email) as any;
    if (admin) {
      const code = createVerificationCode();
      const resetId = uuid();
      pendingPasswordResets.set(resetId, {
        adminId: admin.id,
        email: admin.email,
        codeHash: hashVerificationCode(code),
        expiresAt: Date.now() + EMAIL_VERIFICATION_TTL_MS,
        attempts: 0,
      });
      await sendPasswordResetEmail(admin.email, code);

      res.json({
        data: {
          resetId,
          email: maskEmail(admin.email),
          expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
        },
      });
      return;
    }

    res.json({
      data: {
        resetId: '',
        email: maskEmail(email),
        expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
      },
    });
  } catch (e) {
    console.error('Error during password reset request:', e);
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { resetId, code, password } = req.body || {};
    const nextPassword = String(password || '');

    if (!resetId || !code || !nextPassword) {
      res.status(400).json({ error: 'Reset code and new password are required' });
      return;
    }
    if (nextPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const reset = pendingPasswordResets.get(resetId);
    if (!reset) {
      res.status(400).json({ error: 'Password reset session was not found' });
      return;
    }

    if (Date.now() > reset.expiresAt) {
      pendingPasswordResets.delete(resetId);
      res.status(400).json({ error: 'Reset code expired. Please request a new code.' });
      return;
    }

    if (reset.attempts >= 5) {
      pendingPasswordResets.delete(resetId);
      res.status(429).json({ error: 'Too many reset attempts. Please request a new code.' });
      return;
    }

    if (hashVerificationCode(String(code).trim()) !== reset.codeHash) {
      reset.attempts += 1;
      res.status(401).json({ error: 'Invalid reset code' });
      return;
    }

    const hash = bcrypt.hashSync(nextPassword, 10);
    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hash, reset.adminId);
    pendingPasswordResets.delete(resetId);

    res.json({ data: { success: true } });
  } catch (e) {
    console.error('Error during password reset:', e);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

app.post('/api/auth/email-change/request', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const newEmail = String(req.body?.newEmail || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!newEmail || !newEmail.includes('@')) {
      res.status(400).json({ error: 'A valid new email address is required' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Current password is required' });
      return;
    }

    const admin = db.prepare('SELECT id, email, password_hash FROM admins WHERE id = ?').get(user.id) as any;
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }
    if (newEmail === String(admin.email).toLowerCase()) {
      res.status(400).json({ error: 'Enter a different email address' });
      return;
    }

    const duplicateAdmin = db.prepare('SELECT id FROM admins WHERE lower(email) = ? AND id <> ?').get(newEmail, admin.id);
    if (duplicateAdmin) {
      res.status(409).json({ error: 'This email is already used by another admin account' });
      return;
    }

    const code = createVerificationCode();
    const challengeId = uuid();
    pendingEmailChanges.set(challengeId, {
      adminId: admin.id,
      currentEmail: admin.email,
      newEmail,
      codeHash: hashVerificationCode(code),
      expiresAt: Date.now() + EMAIL_VERIFICATION_TTL_MS,
      attempts: 0,
    });

    await sendEmailChangeCode(admin.email, code);

    res.json({
      data: {
        challengeId,
        email: maskEmail(admin.email),
        expiresInSeconds: EMAIL_VERIFICATION_TTL_MS / 1000,
      },
    });
  } catch (e) {
    console.error('Error requesting admin email change:', e);
    res.status(500).json({ error: 'Email change request failed' });
  }
});

app.post('/api/auth/email-change/verify', requireAuth, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const challengeId = String(req.body?.challengeId || '');
    const code = String(req.body?.code || '').trim();
    const challenge = pendingEmailChanges.get(challengeId);

    if (!challengeId || !code) {
      res.status(400).json({ error: 'Verification code is required' });
      return;
    }
    if (!challenge || challenge.adminId !== user.id) {
      res.status(400).json({ error: 'Email change session was not found' });
      return;
    }
    if (Date.now() > challenge.expiresAt) {
      pendingEmailChanges.delete(challengeId);
      res.status(400).json({ error: 'Verification code expired. Please start again.' });
      return;
    }
    if (challenge.attempts >= 5) {
      pendingEmailChanges.delete(challengeId);
      res.status(429).json({ error: 'Too many verification attempts. Please start again.' });
      return;
    }
    if (hashVerificationCode(code) !== challenge.codeHash) {
      challenge.attempts += 1;
      res.status(401).json({ error: 'Invalid verification code' });
      return;
    }

    const duplicateAdmin = db
      .prepare('SELECT id FROM admins WHERE lower(email) = ? AND id <> ?')
      .get(challenge.newEmail, challenge.adminId);
    if (duplicateAdmin) {
      pendingEmailChanges.delete(challengeId);
      res.status(409).json({ error: 'This email is already used by another admin account' });
      return;
    }

    db.exec('BEGIN');
    try {
      db.prepare('UPDATE admins SET email = ? WHERE id = ?').run(challenge.newEmail, challenge.adminId);
      db.prepare('UPDATE admin_settings SET admin_email = ?, updated_at = ?').run(challenge.newEmail, now());
      db.exec('COMMIT');
    } catch (innerError) {
      db.exec('ROLLBACK');
      throw innerError;
    }

    pendingEmailChanges.delete(challengeId);
    res.json({ data: issueAdminSession({ id: challenge.adminId, email: challenge.newEmail }) });
  } catch (e) {
    console.error('Error verifying admin email change:', e);
    res.status(500).json({ error: 'Email change verification failed' });
  }
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ data: { user } });
});

// ─── SCHOOLS ─────────────────────────────────────────────────────────────────

app.get('/api/schools', requireAuth, (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM schools ORDER BY created_at DESC').all();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error fetching schools:', e);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

app.post('/api/schools', requireAuth, (req: Request, res: Response) => {
  try {
    const { name, location, revenue_share, status, total_students, monthly_revenue } = req.body;
    const id = uuid();
    db.prepare(`
      INSERT INTO schools (id, name, location, revenue_share, status, total_students, monthly_revenue)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, location, revenue_share ?? 30, status ?? 'active', total_students ?? 0, monthly_revenue ?? 0);
    const school = db.prepare('SELECT * FROM schools WHERE id = ?').get(id);
    res.json({ data: school });
  } catch (e) {
    console.error('Error creating school:', e);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

app.put('/api/schools/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM schools WHERE id = ?').get(id);
    if (!existing) { res.status(404).json({ error: 'School not found' }); return; }
    const { query, values } = buildSafeUpdate('schools', req.body);
    db.prepare(`UPDATE schools SET ${query}, updated_at = ? WHERE id = ?`).run(...values, now(), id);
    const updated = db.prepare('SELECT * FROM schools WHERE id = ?').get(id);
    res.json({ data: updated });
  } catch (e) {
    console.error('Error updating school:', e);
    res.status(500).json({ error: 'Failed to update school' });
  }
});

app.delete('/api/schools/:id', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM schools WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting school:', e);
    res.status(500).json({ error: 'Failed to delete school' });
  }
});

// ─── FACULTY ─────────────────────────────────────────────────────────────────

app.get('/api/faculty', requireAuth, (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM faculty ORDER BY created_at DESC').all();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error fetching faculty:', e);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

app.post('/api/faculty', requireAuth, (req: Request, res: Response) => {
  try {
    const { name, subject, school, school_id, rating, students, status, email, phone, experience } = req.body;
    const id = uuid();
    db.prepare(`
      INSERT INTO faculty (id, name, subject, school, school_id, rating, students, status, email, phone, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, subject, school ?? '', school_id ?? '', rating ?? 0, students ?? 0, status ?? 'active', email, phone, experience ?? 0);
    const member = db.prepare('SELECT * FROM faculty WHERE id = ?').get(id);
    res.json({ data: member });
  } catch (e) {
    console.error('Error creating faculty:', e);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

app.put('/api/faculty/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM faculty WHERE id = ?').get(id);
    if (!existing) { res.status(404).json({ error: 'Faculty not found' }); return; }
    const { query, values } = buildSafeUpdate('faculty', req.body);
    db.prepare(`UPDATE faculty SET ${query}, updated_at = ? WHERE id = ?`).run(...values, now(), id);
    const updated = db.prepare('SELECT * FROM faculty WHERE id = ?').get(id);
    res.json({ data: updated });
  } catch (e) {
    console.error('Error updating faculty:', e);
    res.status(500).json({ error: 'Failed to update faculty' });
  }
});

app.delete('/api/faculty/:id', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM faculty WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting faculty:', e);
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
});

// ─── STUDENTS ────────────────────────────────────────────────────────────────

app.get('/api/students', requireAuth, (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM students ORDER BY created_at DESC').all();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error fetching students:', e);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', requireAuth, (req: Request, res: Response) => {
  try {
    const { name, class: cls, school, school_id, fee_status, amount, email, phone, enrolled_at } = req.body;
    const id = uuid();
    db.prepare(`
      INSERT INTO students (id, name, class, school, school_id, fee_status, amount, email, phone, enrolled_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, cls ?? '', school ?? '', school_id ?? '', fee_status ?? 'pending', amount ?? 0, email, phone, enrolled_at ?? now());
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json({ data: student });
  } catch (e) {
    console.error('Error creating student:', e);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.put('/api/students/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!existing) { res.status(404).json({ error: 'Student not found' }); return; }
    const { query, values } = buildSafeUpdate('students', req.body);
    db.prepare(`UPDATE students SET ${query}, updated_at = ? WHERE id = ?`).run(...values, now(), id);
    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json({ data: updated });
  } catch (e) {
    console.error('Error updating student:', e);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/api/students/:id', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting student:', e);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ─── APPLICATIONS ────────────────────────────────────────────────────────────

app.get('/api/applications', requireAuth, (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error fetching applications:', e);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.post('/api/applications', (req: Request, res: Response) => {
  try {
    const { name, email, phone, type, role_or_class, notes } = req.body;
    const id = uuid();
    db.prepare(`
      INSERT INTO applications (id, name, email, phone, type, role_or_class, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, phone, type, role_or_class ?? '', notes ?? '');
    const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    res.json({ data: application });
  } catch (e) {
    console.error('Error creating application:', e);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

app.patch('/api/applications/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    if (!existing) { res.status(404).json({ error: 'Application not found' }); return; }
    const { query, values } = buildSafeUpdate('applications', req.body);
    db.prepare(`UPDATE applications SET ${query}, updated_at = ? WHERE id = ?`).run(...values, now(), id);
    const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
    res.json({ data: updated });
  } catch (e) {
    console.error('Error updating application:', e);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

app.delete('/api/applications/:id', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting application:', e);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// ─── LEADS ───────────────────────────────────────────────────────────────────

app.get('/api/leads', requireAuth, (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    res.json({ data: rows });
  } catch (e) {
    console.error('Error fetching leads:', e);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/leads', requireAuth, (req: Request, res: Response) => {
  try {
    const { name, email, phone, location, type, status, notes } = req.body;
    const id = uuid();
    db.prepare(`
      INSERT INTO leads (id, name, email, phone, location, type, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, phone, location ?? '', type ?? 'student', status ?? 'new', notes ?? '');
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    res.json({ data: lead });
  } catch (e) {
    console.error('Error creating lead:', e);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

app.patch('/api/leads/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    if (!existing) { res.status(404).json({ error: 'Lead not found' }); return; }
    const { query, values } = buildSafeUpdate('leads', req.body);
    db.prepare(`UPDATE leads SET ${query}, updated_at = ? WHERE id = ?`).run(...values, now(), id);
    const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    res.json({ data: updated });
  } catch (e) {
    console.error('Error updating lead:', e);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

app.delete('/api/leads/:id', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting lead:', e);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// ─── Admin settings ───────────────────────────────────────────────────────────
app.get('/api/admin-settings', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const admin = db.prepare('SELECT id, email FROM admins WHERE id = ?').get(user.id) as any;
    const settings = db
      .prepare('SELECT * FROM admin_settings LIMIT 1')
      .get() as any;

    res.json({
      data: settings ? {
        ...settings,
        admin_email: admin?.email || '',
        profilePhoto: settings.profile_photo || '',
        emailNotifications: Boolean(settings.emailNotifications),
        pushNotifications: Boolean(settings.pushNotifications),
        weeklyReports: Boolean(settings.weeklyReports),
        twoFactorAuth: Boolean(settings.twoFactorAuth),
      } : {
        admin_email: admin?.email || '',
      },
    });
  } catch (e) {
    console.error('Error fetching admin settings:', e);
    res.status(500).json({
      error: 'Failed to fetch settings: ' + (e instanceof Error ? e.message : String(e)),
    });
  }
});

app.post('/api/admin-settings', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const body = req.body;
    console.log('[admin-settings] Received request with fields:', Object.keys(body));

    // Validate photo size (base64 string limit ~4MB to be safe)
    const photoSize = body.profilePhoto?.length || 0;
    if (photoSize > 4 * 1024 * 1024) {
      console.warn(`[admin-settings] Photo too large: ${photoSize} bytes`);
      return res.status(400).json({ error: 'Profile photo is too large. Maximum 2MB image recommended.' });
    }

    // Prepare sanitized data
    const profileName = String(body.profileName || '').slice(0, 255);
    const institute_name = String(body.institute_name || '').slice(0, 255);
    const support_phone = String(body.support_phone || '').slice(0, 50);
    const profile_photo = String(body.profilePhoto || body.profile_photo || '');
    const emailNotifications = body.emailNotifications ? 1 : 0;
    const pushNotifications = body.pushNotifications ? 1 : 0;
    const weeklyReports = body.weeklyReports ? 1 : 0;
    const twoFactorAuth = body.twoFactorAuth ? 1 : 0;
    const theme = ['light', 'dark', 'system'].includes(body.theme) ? body.theme : 'system';

    const currentAdmin = db.prepare('SELECT id, email FROM admins WHERE id = ?').get(user.id) as any;
    if (!currentAdmin) {
      res.status(401).json({ error: 'Admin account not found' });
      return;
    }
    const admin_email = currentAdmin.email;

    const existing = db.prepare('SELECT * FROM admin_settings LIMIT 1').get() as any;

    if (existing) {
      console.log('[admin-settings] Updating existing record, ID:', existing.id);
      db.prepare(`
        UPDATE admin_settings
        SET profileName = ?, institute_name = ?, admin_email = ?, support_phone = ?, profile_photo = ?,
            emailNotifications = ?, pushNotifications = ?, weeklyReports = ?, twoFactorAuth = ?, theme = ?,
            updated_at = ?
        WHERE id = ?
      `).run(
        profileName,
        institute_name,
        admin_email,
        support_phone,
        profile_photo,
        emailNotifications,
        pushNotifications,
        weeklyReports,
        twoFactorAuth,
        theme,
        now(),
        existing.id,
      );

      const updated = db.prepare('SELECT * FROM admin_settings WHERE id = ?').get(existing.id) as any;
      res.json({
        data: {
          ...updated,
          profilePhoto: updated.profile_photo || '',
          emailNotifications: Boolean(updated.emailNotifications),
          pushNotifications: Boolean(updated.pushNotifications),
          weeklyReports: Boolean(updated.weeklyReports),
          twoFactorAuth: Boolean(updated.twoFactorAuth),
        },
      });
    } else {
      const id = crypto.randomUUID();
      console.log('[admin-settings] Creating new record, ID:', id);
      db.prepare(`
        INSERT INTO admin_settings (
          id, profileName, institute_name, admin_email, support_phone, profile_photo,
          emailNotifications, pushNotifications, weeklyReports, twoFactorAuth, theme, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        profileName,
        institute_name,
        admin_email,
        support_phone,
        profile_photo,
        emailNotifications,
        pushNotifications,
        weeklyReports,
        twoFactorAuth,
        theme,
        now(),
      );

      const created = db.prepare('SELECT * FROM admin_settings WHERE id = ?').get(id) as any;
      res.json({
        data: {
          ...created,
          profilePhoto: created.profile_photo || '',
          emailNotifications: Boolean(created.emailNotifications),
          pushNotifications: Boolean(created.pushNotifications),
          weeklyReports: Boolean(created.weeklyReports),
          twoFactorAuth: Boolean(created.twoFactorAuth),
        },
      });
    }
  } catch (e) {
    console.error('[admin-settings] Error:', e);
    const errorMsg = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: 'Failed to save settings: ' + errorMsg });
  }
});

// ─── SEED ────────────────────────────────────────────────────────────────────

app.post('/api/seed', requireAuth, (_req, res) => {
  try {
    const insertSchool = db.prepare(`
      INSERT OR IGNORE INTO schools (id, name, location, revenue_share, status, total_students, monthly_revenue)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertFaculty = db.prepare(`
      INSERT OR IGNORE INTO faculty (id, name, subject, school, school_id, rating, students, status, email, phone, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertStudent = db.prepare(`
      INSERT OR IGNORE INTO students (id, name, class, school, school_id, fee_status, amount, email, phone, enrolled_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertApp = db.prepare(`
      INSERT OR IGNORE INTO applications (id, name, email, phone, type, role_or_class, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertLead = db.prepare(`
      INSERT OR IGNORE INTO leads (id, name, email, phone, location, type, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      [
        ['s1', "St. Mary's Convent School", 'New Delhi', 40, 'active', 45, 1125000],
        ['s2', 'Delhi Public School', 'Noida', 40, 'active', 38, 950000],
        ['s3', 'Kendriya Vidyalaya', 'Gurgaon', 30, 'active', 42, 1050000],
        ['s4', 'DAV Public School', 'Faridabad', 20, 'active', 28, 700000],
        ['s5', 'Ryan International', 'Greater Noida', 30, 'inactive', 0, 0],
      ].forEach(s => insertSchool.run(...s as any[]));

      [
        ['f1', 'Dr. Rajesh Kumar', 'Mathematics', "St. Mary's Convent School", 's1', 4.8, 35, 'active', 'rajesh.kumar@arya.edu', '+91 98765 11111', 8],
        ['f2', 'Ms. Priya Sharma', 'Physics', 'Delhi Public School', 's2', 4.9, 32, 'active', 'priya.sharma@arya.edu', '+91 98765 22222', 6],
        ['f3', 'Prof. Amit Patel', 'Chemistry', 'Kendriya Vidyalaya', 's3', 4.7, 38, 'active', 'amit.patel@arya.edu', '+91 98765 33333', 10],
        ['f4', 'Mrs. Sneha Verma', 'English', "St. Mary's Convent School", 's1', 4.6, 40, 'active', 'sneha.verma@arya.edu', '+91 98765 44444', 5],
        ['f5', 'Mr. Vikram Singh', 'Biology', 'Delhi Public School', 's2', 4.5, 28, 'active', 'vikram.singh@arya.edu', '+91 98765 55555', 7],
      ].forEach(f => insertFaculty.run(...f as any[]));

      const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
      [
        ['st1', 'Arjun Mehta', 'Class 10', "St. Mary's Convent School", 's1', 'paid', 25000, 'arjun.mehta@gmail.com', '+91 77777 11111', daysAgo(90)],
        ['st2', 'Riya Singh', 'Class 12', 'Delhi Public School', 's2', 'paid', 25000, 'riya.singh@gmail.com', '+91 77777 22222', daysAgo(80)],
        ['st3', 'Karan Gupta', 'Class 11', 'Kendriya Vidyalaya', 's3', 'pending', 25000, 'karan.gupta@gmail.com', '+91 77777 33333', daysAgo(60)],
        ['st4', 'Ananya Reddy', 'Class 10', "St. Mary's Convent School", 's1', 'overdue', 25000, 'ananya.reddy@gmail.com', '+91 77777 44444', daysAgo(120)],
        ['st5', 'Rohan Mishra', 'Class 9', 'DAV Public School', 's4', 'paid', 20000, 'rohan.mishra@gmail.com', '+91 77777 55555', daysAgo(45)],
        ['st6', 'Pooja Nair', 'Class 12', 'Kendriya Vidyalaya', 's3', 'paid', 25000, 'pooja.nair@gmail.com', '+91 77777 66666', daysAgo(30)],
      ].forEach(s => insertStudent.run(...s as any[]));

      [
        ['a1', 'Rahul Sharma', 'rahul.sharma@gmail.com', '+91 98765 43210', 'student', 'Class 10', 'new', ''],
        ['a2', 'Priya Patel', 'priya.patel@gmail.com', '+91 87654 32109', 'faculty', 'Mathematics Teacher', 'new', ''],
        ['a3', 'Amit Kumar', 'amit.kumar@gmail.com', '+91 76543 21098', 'student', 'Class 12', 'reviewed', 'Promising candidate'],
        ['a4', 'Sneha Verma', 'sneha.verma@gmail.com', '+91 65432 10987', 'faculty', 'Physics Teacher', 'approved', 'Excellent profile'],
        ['a5', 'Dev Sharma', 'dev.sharma@gmail.com', '+91 55555 11111', 'student', 'Class 11', 'new', ''],
      ].forEach(a => insertApp.run(...a as any[]));

      [
        ['l1', 'Modern Public School', 'contact@modernpublic.edu', '+91 98765 00001', 'Mumbai', 'school', 'new', 'Interested in Tier 2 partnership'],
        ['l2', 'Vikram Malhotra', 'vikram.m@gmail.com', '+91 98765 00002', 'Delhi', 'student', 'contacted', 'Called on 15 Apr'],
        ['l3', 'Dr. Meera Kapoor', 'meera.kapoor@gmail.com', '+91 98765 00003', 'Bangalore', 'faculty', 'converted', 'Joined as Physics teacher'],
        ['l4', 'Sunrise Academy', 'info@sunriseacademy.edu', '+91 98765 00004', 'Pune', 'school', 'contacted', 'Meeting scheduled for next week'],
        ['l5', 'Neha Joshi', 'neha.joshi@gmail.com', '+91 98765 00005', 'Chennai', 'student', 'new', ''],
      ].forEach(l => insertLead.run(...l as any[]));

      db.exec('COMMIT');
    } catch (innerErr) {
      db.exec('ROLLBACK');
      throw innerErr;
    }

    res.json({ success: true, message: 'Seed data inserted' });
  } catch (e) {
    console.error('Seed error:', e);
    res.status(500).json({ error: 'Seed failed: ' + String(e) });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\nARYAVARTA API running at http://localhost:${PORT}`);
  console.log(`Database: SQLite (aryavarta.db)`);
  console.log(`Auth: JWT (local)\n`);
});
