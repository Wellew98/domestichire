import { NextRequest, NextResponse } from "next/server";
import { getAllWorkers } from "@/lib/db";

// GET /api/workers — list workers (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const location = searchParams.get("location") || undefined;
  const minExperience = searchParams.get("minExperience") ? parseInt(searchParams.get("minExperience")!) : undefined;
  const maxSalary = searchParams.get("maxSalary") ? parseInt(searchParams.get("maxSalary")!) : undefined;

  const workers = getAllWorkers({
    category,
    location,
    minExperience,
    maxSalary,
    available: true, // only show available workers via API
  });

  return NextResponse.json(workers);
}
