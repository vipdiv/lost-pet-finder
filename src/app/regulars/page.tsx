import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusStamp } from "@/components/StatusStamp";

export const dynamic = "force-dynamic";

export default async function RegularsPage() {
  const pets = await prisma.pet.findMany({
    where: { status: "REGULAR", hidden: false },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { sightings: true } },
    },
  });

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Park Regulars</h1>
        <p className="text-sm text-park-sepia mt-2 max-w-2xl">
          Some pets are familiar faces in the park. Recognizing them here helps
          people avoid panic while still sharing updates. If you see one of these
          regulars, no need to worry — they&rsquo;re known neighbors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <Link
            key={pet.id}
            href={`/pets/${pet.id}`}
            className="card-frame overflow-hidden group"
          >
            <div className="aspect-[4/3] relative bg-park-paper">
              <Image
                src={pet.primaryPhotoUrl}
                alt={pet.name || "Park regular"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2">
                <StatusStamp status="REGULAR" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg font-semibold">
                {pet.name || "Unnamed Regular"}
              </h3>
              <p className="text-xs text-park-sepia mt-0.5">
                {pet.species.toLowerCase()} · {pet._count.sightings} sighting
                {pet._count.sightings !== 1 ? "s" : ""}
              </p>
              {pet.description && (
                <p className="text-sm text-park-brown/80 mt-2 line-clamp-2">
                  {pet.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="card-frame p-8 text-center text-park-sepia">
          <p>No regulars documented yet.</p>
        </div>
      )}
    </div>
  );
}
