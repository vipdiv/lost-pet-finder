"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useViewer } from "@/components/ViewerProvider";
import { linkSightingToPet } from "@/app/actions";

interface MissingPet {
  id: string;
  name: string | null;
  species: string;
  description: string | null;
  primaryPhotoUrl: string;
}

interface Props {
  sightingId: string;
  species: string;
}

export function MatchPanel({ sightingId, species }: Props) {
  const { viewerId } = useViewer();
  const [pets, setPets] = useState<MissingPet[]>([]);
  const [linked, setLinked] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch(`/api/missing-matches?species=${species}`)
      .then((r) => r.json())
      .then(setPets)
      .catch(() => {});
  }, [species]);

  if (pets.length === 0) return null;

  const handleLink = (petId: string) => {
    if (!viewerId) return;
    startTransition(async () => {
      const res = await linkSightingToPet(sightingId, petId, viewerId);
      if (res.success) setLinked(petId);
    });
  };

  return (
    <div className="card-frame p-4">
      <h3 className="font-serif text-lg font-semibold text-park-green-dark mb-3">
        Possible matches
      </h3>
      <p className="text-xs text-park-sepia mb-3">
        Does this sighting match any of these missing pets?
      </p>
      <div className="space-y-3">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-park-paper"
          >
            <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0 bg-park-paper">
              <Image
                src={pet.primaryPhotoUrl}
                alt={pet.name || "Missing pet"}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {pet.name || "Unnamed"}{" "}
                <span className="text-park-sepia font-normal">
                  ({pet.species.toLowerCase()})
                </span>
              </p>
              {pet.description && (
                <p className="text-xs text-park-sepia truncate">
                  {pet.description}
                </p>
              )}
            </div>
            {linked === pet.id ? (
              <span className="text-xs text-park-green font-medium">Linked!</span>
            ) : (
              <button
                onClick={() => handleLink(pet.id)}
                disabled={isPending || !!linked}
                className="text-xs btn-secondary !py-1 !px-2"
              >
                This one
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
