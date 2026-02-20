"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useViewer } from "@/components/ViewerProvider";
import { PhotoUpload } from "@/components/PhotoUpload";
import { createMissingPet } from "@/app/actions";

export default function NewMissingPetPage() {
  const { viewerId } = useViewer();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("viewerId", viewerId || "");

    startTransition(async () => {
      const res = await createMissingPet(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.petId) {
        router.push(`/pets/${res.petId}`);
      }
    });
  };

  return (
    <div className="py-6 max-w-lg mx-auto">
      <h1 className="font-serif text-3xl font-bold mb-2">Report a Missing Pet</h1>
      <p className="text-sm text-park-sepia mb-6">
        Let your neighbors know so they can help keep an eye out.
      </p>

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
          <label className="form-label">Pet name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="e.g., Buddy"
          />
        </div>

        <div>
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            required
            rows={3}
            className="form-input"
            placeholder="Color, size, breed, collar color, any distinguishing features..."
          />
        </div>

        <div>
          <label className="form-label">Contact info *</label>
          <input
            type="text"
            name="contactInfo"
            required
            className="form-input"
            placeholder="Phone number or email"
          />
          <p className="text-xs text-park-sepia mt-1">
            This will be visible to anyone viewing the listing.
          </p>
        </div>

        <button type="submit" disabled={isPending || !viewerId} className="btn-primary w-full">
          {isPending ? "Submitting..." : "Report Missing Pet"}
        </button>
      </form>
    </div>
  );
}
