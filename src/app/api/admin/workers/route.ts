import { NextRequest, NextResponse } from "next/server";
import { insertWorker } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Name and category required" }, { status: 400 });
    }

    await insertWorker({
      name: body.name,
      category: body.category,
      experience_years: body.experience_years || 0,
      expected_salary: body.expected_salary || 0,
      skills: body.skills || [],
      languages: body.languages || [],
      live_in: body.live_in || 0,
      location: body.location || "",
      phone: body.phone || "",
      whatsapp: body.whatsapp || body.phone || "",
      email: body.email || "",
      photo_url: body.photo_url || "",
      description: body.description || "",
      available: body.available !== undefined ? body.available : 1,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
