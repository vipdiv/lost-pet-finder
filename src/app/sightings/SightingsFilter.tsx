"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentSpecies?: string;
  currentRange?: string;
}

export function SightingsFilter({ currentSpecies, currentRange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/sightings?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <label className="form-label text-xs">Species</label>
        <select
          value={currentSpecies || "ALL"}
          onChange={(e) => update("species", e.target.value)}
          className="form-input !py-1.5 !px-3 text-sm"
        >
          <option value="ALL">All</option>
          <option value="DOG">Dogs</option>
          <option value="CAT">Cats</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <label className="form-label text-xs">Time range</label>
        <select
          value={currentRange || ""}
          onChange={(e) => update("range", e.target.value)}
          className="form-input !py-1.5 !px-3 text-sm"
        >
          <option value="">All time</option>
          <option value="1h">Last hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>
    </div>
  );
}
