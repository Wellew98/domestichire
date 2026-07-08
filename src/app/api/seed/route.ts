import { NextResponse, NextRequest } from "next/server";
import { randomBytes, pbkdf2Sync } from "crypto";
import { sql } from "@vercel/postgres";

const FIRST_NAMES = ["Precious","Tendai","Chiedza","Farai","Ruvimbo","Simba","Nyasha","Kudzai","Tatenda","Melody","Tafadzwa","Rudo","Tanaka","Blessing","Gift","Walter","Patience","Faith","Hope","Charity","Loveness","Shingai","Anesu","Kuda","Tsitsi"];
const LAST_NAMES = ["Moyo","Dube","Makoni","Ncube","Chitando","Chirwa","Sibanda","Zhou","Hove","Ndlovu","Mlambo","Sithole","Gumbo","Banda","Phiri","Tshuma","Nyathi","Khumalo","Mpofu","Nkomo"];
const CATEGORIES = ["maid","nanny","driver","gardener","cleaner","cook","chef","nurse_aide","laundry"];
const LOCATIONS = ["Harare","Bulawayo","Mutare","Gweru","Kwekwe","Chitungwiza","Masvingo","Marondera","Kadoma","Chinhoyi"];
const LANGUAGES = ["English","Shona","Ndebele","Chewa"];
const SKILL_POOLS: Record<string, string[]> = {
  maid: ["Cleaning","Laundry","Ironing","Organization","Pet Care","Deep Cleaning"],
  nanny: ["Childcare","Meal Prep","Homework Help","First Aid","Storytelling"],
  driver: ["Defensive Driving","Route Planning","Vehicle Maintenance","City Navigation"],
  gardener: ["Landscaping","Vegetable Garden","Flower Care","Tree Maintenance","Lawn Care"],
  cleaner: ["Deep Cleaning","Office Cleaning","Window Cleaning","Floor Care","Sanitization"],
  cook: ["Local Cuisine","Meal Planning","Baking","Food Safety","Budget Cooking"],
  chef: ["Fine Dining","Menu Creation","Kitchen Management","Food Safety","Pastry"],
  nurse_aide: ["Elderly Care","Medication","First Aid","Patient Monitoring","Physiotherapy"],
  laundry: ["Laundry","Ironing","Fabric Care","Stain Removal","Folding"],
};

function rand(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateWorker(i: number) {
  const name = `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`;
  const category = rand(CATEGORIES);
  const skills = SKILL_POOLS[category].slice(0, randInt(2, 4));
  const langs = [rand(LANGUAGES), rand(LANGUAGES)].filter((v, i, a) => a.indexOf(v) === i);
  const location = rand(LOCATIONS);
  const exp = randInt(1, 15);
  const salary = randInt(150, 500);
  const liveIn = Math.random() > 0.5;
  const phone = `+26377${randInt(1000000, 9999999)}`;

  return [
    name, category, exp, salary,
    JSON.stringify(skills), JSON.stringify(langs),
    liveIn, location, true,
    `Experienced ${category} with ${exp} years in ${location}.`, phone, phone, `${name.split(" ")[0].toLowerCase()}@example.com`
  ];
}

export async function GET(request: NextRequest) {
  try {
    const count = parseInt(request.nextUrl.searchParams.get("count") || "200");
    const force = request.nextUrl.searchParams.get("force") === "1";

    await sql`CREATE TABLE IF NOT EXISTS workers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, photo_url TEXT DEFAULT '', category TEXT NOT NULL, experience_years INTEGER DEFAULT 0, expected_salary REAL DEFAULT 0, skills JSONB DEFAULT '[]', languages JSONB DEFAULT '[]', live_in BOOLEAN DEFAULT false, location TEXT DEFAULT '', available BOOLEAN DEFAULT true, description TEXT DEFAULT '', phone TEXT DEFAULT '', whatsapp TEXT DEFAULT '', email TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS employers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS payments (id SERIAL PRIMARY KEY, employer_id INTEGER NOT NULL, worker_id INTEGER NOT NULL, amount REAL NOT NULL, currency TEXT DEFAULT 'USD', status TEXT DEFAULT 'pending', payment_ref TEXT UNIQUE, paystack_ref TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS admins (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`;

    // Clear for fresh seed
    await sql`DELETE FROM payments`;
    await sql`DELETE FROM employers`;
    await sql`DELETE FROM workers`;
    await sql`DELETE FROM admins`;

    const workers = Array.from({ length: count }, (_, i) => generateWorker(i));

    for (const w of workers) {
      await sql`INSERT INTO workers (name,category,experience_years,expected_salary,skills,languages,live_in,location,available,description,phone,whatsapp,email) VALUES (${w[0]},${w[1]},${w[2]},${w[3]},${w[4]}::jsonb,${w[5]}::jsonb,${w[6]},${w[7]},${w[8]},${w[9]},${w[10]},${w[11]},${w[12]})`;
    }

    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync("admin123", salt, 100000, 64, "sha512").toString("hex");
    await sql`INSERT INTO admins (email, password_hash) VALUES ('admin@domestichire.co.zw', ${salt + ':' + hash})`;

    return NextResponse.json({ message: `Seeded ${count} workers + admin`, workers: count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
