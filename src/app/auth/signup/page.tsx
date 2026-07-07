import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEmployerByEmail, insertEmployer } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export const metadata = { title: "Sign Up | DomesticHire" };

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h1>
      <p className="text-center text-gray-500 mb-8">Join DomesticHire to start hiring</p>
      <form action={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" required minLength={6} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors">Create Account</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

async function handleSignUp(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (getEmployerByEmail(email)) {
    redirect("/auth/signup?error=exists");
  }

  const passwordHash = await hashPassword(password);
  const employer = insertEmployer({ name, email, password_hash: passwordHash });

  const token = signToken({ id: employer.id, email, role: "employer" });
  const cookieStore = await cookies();
  cookieStore.set("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  redirect("/workers");
}
