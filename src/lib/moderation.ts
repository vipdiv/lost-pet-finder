import { prisma } from "./db";

const REPORT_THRESHOLD = 3;

export async function checkAndHideTarget(
  targetType: string,
  targetId: string
): Promise<boolean> {
  const reportCount = await prisma.report.count({
    where: { targetType, targetId },
  });

  if (reportCount >= REPORT_THRESHOLD) {
    switch (targetType) {
      case "PET":
        await prisma.pet.update({
          where: { id: targetId },
          data: { hidden: true },
        });
        break;
      case "SIGHTING":
        await prisma.sighting.update({
          where: { id: targetId },
          data: { hidden: true },
        });
        break;
      case "COMMENT":
        await prisma.comment.update({
          where: { id: targetId },
          data: { hidden: true },
        });
        break;
    }

    // Award points to reporters
    const reports = await prisma.report.findMany({
      where: { targetType, targetId },
      select: { createdByViewerId: true },
    });
    const { awardPoints } = await import("./gamification");
    for (const r of reports) {
      await awardPoints(r.createdByViewerId, "REPORT_SPAM_OR_ABUSE");
    }

    return true;
  }

  return false;
}
