import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 0, path: "/" });
  redirect("/");
}
