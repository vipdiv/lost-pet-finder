"use client";

import { useEffect, useState } from "react";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export function TimeAgo({ date }: { date: string | Date }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    setText(formatTimeAgo(d));
    const interval = setInterval(() => setText(formatTimeAgo(d)), 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span>{text}</span>;
}
