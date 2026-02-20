"use client";

import { useState, useTransition } from "react";
import { useViewer } from "@/components/ViewerProvider";
import { confirmReunion } from "@/app/actions";

export function ReunionButton({ petId }: { petId: string }) {
  const { viewerId } = useViewer();
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!viewerId) return;
    startTransition(async () => {
      const res = await confirmReunion(petId, viewerId, note);
      if (res.success) setConfirmed(true);
    });
  };

  if (confirmed) {
    return (
      <div className="stamp-reunited">Reunited!</div>
    );
  }

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary !py-2 !px-4 text-sm !bg-park-green-light"
        >
          Confirm Reunion
        </button>
      ) : (
        <div className="card-frame p-4 mt-2">
          <p className="text-sm font-medium text-park-brown mb-2">
            Great news! Add a note (optional):
          </p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Snookie is home!"
            className="form-input text-sm mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={isPending || !viewerId}
              className="btn-primary !py-2 !px-4 text-sm"
            >
              {isPending ? "Confirming..." : "Confirm"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
