// Worker profile type
export interface Worker {
  id: number;
  name: string;
  photo_url: string | null;
  category: string; // maid, nanny, driver, gardener, cleaner, cook, chef, nurse_aide
  experience_years: number;
  expected_salary: number;
  skills: string[]; // stored as JSON in SQLite
  languages: string[];
  live_in: boolean;
  location: string;
  available: boolean;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Public-facing worker (contact info hidden)
export interface PublicWorker {
  id: number;
  name: string;
  photo_url: string | null;
  category: string;
  experience_years: number;
  expected_salary: number;
  skills: string[];
  languages: string[];
  live_in: boolean;
  location: string;
  available: boolean;
  description: string;
  has_contact_access: boolean; // true only if employer has paid
  created_at: string;
}

// Employer account
export interface Employer {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

// Payment record
export interface Payment {
  id: number;
  employer_id: number;
  worker_id: number;
  amount: number; // placement fee
  currency: string;
  status: "pending" | "completed" | "failed";
  payment_ref: string;
  created_at: string;
}

// Admin user
export interface Admin {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}
