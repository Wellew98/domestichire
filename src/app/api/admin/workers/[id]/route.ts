import { NextRequest, NextResponse } from "next/server";
import { updateWorker } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await updateWorker(parseInt(id), {
      name: body.name,
      category: body.category,
      experience_years: body.experience_years || 0,
      expected_salary: body.expected_salary || 0,
      skills: body.skills || [],
      languages: body.languages || [],
      live_in: body.live_in || 0,
      available: body.available || 0,
      location: body.location || "",
      phone: body.phone || "",
      whatsapp: body.whatsapp || "",
      email: body.email || "",
      photo_url: body.photo_url || "",
      description: body.description || "",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
