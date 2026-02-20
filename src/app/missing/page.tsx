import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusStamp } from "@/components/StatusStamp";
import { TimeAgo } from "@/components/TimeAgo";

export const dynamic = "force-dynamic";

export default async function MissingPage() {
  const pets = await prisma.pet.findMany({
    where: { status: "MISSING", hidden: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Missing Pets</h1>
        <Link href="/missing/new" className="btn-primary !py-2 !px-4 text-sm">
          Report Missing Pet
        </Link>
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
                alt={pet.name || "Missing pet"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-2 left-2">
                <StatusStamp status="MISSING" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg font-semibold">
                {pet.name || "Unnamed"}
              </h3>
              <p className="text-xs text-park-sepia mt-0.5">
                {pet.species.toLowerCase()} ·{" "}
                <TimeAgo date={pet.createdAt.toISOString()} />
              </p>
              {pet.description && (
                <p className="text-sm text-park-brown/80 mt-2 line-clamp-2">
                  {pet.description}
                </p>
              )}
              {pet.contactInfo && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-park-green font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact available
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="card-frame p-8 text-center text-park-sepia">
          <p>No missing pet reports right now. That&rsquo;s a good thing!</p>
        </div>
      )}
    </div>
  );
}
