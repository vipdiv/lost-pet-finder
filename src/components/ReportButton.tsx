"use client";

import { useState, useTransition } from "react";
import { useViewer } from "./ViewerProvider";
import { submitReport } from "@/app/actions";

interface ReportButtonProps {
  targetType: "PET" | "SIGHTING" | "COMMENT";
  targetId: string;
}

export function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const { viewerId } = useViewer();
  const [showForm, setShowForm] = useState(false);
  const [reported, setReported] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!viewerId) return;
    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    if (!reason.trim()) return;

    startTransition(async () => {
      const result = await submitReport(targetType, targetId, reason, viewerId);
      if (result.success) {
        setReported(true);
        setShowForm(false);
      }
    });
  };

  if (reported) {
    return (
      <span className="text-xs text-park-sepia italic">Report submitted</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="text-xs text-park-sepia/60 hover:text-park-red transition-colors"
      >
        Report
      </button>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="absolute right-0 top-6 z-10 bg-white border border-park-sepia/30 rounded-lg shadow-lg p-3 w-64"
        >
          <label className="form-label text-xs">Why are you reporting this?</label>
          <textarea
            name="reason"
            required
            rows={2}
            className="form-input text-sm mt-1"
            placeholder="Spam, incorrect info, etc."
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isPending}
              className="text-xs btn-primary !py-1.5 !px-3"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
