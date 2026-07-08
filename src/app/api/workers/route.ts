import { NextRequest, NextResponse } from "next/server";
import { getAllWorkers, countWorkers } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1") || 1;
  const limit = 20;

  const filters: any = {
    category: searchParams.get("category") || undefined,
    location: searchParams.get("location") || undefined,
    page,
    limit,
  };

  const [workers, total] = await Promise.all([
    getAllWorkers(filters),
    countWorkers({ category: filters.category, location: filters.location }),
  ]);

  return NextResponse.json({
    workers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
