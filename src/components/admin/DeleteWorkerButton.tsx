"use client";

import { deleteWorkerAction } from "@/app/admin/actions";

interface Props {
  workerId: number;
}

export default function DeleteWorkerButton({ workerId }: Props) {
  return (
    <form
      action={deleteWorkerAction.bind(null, workerId)}
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
