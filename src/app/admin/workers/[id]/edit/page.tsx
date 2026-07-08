import { getWorkerById } from "@/lib/db";
import { notFound } from "next/navigation";
import EditWorkerForm from "./EditWorkerForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditWorkerPage({ params }: Props) {
  const { id } = await params;
  const worker = await getWorkerById(parseInt(id));
  if (!worker) notFound();

  return <EditWorkerForm worker={worker} />;
}
