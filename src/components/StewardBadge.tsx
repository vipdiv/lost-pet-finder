"use client";

import { useEffect, useState } from "react";
import { useViewer } from "./ViewerProvider";

const LEVEL_LABELS: Record<string, string> = {
  VISITOR: "Visitor",
  NEIGHBOR: "Neighbor",
  PARK_WATCHER: "Park Watcher",
  STEWARD: "Steward",
  BRIDGE_GUARDIAN: "Bridge Guardian",
};

const LEVEL_ICONS: Record<string, string> = {
  VISITOR: "seedling",
  NEIGHBOR: "leaf",
  PARK_WATCHER: "tree",
  STEWARD: "shield",
  BRIDGE_GUARDIAN: "bridge",
};

export function StewardBadge() {
  const { viewerId } = useViewer();
  const [profile, setProfile] = useState<{
    stewardLevel: string;
    points: number;
  } | null>(null);

  useEffect(() => {
    if (!viewerId) return;
    fetch(`/api/viewer/${viewerId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile)
      .catch(() => {});
  }, [viewerId]);

  if (!profile || profile.points === 0) return null;

  const level = profile.stewardLevel || "VISITOR";

  return (
    <div className="card-frame p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-park-green/10 flex items-center justify-center">
        <LevelIcon level={level} />
      </div>
      <div>
        <div className="text-xs text-park-sepia">Your Park Level</div>
        <div className="font-serif font-semibold text-park-green text-sm">
          {LEVEL_LABELS[level] || level}
        </div>
        <div className="text-xs text-park-sepia">{profile.points} pts</div>
      </div>
    </div>
  );
}

function LevelIcon({ level }: { level: string }) {
  const icon = LEVEL_ICONS[level] || "seedling";

  switch (icon) {
    case "leaf":
      return (
        <svg className="w-5 h-5 text-park-green" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
      );
    case "tree":
      return (
        <svg className="w-5 h-5 text-park-green" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L8 8h2l-4 6h3l-5 8h6v-4h2v4h6l-5-8h3l-4-6h2z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-5 h-5 text-park-green" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      );
    case "bridge":
      return (
        <svg className="w-5 h-5 text-park-gold" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 21h2v-4c0-1.38.56-2.63 1.46-3.54L12 12l1.54 1.46C14.44 14.37 15 15.62 15 17v4h2v-4c0-2.21-1.14-4.15-2.86-5.28L12 10l-2.14 1.72C8.14 12.85 7 14.79 7 17v4zM3 21h2V9l5-4 5 4v12h2V8l-7-6-7 6v13z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-park-green" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5z" />
        </svg>
      );
  }
}
