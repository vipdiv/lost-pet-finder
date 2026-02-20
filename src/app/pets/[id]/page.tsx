import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StatusStamp } from "@/components/StatusStamp";
import { TimeAgo } from "@/components/TimeAgo";
import { VoteButton } from "@/components/VoteButton";
import { ReportButton } from "@/components/ReportButton";
import { CommentSection } from "./CommentSection";
import { ReunionButton } from "./ReunionButton";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function PetDetailPage({ params }: Props) {
  const pet = await prisma.pet.findUnique({
    where: { id: params.id },
    include: {
      sightings: {
        where: { hidden: false },
        orderBy: { seenAt: "desc" },
      },
      comments: {
        where: { hidden: false },
        orderBy: { createdAt: "asc" },
      },
      reunion: true,
    },
  });

  if (!pet || pet.hidden) notFound();

  // Get vote counts for sightings and comments
  const sightingIds = pet.sightings.map((s) => s.id);
  const commentIds = pet.comments.map((c) => c.id);

  const [sightingVotes, commentVotes] = await Promise.all([
    prisma.vote.groupBy({
      by: ["targetId"],
      where: {
        targetType: "SIGHTING",
        targetId: { in: sightingIds },
        voteType: "UP",
      },
      _count: true,
    }),
    prisma.vote.groupBy({
      by: ["targetId"],
      where: {
        targetType: "COMMENT",
        targetId: { in: commentIds },
        voteType: "UP",
      },
      _count: true,
    }),
  ]);

  const sVoteMap = Object.fromEntries(
    sightingVotes.map((v) => [v.targetId, v._count])
  );
  const cVoteMap = Object.fromEntries(
    commentVotes.map((v) => [v.targetId, v._count])
  );

  const displayStatus = pet.reunion ? "REUNITED" : pet.status;

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      {/* Pet header */}
      <div className="card-frame overflow-hidden">
        <div className="aspect-video md:aspect-[3/1] relative bg-park-paper">
          <Image
            src={pet.primaryPhotoUrl}
            alt={pet.name || "Pet"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute top-3 left-3">
            <StatusStamp status={displayStatus} />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                {pet.name || "Unnamed"}
              </h1>
              <p className="text-sm text-park-sepia mt-1">
                {pet.species.toLowerCase()} · {pet.neighborhood}
              </p>
            </div>
            <ReportButton targetType="PET" targetId={pet.id} />
          </div>

          {pet.description && (
            <p className="text-sm text-park-brown mt-3">{pet.description}</p>
          )}

          {pet.contactInfo && pet.status === "MISSING" && !pet.reunion && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm font-medium text-amber-800">
                Contact: {pet.contactInfo}
              </p>
            </div>
          )}

          {pet.reunion && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="font-serif text-lg font-bold text-park-green">
                Reunited!
              </p>
              {pet.reunion.note && (
                <p className="text-sm text-park-brown mt-1">{pet.reunion.note}</p>
              )}
              <p className="text-xs text-park-sepia mt-2">
                Confirmed <TimeAgo date={pet.reunion.confirmedAt.toISOString()} />
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            {pet.status === "MISSING" && !pet.reunion && (
              <ReunionButton petId={pet.id} />
            )}
            <Link
              href={`/sightings/new`}
              className="btn-secondary !py-2 !px-4 text-sm"
            >
              Add a Sighting
            </Link>
          </div>
        </div>
      </div>

      {/* Sightings */}
      <section>
        <h2 className="font-serif text-xl font-bold mb-3">
          Sightings ({pet.sightings.length})
        </h2>
        <div className="space-y-3">
          {pet.sightings.map((s) => (
            <div key={s.id} className="card-frame p-4">
              <div className="flex gap-3">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-park-paper">
                  <Image
                    src={s.photoUrl}
                    alt="Sighting"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.locationText}</p>
                  <p className="text-xs text-park-sepia mt-0.5">
                    <TimeAgo date={s.seenAt.toISOString()} />
                  </p>
                  {s.notes && (
                    <p className="text-sm text-park-brown/80 mt-1">{s.notes}</p>
                  )}
                  {s.waitMinutes && (
                    <p className="text-xs text-park-green mt-1">
                      Waiting {s.waitMinutes} min
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <VoteButton
                      targetType="SIGHTING"
                      targetId={s.id}
                      initialCount={sVoteMap[s.id] || 0}
                      authorViewerId={s.createdByViewerId}
                    />
                    <ReportButton targetType="SIGHTING" targetId={s.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {pet.sightings.length === 0 && (
            <p className="text-sm text-park-sepia italic">
              No sightings linked to this pet yet.
            </p>
          )}
        </div>
      </section>

      {/* Comments */}
      <section>
        <h2 className="font-serif text-xl font-bold mb-3">
          Comments ({pet.comments.length})
        </h2>
        <div className="space-y-3">
          {pet.comments.map((c) => (
            <div key={c.id} className="card-frame p-4">
              <p className="text-sm text-park-brown">{c.body}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-park-sepia">
                  <TimeAgo date={c.createdAt.toISOString()} />
                </span>
                <VoteButton
                  targetType="COMMENT"
                  targetId={c.id}
                  initialCount={cVoteMap[c.id] || 0}
                  authorViewerId={c.createdByViewerId}
                />
                <div className="ml-auto">
                  <ReportButton targetType="COMMENT" targetId={c.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <CommentSection petId={pet.id} />
      </section>
    </div>
  );
}
