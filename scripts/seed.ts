import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(__dirname, "..", "marketplace.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, photo_url TEXT DEFAULT '', category TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0, expected_salary REAL NOT NULL DEFAULT 0,
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
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (employer_id) REFERENCES employers(id),
    FOREIGN KEY (worker_id) REFERENCES workers(id)
  );
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Clear existing
db.exec("DELETE FROM workers; DELETE FROM payments; DELETE FROM employers; DELETE FROM admins;");

const workers = [
  { name:"Precious Moyo", category:"maid", experience_years:5, expected_salary:250, skills:JSON.stringify(["Cleaning","Laundry","Ironing","Organization"]), languages:JSON.stringify(["English","Shona"]), live_in:1, location:"Harare", available:1, description:"Experienced maid with 5 years in household management.", phone:"+263771234560", whatsapp:"+263771234560", email:"precious@example.com" },
  { name:"Tendai Dube", category:"gardener", experience_years:8, expected_salary:200, skills:JSON.stringify(["Landscaping","Vegetable Garden","Flower Care","Tree Maintenance"]), languages:JSON.stringify(["Ndebele","English"]), live_in:0, location:"Bulawayo", available:1, description:"Professional gardener with expertise in landscaping.", phone:"+263772345671", whatsapp:"+263772345671", email:"tendai@example.com" },
  { name:"Chiedza Makoni", category:"nanny", experience_years:4, expected_salary:280, skills:JSON.stringify(["Childcare","Meal Prep","Homework Help","First Aid"]), languages:JSON.stringify(["English","Shona"]), live_in:1, location:"Harare", available:1, description:"Caring nanny with first aid certification.", phone:"+263773456782", whatsapp:"+263773456782", email:"chiedza@example.com" },
  { name:"Farai Ncube", category:"driver", experience_years:6, expected_salary:350, skills:JSON.stringify(["Defensive Driving","Route Planning","Vehicle Maintenance"]), languages:JSON.stringify(["English","Shona","Ndebele"]), live_in:0, location:"Harare", available:1, description:"Experienced driver with clean record.", phone:"+263774567893", whatsapp:"+263774567893", email:"farai@example.com" },
  { name:"Ruvimbo Chitando", category:"cook", experience_years:10, expected_salary:300, skills:JSON.stringify(["Local Cuisine","International Dishes","Meal Planning","Baking"]), languages:JSON.stringify(["English","Shona"]), live_in:1, location:"Mutare", available:1, description:"Talented cook with 10 years' experience.", phone:"+263775678904", whatsapp:"+263775678904", email:"ruvimbo@example.com" },
  { name:"Simba Chirwa", category:"cleaner", experience_years:3, expected_salary:180, skills:JSON.stringify(["Deep Cleaning","Office Cleaning","Window Cleaning"]), languages:JSON.stringify(["English","Shona"]), live_in:0, location:"Gweru", available:1, description:"Thorough and detail-oriented cleaner.", phone:"+263776789015", whatsapp:"+263776789015", email:"simba@example.com" },
  { name:"Nyasha Sibanda", category:"nurse_aide", experience_years:7, expected_salary:400, skills:JSON.stringify(["Elderly Care","Medication Management","First Aid"]), languages:JSON.stringify(["English","Shona","Ndebele"]), live_in:1, location:"Harare", available:1, description:"Certified nurse aide with 7 years in elderly care.", phone:"+263777890126", whatsapp:"+263777890126", email:"nyasha@example.com" },
  { name:"Kudzai Moyo", category:"chef", experience_years:12, expected_salary:500, skills:JSON.stringify(["Fine Dining","Menu Creation","Kitchen Management"]), languages:JSON.stringify(["English","Shona","French"]), live_in:0, location:"Harare", available:1, description:"Professional chef trained in fine dining.", phone:"+263778901237", whatsapp:"+263778901237", email:"kudzai@example.com" },
  { name:"Tatenda Zhou", category:"laundry", experience_years:2, expected_salary:160, skills:JSON.stringify(["Laundry","Ironing","Fabric Care"]), languages:JSON.stringify(["Shona","English"]), live_in:0, location:"Chitungwiza", available:1, description:"Efficient laundry helper.", phone:"+263779012348", whatsapp:"+263779012348", email:"tatenda@example.com" },
  { name:"Melody Hove", category:"maid", experience_years:15, expected_salary:320, skills:JSON.stringify(["Cleaning","Cooking","Childcare","Laundry","Pet Care"]), languages:JSON.stringify(["English","Shona","Chewa"]), live_in:1, location:"Harare", available:1, description:"All-round domestic helper with 15 years' experience.", phone:"+263780123459", whatsapp:"+263780123459", email:"melody@example.com" },
];

const stmt = db.prepare(`INSERT INTO workers (name, category, experience_years, expected_salary, skills, languages, live_in, location, available, description, phone, whatsapp, email) VALUES (@name, @category, @experience_years, @expected_salary, @skills, @languages, @live_in, @location, @available, @description, @phone, @whatsapp, @email)`);
const insertAll = db.transaction(() => { for (const w of workers) stmt.run(w); });
insertAll();

// Seed admin
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.pbkdf2Sync("admin123", salt, 100000, 64, "sha512").toString("hex");
db.prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)").run("admin@domestichire.co.zw", `${salt}:${hash}`);

console.log(`Seeded ${workers.length} workers + 1 admin`);
db.close();
