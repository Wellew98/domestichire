// Database layer — SQLite (local) / PostgreSQL (Vercel)
import Database from "better-sqlite3";
import { sql as pgSql } from "@vercel/postgres";
import path from "path";

const DB_PATH = path.join(process.cwd(), "marketplace.db");
const isProd = !!process.env.POSTGRES_URL;

// ---- SQLite (local dev) ----
let _sqliteDb: Database.Database | null = null;

function getSqlite(): Database.Database {
  if (!_sqliteDb) {
    _sqliteDb = new Database(DB_PATH);
    _sqliteDb.pragma("journal_mode = WAL");
    _sqliteDb.pragma("foreign_keys = ON");
    initSqliteSchema();
  }
  return _sqliteDb;
}

function initSqliteSchema() {
  const db = getSqlite();
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, photo_url TEXT DEFAULT '', category TEXT NOT NULL,
      experience_years INTEGER DEFAULT 0, expected_salary REAL DEFAULT 0,
      skills TEXT DEFAULT '[]', languages TEXT DEFAULT '[]',
      live_in INTEGER DEFAULT 0, location TEXT DEFAULT '', available INTEGER DEFAULT 1,
      description TEXT DEFAULT '', phone TEXT DEFAULT '', whatsapp TEXT DEFAULT '', email TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS employers (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, employer_id INTEGER NOT NULL,
      worker_id INTEGER NOT NULL, amount REAL NOT NULL, currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending', payment_ref TEXT UNIQUE, paystack_ref TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

// ---- Init PostgreSQL schema (run once on deploy) ----
export async function initPgSchema() {
  if (!isProd) return;
  await pgSql`
    CREATE TABLE IF NOT EXISTS workers (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, photo_url TEXT DEFAULT '', category TEXT NOT NULL,
      experience_years INTEGER DEFAULT 0, expected_salary REAL DEFAULT 0,
      skills JSONB DEFAULT '[]', languages JSONB DEFAULT '[]',
      live_in BOOLEAN DEFAULT false, location TEXT DEFAULT '', available BOOLEAN DEFAULT true,
      description TEXT DEFAULT '', phone TEXT DEFAULT '', whatsapp TEXT DEFAULT '', email TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS employers (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY, employer_id INTEGER NOT NULL, worker_id INTEGER NOT NULL,
      amount REAL NOT NULL, currency TEXT DEFAULT 'USD', status TEXT DEFAULT 'pending',
      payment_ref TEXT UNIQUE, paystack_ref TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

// ---- Worker helpers ----
export function getAllWorkers(filters?: Record<string, any>) {
  if (isProd) {
    return pgGetAllWorkers(filters);
  }
  const db = getSqlite();
  let query = "SELECT * FROM workers WHERE 1=1";
  const params: any[] = [];
  if (filters?.category) { query += " AND category = ?"; params.push(filters.category); }
  if (filters?.location) { query += " AND location LIKE ?"; params.push(`%${filters.location}%`); }
  if (filters?.minExperience) { query += " AND experience_years >= ?"; params.push(filters.minExperience); }
  if (filters?.maxSalary) { query += " AND expected_salary <= ?"; params.push(filters.maxSalary); }
  if (filters?.liveIn !== undefined) { query += " AND live_in = ?"; params.push(filters.liveIn ? 1 : 0); }
  if (filters?.available !== undefined) { query += " AND available = ?"; params.push(filters.available ? 1 : 0); }
  if (filters?.language) { query += " AND languages LIKE ?"; params.push(`%${filters.language}%`); }
  query += " ORDER BY created_at DESC";
  return db.prepare(query).all(...params).map(formatWorker);
}

async function pgGetAllWorkers(filters?: Record<string, any>) {
  let query = "SELECT * FROM workers WHERE 1=1";
  const params: any[] = [];
  let idx = 1;
  if (filters?.category) { query += ` AND category = $${idx++}`; params.push(filters.category); }
  if (filters?.location) { query += ` AND location ILIKE $${idx++}`; params.push(`%${filters.location}%`); }
  if (filters?.minExperience) { query += ` AND experience_years >= $${idx++}`; params.push(filters.minExperience); }
  if (filters?.maxSalary) { query += ` AND expected_salary <= $${idx++}`; params.push(filters.maxSalary); }
  if (filters?.liveIn !== undefined) { query += ` AND live_in = $${idx++}`; params.push(filters.liveIn); }
  if (filters?.available !== undefined) { query += ` AND available = $${idx++}`; params.push(filters.available); }
  if (filters?.language) { query += ` AND languages::text ILIKE $${idx++}`; params.push(`%${filters.language}%`); }
  query += " ORDER BY created_at DESC";
  const { rows } = await pgSql.query(query, params);
  return rows.map(formatWorker);
}

export function getWorkerById(id: number) {
  if (isProd) return pgGetWorkerById(id);
  const w = getSqlite().prepare("SELECT * FROM workers WHERE id = ?").get(id) as any;
  return w ? formatWorkerFull(w) : null;
}

async function pgGetWorkerById(id: number) {
  const { rows } = await pgSql`SELECT * FROM workers WHERE id = ${id}`;
  return rows.length ? formatWorkerFull(rows[0]) : null;
}

// ---- Insert helpers ----
export function insertWorker(data: any) {
  if (isProd) return pgInsertWorker(data);
  return getSqlite().prepare(`INSERT INTO workers (name, category, experience_years, expected_salary, skills, languages, live_in, location, available, description, phone, whatsapp, email, photo_url) VALUES (@name, @category, @experience_years, @expected_salary, @skills, @languages, @live_in, @location, @available, @description, @phone, @whatsapp, @email, @photo_url)`).run(data);
}

async function pgInsertWorker(data: any) {
  const { rows } = await pgSql`
    INSERT INTO workers (name, category, experience_years, expected_salary, skills, languages, live_in, location, available, description, phone, whatsapp, email, photo_url)
    VALUES (${data.name}, ${data.category}, ${data.experience_years}, ${data.expected_salary}, ${JSON.stringify(data.skills || [])}::jsonb, ${JSON.stringify(data.languages || [])}::jsonb, ${!!data.live_in}, ${data.location}, ${data.available !== 0}, ${data.description}, ${data.phone}, ${data.whatsapp}, ${data.email}, ${data.photo_url})
    RETURNING id
  `;
  return rows[0];
}

export function insertEmployer(data: any) {
  if (isProd) return pgInsertEmployer(data);
  const result = getSqlite().prepare("INSERT INTO employers (name, email, password_hash) VALUES (@name, @email, @password_hash)").run(data);
  return getEmployerById(result.lastInsertRowid as number);
}

async function pgInsertEmployer(data: any) {
  const { rows } = await pgSql`
    INSERT INTO employers (name, email, password_hash) VALUES (${data.name}, ${data.email}, ${data.password_hash}) RETURNING *
  `;
  return rows[0];
}

export function getEmployerByEmail(email: string) {
  if (isProd) return pgGetEmployerByEmail(email);
  return (getSqlite().prepare("SELECT * FROM employers WHERE email = ?").get(email) as any) || null;
}

async function pgGetEmployerByEmail(email: string) {
  const { rows } = await pgSql`SELECT * FROM employers WHERE email = ${email}`;
  return rows[0] || null;
}

export function getEmployerById(id: number) {
  if (isProd) return pgGetEmployerById(id);
  return (getSqlite().prepare("SELECT * FROM employers WHERE id = ?").get(id) as any) || null;
}

async function pgGetEmployerById(id: number) {
  const { rows } = await pgSql`SELECT * FROM employers WHERE id = ${id}`;
  return rows[0] || null;
}

export function insertPayment(data: any) {
  if (isProd) return pgInsertPayment(data);
  return getSqlite().prepare(`
    INSERT INTO payments (employer_id, worker_id, amount, currency, status, payment_ref, paystack_ref)
    VALUES (@employer_id, @worker_id, @amount, @currency, @status, @payment_ref, @paystack_ref)
  `).run(data);
}

async function pgInsertPayment(data: any) {
  return pgSql`
    INSERT INTO payments (employer_id, worker_id, amount, currency, status, payment_ref, paystack_ref)
    VALUES (${data.employer_id}, ${data.worker_id}, ${data.amount}, ${data.currency}, ${data.status}, ${data.payment_ref}, ${data.paystack_ref})
  `;
}

export function updatePaymentStatus(paymentRef: string, status: string, paystackRef?: string) {
  if (isProd) return pgUpdatePaymentStatus(paymentRef, status, paystackRef);
  getSqlite().prepare("UPDATE payments SET status = ?, paystack_ref = COALESCE(?, paystack_ref) WHERE payment_ref = ?").run(status, paystackRef || null, paymentRef);
}

async function pgUpdatePaymentStatus(paymentRef: string, status: string, paystackRef?: string) {
  await pgSql`UPDATE payments SET status = ${status}, paystack_ref = COALESCE(${paystackRef || null}, paystack_ref) WHERE payment_ref = ${paymentRef}`;
}

export function getPaymentByRef(paymentRef: string) {
  if (isProd) return pgGetPaymentByRef(paymentRef);
  return (getSqlite().prepare("SELECT * FROM payments WHERE payment_ref = ?").get(paymentRef) as any) || null;
}

async function pgGetPaymentByRef(paymentRef: string) {
  const { rows } = await pgSql`SELECT * FROM payments WHERE payment_ref = ${paymentRef}`;
  return rows[0] || null;
}

export function getPaymentByEmployerAndWorker(employerId: number, workerId: number) {
  if (isProd) return pgGetPaymentByEmployerAndWorker(employerId, workerId);
  return (getSqlite().prepare("SELECT * FROM payments WHERE employer_id = ? AND worker_id = ? AND status = 'completed'").get(employerId, workerId) as any) || null;
}

async function pgGetPaymentByEmployerAndWorker(empId: number, wkId: number) {
  const { rows } = await pgSql`SELECT * FROM payments WHERE employer_id = ${empId} AND worker_id = ${wkId} AND status = 'completed'`;
  return rows[0] || null;
}

export function getAllPayments() {
  if (isProd) return pgGetAllPayments();
  return getSqlite().prepare(`
    SELECT p.*, w.name as worker_name, e.name as employer_name FROM payments p
    LEFT JOIN workers w ON p.worker_id = w.id LEFT JOIN employers e ON p.employer_id = e.id
    ORDER BY p.created_at DESC
  `).all();
}

async function pgGetAllPayments() {
  const { rows } = await pgSql`
    SELECT p.*, w.name as worker_name, e.name as employer_name FROM payments p
    LEFT JOIN workers w ON p.worker_id = w.id LEFT JOIN employers e ON p.employer_id = e.id
    ORDER BY p.created_at DESC
  `;
  return rows;
}

export function getAdminByEmail(email: string) {
  if (isProd) return pgGetAdminByEmail(email);
  return (getSqlite().prepare("SELECT * FROM admins WHERE email = ?").get(email) as any) || null;
}

async function pgGetAdminByEmail(email: string) {
  const { rows } = await pgSql`SELECT * FROM admins WHERE email = ${email}`;
  return rows[0] || null;
}

export function getAllEmployers() {
  if (isProd) return pgGetAllEmployers();
  return getSqlite().prepare("SELECT * FROM employers ORDER BY created_at DESC").all();
}

async function pgGetAllEmployers() {
  const { rows } = await pgSql`SELECT * FROM employers ORDER BY created_at DESC`;
  return rows;
}

// ---- Formatters ----
function formatWorker(w: any) {
  return {
    id: w.id, name: w.name, photo_url: w.photo_url || null, category: w.category,
    experience_years: w.experience_years, expected_salary: w.expected_salary,
    skills: safeJson(w.skills), languages: safeJson(w.languages),
    live_in: !!w.live_in, location: w.location, available: !!w.available,
    description: w.description || "", has_contact_access: false, created_at: w.created_at,
  };
}

function formatWorkerFull(w: any) {
  return { ...w, skills: safeJson(w.skills), languages: safeJson(w.languages), live_in: !!w.live_in, available: !!w.available };
}

function safeJson(v: any): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
}
