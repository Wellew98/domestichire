import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEmployerByEmail, getAdminByEmail } from "@/lib/db";
import { hashPassword, comparePassword, signToken } from "@/lib/auth";

export const metadata = { title: "Sign In | DomesticHire" };

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Sign In</h1>
      <p className="text-center text-gray-500 mb-8">Welcome back to DomesticHire</p>
      <form action={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" required className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors">Sign In</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account? <Link href="/auth/signup" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}

async function handleLogin(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check employers first
  const employer = await getEmployerByEmail(email);
  if (employer) {
    const valid = await comparePassword(password, employer.password_hash);
    if (valid) {
      const token = signToken({ id: employer.id, email: employer.email, role: "employer" });
      const cookieStore = await cookies();
      cookieStore.set("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
      redirect("/workers");
    }
  }

  // Check admins
  const admin = await getAdminByEmail(email);
  if (admin) {
    const valid = await comparePassword(password, admin.password_hash);
    if (valid) {
      const token = signToken({ id: admin.id, email: admin.email, role: "admin" });
      const cookieStore = await cookies();
      cookieStore.set("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
      redirect("/admin");
    }
  }

  redirect("/auth/login?error=invalid");
}
