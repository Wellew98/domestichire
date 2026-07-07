// Seed data for development
// Run: npx tsx src/lib/seed.ts

import { getDb, insertWorker, flushDb, insertEmployer } from "./db";
import { hashPassword } from "./auth";
import fs from "fs";
import path from "path";

const workers = [
  {
    name: "Precious Moyo", category: "maid", experience_years: 5, expected_salary: 250,
    skills: ["Cleaning", "Laundry", "Ironing", "Organization"],
    languages: ["English", "Shona"], live_in: 1, location: "Harare", available: 1,
    description: "Experienced maid with 5 years in household management. Reliable and hardworking.",
    phone: "+263****4560", whatsapp: "+263****4560", email: "precious@example.com",
  },
  {
    name: "Tendai Dube", category: "gardener", experience_years: 8, expected_salary: 200,
    skills: ["Landscaping", "Vegetable Garden", "Flower Care", "Tree Maintenance"],
    languages: ["Ndebele", "English"], live_in: 0, location: "Bulawayo", available: 1,
    description: "Professional gardener with expertise in landscaping and vegetable gardens.",
    phone: "+263****5671", whatsapp: "+263****5671", email: "tendai@example.com",
  },
  {
    name: "Chiedza Makoni", category: "nanny", experience_years: 4, expected_salary: 280,
    skills: ["Childcare", "Meal Prep", "Homework Help", "First Aid"],
    languages: ["English", "Shona"], live_in: 1, location: "Harare", available: 1,
    description: "Caring nanny with first aid certification. Loves working with children of all ages.",
    phone: "+263****6782", whatsapp: "+263****6782", email: "chiedza@example.com",
  },
  {
    name: "Farai Ncube", category: "driver", experience_years: 6, expected_salary: 350,
    skills: ["Defensive Driving", "Route Planning", "Vehicle Maintenance", "City Navigation"],
    languages: ["English", "Shona", "Ndebele"], live_in: 0, location: "Harare", available: 1,
    description: "Experienced driver with clean record. Familiar with all major routes in Zimbabwe.",
    phone: "+263****7893", whatsapp: "+263****7893", email: "farai@example.com",
  },
  {
    name: "Ruvimbo Chitando", category: "cook", experience_years: 10, expected_salary: 300,
    skills: ["Local Cuisine", "International Dishes", "Meal Planning", "Baking"],
    languages: ["English", "Shona"], live_in: 1, location: "Mutare", available: 1,
    description: "Talented cook with 10 years' experience. Specializes in Zimbabwean and international cuisine.",
    phone: "+263****8904", whatsapp: "+263****8904", email: "ruvimbo@example.com",
  },
  {
    name: "Simba Chirwa", category: "cleaner", experience_years: 3, expected_salary: 180,
    skills: ["Deep Cleaning", "Office Cleaning", "Window Cleaning", "Floor Care"],
    languages: ["English", "Shona"], live_in: 0, location: "Gweru", available: 1,
    description: "Thorough and detail-oriented cleaner. Experienced in both residential and office cleaning.",
    phone: "+263****9015", whatsapp: "+263****9015", email: "simba@example.com",
  },
  {
    name: "Nyasha Sibanda", category: "nurse_aide", experience_years: 7, expected_salary: 400,
    skills: ["Elderly Care", "Medication Management", "Patient Monitoring", "First Aid"],
    languages: ["English", "Shona", "Ndebele"], live_in: 1, location: "Harare", available: 1,
    description: "Certified nurse aide with 7 years in elderly and home care. Compassionate and professional.",
    phone: "+263****0126", whatsapp: "+263****0126", email: "nyasha@example.com",
  },
  {
    name: "Kudzai Moyo", category: "chef", experience_years: 12, expected_salary: 500,
    skills: ["Fine Dining", "Menu Creation", "Kitchen Management", "Food Safety"],
    languages: ["English", "Shona", "French"], live_in: 0, location: "Harare", available: 1,
    description: "Professional chef trained in fine dining. Can create custom menus for any occasion.",
    phone: "+263****1237", whatsapp: "+263****1237", email: "kudzai@example.com",
  },
  {
    name: "Tatenda Zhou", category: "laundry", experience_years: 2, expected_salary: 160,
    skills: ["Laundry", "Ironing", "Fabric Care", "Stain Removal"],
    languages: ["Shona", "English"], live_in: 0, location: "Chitungwiza", available: 1,
    description: "Efficient laundry helper with attention to fabric care and stain treatment.",
    phone: "+263****2348", whatsapp: "+263****2348", email: "tatenda@example.com",
  },
  {
    name: "Melody Hove", category: "maid", experience_years: 15, expected_salary: 320,
    skills: ["Cleaning", "Cooking", "Childcare", "Laundry", "Pet Care"],
    languages: ["English", "Shona", "Chewa"], live_in: 1, location: "Harare", available: 1,
    description: "All-round domestic helper with 15 years' experience. Can handle all household tasks.",
    phone: "+263****3459", whatsapp: "+263****3459", email: "melody@example.com",
  },
];

async function seed() {
  // Reset the data file
  const DB_PATH = path.join(process.cwd(), "data.json");
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

  for (const w of workers) {
    insertWorker(w);
  }
  console.log(`Seeded ${workers.length} workers`);

  // Add default admin
  const adminHash = await hashPassword("admin123");
  insertEmployer({ name: "Admin", email: "admin@domestichire.co.zw", password_hash: adminHash });
  console.log("Seeded admin user (admin@domestichire.co.zw / admin123)");
}

// Run if called directly
seed();
