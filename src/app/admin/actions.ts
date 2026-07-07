"use server";

import { deleteWorker } from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteWorkerAction(workerId: number) {
  await deleteWorker(workerId);
  redirect("/admin");
}
