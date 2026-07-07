import { NextResponse } from "next/server";
import { randomBytes, pbkdf2Sync } from "crypto";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    // Create tables if needed
    await sql`CREATE TABLE IF NOT EXISTS workers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, photo_url TEXT DEFAULT '', category TEXT NOT NULL, experience_years INTEGER DEFAULT 0, expected_salary REAL DEFAULT 0, skills JSONB DEFAULT '[]', languages JSONB DEFAULT '[]', live_in BOOLEAN DEFAULT false, location TEXT DEFAULT '', available BOOLEAN DEFAULT true, description TEXT DEFAULT '', phone TEXT DEFAULT '', whatsapp TEXT DEFAULT '', email TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS employers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS payments (id SERIAL PRIMARY KEY, employer_id INTEGER NOT NULL, worker_id INTEGER NOT NULL, amount REAL NOT NULL, currency TEXT DEFAULT 'USD', status TEXT DEFAULT 'pending', payment_ref TEXT UNIQUE, paystack_ref TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS admins (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`;

    // Check if already seeded
    const { rows } = await sql`SELECT COUNT(*) as c FROM workers`;
    if (parseInt(rows[0].c) > 0) {
      return NextResponse.json({ message: "Already seeded", workers: parseInt(rows[0].c) });
    }

    // Seed workers
    const workers = [
      ["Precious Moyo","maid",5,250,'["Cleaning","Laundry","Ironing","Organization"]','["English","Shona"]',true,"Harare",true,"Experienced maid with 5 years.","+263771234560","+263771234560","precious@example.com"],
      ["Tendai Dube","gardener",8,200,'["Landscaping","Vegetable Garden","Flower Care"]','["Ndebele","English"]',false,"Bulawayo",true,"Professional gardener.","+263772345671","+263772345671","tendai@example.com"],
      ["Chiedza Makoni","nanny",4,280,'["Childcare","Meal Prep","Homework Help","First Aid"]','["English","Shona"]',true,"Harare",true,"Caring nanny with first aid.","+263773456782","+263773456782","chiedza@example.com"],
      ["Farai Ncube","driver",6,350,'["Defensive Driving","Route Planning","Vehicle Maintenance"]','["English","Shona","Ndebele"]',false,"Harare",true,"Experienced driver.","+263774567893","+263774567893","farai@example.com"],
      ["Ruvimbo Chitando","cook",10,300,'["Local Cuisine","International","Meal Planning"]','["English","Shona"]',true,"Mutare",true,"Talented cook with 10 years.","+263775678904","+263775678904","ruvimbo@example.com"],
      ["Simba Chirwa","cleaner",3,180,'["Deep Cleaning","Office Cleaning"]','["English","Shona"]',false,"Gweru",true,"Detail-oriented cleaner.","+263776789015","+263776789015","simba@example.com"],
      ["Nyasha Sibanda","nurse_aide",7,400,'["Elderly Care","Medication","First Aid"]','["English","Shona","Ndebele"]',true,"Harare",true,"Certified nurse aide.","+263777890126","+263777890126","nyasha@example.com"],
      ["Kudzai Moyo","chef",12,500,'["Fine Dining","Menu Creation","Kitchen Management"]','["English","Shona","French"]',false,"Harare",true,"Professional chef.","+263778901237","+263778901237","kudzai@example.com"],
      ["Tatenda Zhou","laundry",2,160,'["Laundry","Ironing","Fabric Care"]','["Shona","English"]',false,"Chitungwiza",true,"Efficient laundry helper.","+263779012348","+263779012348","tatenda@example.com"],
      ["Melody Hove","maid",15,320,'["Cleaning","Cooking","Childcare","Laundry"]','["English","Shona","Chewa"]',true,"Harare",true,"All-round helper, 15 years.","+263780123459","+263780123459","melody@example.com"],
    ];

    for (const w of workers) {
      await sql`INSERT INTO workers (name,category,experience_years,expected_salary,skills,languages,live_in,location,available,description,phone,whatsapp,email) VALUES (${w[0]},${w[1]},${w[2]},${w[3]},${w[4]}::jsonb,${w[5]}::jsonb,${w[6]},${w[7]},${w[8]},${w[9]},${w[10]},${w[11]},${w[12]})`;
    }

    // Seed admin
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync("admin123", salt, 100000, 64, "sha512").toString("hex");
    await sql`INSERT INTO admins (email, password_hash) VALUES ('admin@domestichire.co.zw', ${salt + ':' + hash}) ON CONFLICT (email) DO NOTHING`;

    return NextResponse.json({ message: "Seeded 10 workers + admin", workers: 10 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
