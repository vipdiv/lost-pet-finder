import { prisma } from "./db";

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // per window

export async function checkRateLimit(
  ip: string,
  viewerId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `${ip}:${viewerId}`;
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || existing.windowStart < windowStart) {
    await prisma.rateLimit.upsert({
      where: { key },
      update: { count: 1, windowStart: now },
      create: { key, count: 1, windowStart: now },
    });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: existing.count + 1 },
  });

  return { allowed: true, remaining: MAX_REQUESTS - existing.count - 1 };
}
