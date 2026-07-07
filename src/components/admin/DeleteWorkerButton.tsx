"use client";

interface Props {
  workerId: number;
}

export default function DeleteWorkerButton({ workerId }: Props) {
  return (
    <form
      action={async () => {
        const { deleteWorker } = await import("@/lib/db");
        const { redirect } = await import("next/navigation");
        await deleteWorker(workerId);
        redirect("/admin");
      }}
      onSubmit={(e) => {
        if (!confirm("Delete this worker?")) e.preventDefault();
      }}
      className="inline"
    >
      <button type="submit" className="text-red-600 hover:underline text-xs">
        Delete
      </button>
    </form>
  );
}
