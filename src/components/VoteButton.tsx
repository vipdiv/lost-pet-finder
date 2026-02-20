"use client";

import { useState, useTransition } from "react";
import { useViewer } from "./ViewerProvider";
import { castVote } from "@/app/actions";

interface VoteButtonProps {
  targetType: "SIGHTING" | "COMMENT";
  targetId: string;
  initialCount: number;
  authorViewerId: string;
}

export function VoteButton({
  targetType,
  targetId,
  initialCount,
  authorViewerId,
}: VoteButtonProps) {
  const { viewerId } = useViewer();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleVote = () => {
    if (!viewerId || voted || viewerId === authorViewerId) return;
    startTransition(async () => {
      const result = await castVote(targetType, targetId, viewerId, authorViewerId);
      if (result.success) {
        setCount((c) => c + 1);
        setVoted(true);
      }
    });
  };

  return (
    <button
      onClick={handleVote}
      disabled={isPending || voted || !viewerId || viewerId === authorViewerId}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
        voted
          ? "bg-park-green/10 text-park-green"
          : "bg-park-paper text-park-sepia hover:bg-park-green/10 hover:text-park-green"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <svg className="w-4 h-4" fill={voted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
