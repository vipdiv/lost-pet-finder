import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { StatusStamp } from "@/components/StatusStamp";
import { TimeAgo } from "@/components/TimeAgo";
import { LawndaleGarden } from "@/components/LawndaleGarden";
import { AboutModal } from "@/components/AboutModal";
import { StewardBadge } from "@/components/StewardBadge";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latestSightings, reunionCount, regularCount] = await Promise.all([
    prisma.sighting.findMany({
      where: { hidden: false },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { pet: true },
    }),
    prisma.reunion.count(),
    prisma.pet.count({ where: { status: "REGULAR", hidden: false } }),
  ]);

  return (
    <div className="space-y-8 py-6">
      {/* Hero */}
      <section className="text-center py-8 md:py-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-park-green-dark mb-3">
          Lawndale Park Pet Registry
        </h1>
        <p className="text-park-sepia text-lg max-w-xl mx-auto mb-2">
          A neighborly board for sightings, missing pets, and familiar park
          regulars.
        </p>
        <p className="text-park-gold font-serif italic text-sm">
          Seen here. Safe here. Found faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/sightings/new" className="btn-primary text-lg px-8 py-4">
            Post a Sighting
          </Link>
          <Link href="/missing" className="btn-secondary text-lg px-8 py-4">
            View Missing Pets
          </Link>
        </div>
      </section>

      {/* Steward badge + About */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <StewardBadge />
        <div className="sm:ml-auto">
          <AboutModal />
        </div>
      </div>

      {/* Latest Sightings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold">Latest Sightings</h2>
          <Link
            href="/sightings"
            className="text-sm text-park-green hover:text-park-green-light transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestSightings.map((s) => (
            <Link
              key={s.id}
              href={s.petId ? `/pets/${s.petId}` : `/sightings`}
              className="card-frame overflow-hidden group"
            >
              <div className="aspect-[4/3] relative bg-park-paper">
                <Image
                  src={s.photoUrl}
                  alt={s.notes || "Pet sighting"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-2 left-2">
                  <StatusStamp
                    status={s.pet?.status || "SIGHTING"}
                  />
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs text-park-sepia mb-1">
                  <TimeAgo date={s.seenAt.toISOString()} />
                  {" · "}
                  {s.species.toLowerCase()}
                </div>
                <p className="text-sm text-park-brown font-medium truncate">
                  {s.locationText}
                </p>
                {s.waitMinutes && (
                  <p className="text-xs text-park-green mt-1">
                    Can wait {s.waitMinutes} min
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {latestSightings.length === 0 && (
          <div className="card-frame p-8 text-center text-park-sepia">
            <p>No sightings yet. Be the first to post one!</p>
          </div>
        )}
      </section>

      {/* Lawndale Garden */}
      <LawndaleGarden reunionCount={reunionCount} regularCount={regularCount} />
    </div>
  );
}
