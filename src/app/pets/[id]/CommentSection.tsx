"use client";

import { useState, useTransition } from "react";
import { useViewer } from "@/components/ViewerProvider";
import { createComment } from "@/app/actions";

export function CommentSection({ petId }: { petId: string }) {
  const { viewerId } = useViewer();
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewerId || !body.trim()) return;
    setSuccess(false);

    startTransition(async () => {
      const res = await createComment(petId, body, viewerId);
      if (res.success) {
        setBody("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a helpful comment..."
        rows={2}
        className="form-input text-sm"
      />
      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={isPending || !viewerId || !body.trim()}
          className="btn-primary !py-2 !px-4 text-sm"
        >
          {isPending ? "Posting..." : "Post Comment"}
        </button>
        {success && (
          <span className="text-xs text-park-green">Comment posted!</span>
        )}
      </div>
    </form>
  );
}
