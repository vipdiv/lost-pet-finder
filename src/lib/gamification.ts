import { prisma } from "./db";

const POINT_VALUES: Record<string, number> = {
  POST_SIGHTING: 2,
  POST_COMMENT: 1,
  UPVOTE_HELPFUL: 2,
  LINK_SIGHTING_TO_MISSING: 5,
  CONFIRMED_REUNION: 10,
  REPORT_SPAM_OR_ABUSE: 2,
};

const STEWARD_LEVELS: { min: number; level: string }[] = [
  { min: 150, level: "BRIDGE_GUARDIAN" },
  { min: 70, level: "STEWARD" },
  { min: 30, level: "PARK_WATCHER" },
  { min: 10, level: "NEIGHBOR" },
  { min: 0, level: "VISITOR" },
];

export function getStewardLevel(points: number): string {
  return STEWARD_LEVELS.find((l) => points >= l.min)?.level || "VISITOR";
}

export async function awardPoints(
  viewerId: string,
  type: string,
  customPoints?: number
): Promise<void> {
  const points = customPoints ?? POINT_VALUES[type] ?? 0;
  if (points === 0) return;

  await prisma.gamificationEvent.create({
    data: { viewerId, type, points },
  });

  const profile = await prisma.viewerProfile.upsert({
    where: { viewerId },
    update: { points: { increment: points } },
    create: { viewerId, points },
  });

  const newLevel = getStewardLevel(profile.points);
  if (newLevel !== profile.stewardLevel) {
    await prisma.viewerProfile.update({
      where: { viewerId },
      data: { stewardLevel: newLevel },
    });
  }
}

export async function awardReunionPoints(
  petId: string,
  confirmerViewerId: string
): Promise<void> {
  // Award confirmer
  await awardPoints(confirmerViewerId, "CONFIRMED_REUNION", 10);

  // Award contributors (first 5 unique viewers who contributed sightings/comments)
  const sightings = await prisma.sighting.findMany({
    where: { petId },
    select: { createdByViewerId: true },
  });
  const comments = await prisma.comment.findMany({
    where: { petId },
    select: { createdByViewerId: true },
  });

  const contributorSet = new Set<string>();
  [...sightings, ...comments].forEach((s) => {
    if (s.createdByViewerId !== confirmerViewerId) {
      contributorSet.add(s.createdByViewerId);
    }
  });

  const contributors = Array.from(contributorSet).slice(0, 5);
  for (const cid of contributors) {
    await awardPoints(cid, "CONFIRMED_REUNION", 5);
  }
}

export async function checkAndAwardBadges(
  viewerId: string
): Promise<string[]> {
  const awarded: string[] = [];

  const existingBadges = await prisma.badge.findMany({
    where: { viewerId },
    select: { type: true },
  });
  const hasBadge = (type: string) => existingBadges.some((b) => b.type === type);

  // EARLY_WALKER: posted sighting between 6am-9am 3 times
  if (!hasBadge("EARLY_WALKER")) {
    const earlySightings = await prisma.sighting.findMany({
      where: { createdByViewerId: viewerId },
    });
    const earlyCount = earlySightings.filter((s) => {
      const hour = s.seenAt.getHours();
      return hour >= 6 && hour < 9;
    }).length;
    if (earlyCount >= 3) {
      await prisma.badge.create({ data: { viewerId, type: "EARLY_WALKER" } });
      awarded.push("EARLY_WALKER");
    }
  }

  // EVENING_PATROL: posted sighting between 6pm-10pm 3 times
  if (!hasBadge("EVENING_PATROL")) {
    const sightings = await prisma.sighting.findMany({
      where: { createdByViewerId: viewerId },
    });
    const eveningCount = sightings.filter((s) => {
      const hour = s.seenAt.getHours();
      return hour >= 18 && hour < 22;
    }).length;
    if (eveningCount >= 3) {
      await prisma.badge.create({
        data: { viewerId, type: "EVENING_PATROL" },
      });
      awarded.push("EVENING_PATROL");
    }
  }

  // LOCAL_KNOWLEDGE: linked 3 sightings to REGULAR pets
  if (!hasBadge("LOCAL_KNOWLEDGE")) {
    const linkedSightings = await prisma.sighting.findMany({
      where: {
        createdByViewerId: viewerId,
        petId: { not: null },
        pet: { status: "REGULAR" },
      },
    });
    if (linkedSightings.length >= 3) {
      await prisma.badge.create({
        data: { viewerId, type: "LOCAL_KNOWLEDGE" },
      });
      awarded.push("LOCAL_KNOWLEDGE");
    }
  }

  // STEADY_NEIGHBOR: 3 upvotes on comments mentioning "regular", "known", or "friendly"
  if (!hasBadge("STEADY_NEIGHBOR")) {
    const calmComments = await prisma.comment.findMany({
      where: {
        createdByViewerId: viewerId,
        OR: [
          { body: { contains: "regular" } },
          { body: { contains: "known" } },
          { body: { contains: "friendly" } },
        ],
      },
    });
    let totalUpvotes = 0;
    for (const c of calmComments) {
      const votes = await prisma.vote.count({
        where: { targetType: "COMMENT", targetId: c.id, voteType: "UP" },
      });
      totalUpvotes += votes;
    }
    if (totalUpvotes >= 3) {
      await prisma.badge.create({
        data: { viewerId, type: "STEADY_NEIGHBOR" },
      });
      awarded.push("STEADY_NEIGHBOR");
    }
  }

  // REUNION_HELPER: contributed to a pet thread that got a confirmed reunion
  if (!hasBadge("REUNION_HELPER")) {
    const viewerSightingPetIds = await prisma.sighting.findMany({
      where: { createdByViewerId: viewerId, petId: { not: null } },
      select: { petId: true },
    });
    const viewerCommentPetIds = await prisma.comment.findMany({
      where: { createdByViewerId: viewerId },
      select: { petId: true },
    });
    const petIds = new Set([
      ...viewerSightingPetIds.map((s) => s.petId),
      ...viewerCommentPetIds.map((c) => c.petId),
    ]);
    for (const pid of petIds) {
      if (!pid) continue;
      const reunion = await prisma.reunion.findUnique({
        where: { petId: pid },
      });
      if (reunion) {
        await prisma.badge.create({
          data: { viewerId, type: "REUNION_HELPER" },
        });
        awarded.push("REUNION_HELPER");
        break;
      }
    }
  }

  return awarded;
}
