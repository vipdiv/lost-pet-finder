"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useViewer } from "@/components/ViewerProvider";
import { PhotoUpload } from "@/components/PhotoUpload";
import { createSighting } from "@/app/actions";
import { MatchPanel } from "./MatchPanel";

export default function NewSightingPage() {
  const { viewerId } = useViewer();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    sightingId: string;
    species: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("viewerId", viewerId || "");

    const species = formData.get("species") as string;

    startTransition(async () => {
      const res = await createSighting(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.sightingId) {
        setResult({ sightingId: res.sightingId, species });
      }
    });
  };

  if (result) {
    return (
      <div className="py-6 max-w-lg mx-auto space-y-6">
        <div className="card-frame p-6 text-center">
          <div className="w-12 h-12 bg-park-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-park-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-park-green-dark mb-2">
            Sighting posted!
          </h2>
          <p className="text-sm text-park-sepia">
            Thank you for helping keep our neighborhood informed.
          </p>
        </div>

        <MatchPanel sightingId={result.sightingId} species={result.species} />

        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/sightings")} className="btn-primary">
            View Sightings
          </button>
          <button
            onClick={() => {
              setResult(null);
              setError(null);
            }}
            className="btn-secondary"
          >
            Post Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-lg mx-auto">
      <h1 className="font-serif text-3xl font-bold mb-2">Post a Sighting</h1>
      <p className="text-sm text-park-sepia mb-6">
        Spotted a dog or cat in the park? Share it with the neighborhood.
      </p>

      {/* Safety banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-sm text-amber-800">
        <strong>Safety reminder:</strong> Do not chase or corner animals. If
        aggressive or injured, call local animal services.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="form-label">Species *</label>
          <select name="species" required className="form-input">
            <option value="">Select...</option>
            <option value="DOG">Dog</option>
            <option value="CAT">Cat</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="form-label">Photo *</label>
          <PhotoUpload name="photo" required />
        </div>

        <div>
          <label className="form-label">Location *</label>
          <input
            type="text"
            name="locationText"
            required
            className="form-input"
            placeholder="e.g., Near the tennis courts by the big oak"
          />
          <p className="text-xs text-park-sepia mt-1">
            Use landmarks, not street addresses.
          </p>
        </div>

        <div>
          <label className="form-label">When did you see it?</label>
          <input
            type="datetime-local"
            name="seenAt"
            className="form-input"
            defaultValue={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div>
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="form-input"
            placeholder="Color, size, collar, behavior..."
          />
        </div>

        <div>
          <label className="form-label">Can you wait there?</label>
          <select name="waitMinutes" className="form-input">
            <option value="">No, just passing by</option>
            <option value="10">I can wait 10 min</option>
            <option value="20">I can wait 20 min</option>
            <option value="30">I can wait 30 min</option>
            <option value="45">I can wait 45 min</option>
          </select>
        </div>

        <button type="submit" disabled={isPending || !viewerId} className="btn-primary w-full">
          {isPending ? "Posting..." : "Post Sighting"}
        </button>
      </form>
    </div>
  );
}
