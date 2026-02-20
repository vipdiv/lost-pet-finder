import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusStamp } from "@/components/StatusStamp";
import { TimeAgo } from "@/components/TimeAgo";
import { VoteButton } from "@/components/VoteButton";
import { ShareButton } from "@/components/ShareButton";
import { ReportButton } from "@/components/ReportButton";
import { SightingsFilter } from "./SightingsFilter";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { species?: string; range?: string };
}

export default async function SightingsPage({ searchParams }: Props) {
  const { species, range } = searchParams;

  const where: Record<string, unknown> = { hidden: false };

  if (species && species !== "ALL") {
    where.species = species;
  }

  if (range) {
    const now = new Date();
    const hours: Record<string, number> = {
      "1h": 1,
      "6h": 6,
      "24h": 24,
      "7d": 168,
    };
    const h = hours[range];
    if (h) {
      where.seenAt = { gte: new Date(now.getTime() - h * 60 * 60 * 1000) };
    }
  }

  const sightings = await prisma.sighting.findMany({
    where,
    orderBy: { seenAt: "desc" },
    include: { pet: true },
  });

  // Get vote counts
  const sightingIds = sightings.map((s) => s.id);
  const voteCounts = await prisma.vote.groupBy({
    by: ["targetId"],
    where: { targetType: "SIGHTING", targetId: { in: sightingIds }, voteType: "UP" },
    _count: true,
  });
  const voteMap = Object.fromEntries(
    voteCounts.map((v) => [v.targetId, v._count])
  );

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Sightings</h1>
        <Link href="/sightings/new" className="btn-primary !py-2 !px-4 text-sm">
          Post Sighting
        </Link>
      </div>

      <SightingsFilter currentSpecies={species} currentRange={range} />

      <div className="space-y-4">
        {sightings.map((s) => (
          <div key={s.id} className="card-frame overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 sm:h-48 aspect-video sm:aspect-square relative bg-park-paper flex-shrink-0">
                <Image
                  src={s.photoUrl}
                  alt={s.notes || "Pet sighting"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
                <div className="absolute top-2 left-2">
                  <StatusStamp status={s.pet?.status || "SIGHTING"} />
                </div>
              </div>
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-park-brown">
                      {s.locationText}
                    </p>
                    <p className="text-xs text-park-sepia mt-0.5">
                      <TimeAgo date={s.seenAt.toISOString()} />
                      {" · "}
                      {s.species.toLowerCase()}
                      {s.pet?.name && ` · ${s.pet.name}`}
                    </p>
                  </div>
                </div>

                {s.notes && (
                  <p className="text-sm text-park-brown/80 mt-2">{s.notes}</p>
                )}

                {s.waitMinutes && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-park-green/10 text-park-green rounded text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Waiting {s.waitMinutes} min
                  </div>
                )}

                <div className="flex items-center gap-3 mt-3">
                  <VoteButton
                    targetType="SIGHTING"
                    targetId={s.id}
                    initialCount={voteMap[s.id] || 0}
                    authorViewerId={s.createdByViewerId}
                  />
                  <ShareButton path={s.petId ? `/pets/${s.petId}` : `/sightings`} />
                  {s.petId && (
                    <Link
                      href={`/pets/${s.petId}`}
                      className="text-xs text-park-green hover:underline"
                    >
                      View pet &rarr;
                    </Link>
                  )}
                  <div className="ml-auto">
                    <ReportButton targetType="SIGHTING" targetId={s.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sightings.length === 0 && (
          <div className="card-frame p-8 text-center text-park-sepia">
            <p>No sightings match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
