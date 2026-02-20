import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { viewerId: string } }
) {
  const { viewerId } = params;

  const profile = await prisma.viewerProfile.findUnique({
    where: { viewerId },
  });

  if (!profile) {
    return NextResponse.json({ stewardLevel: "VISITOR", points: 0 });
  }

  const badges = await prisma.badge.findMany({
    where: { viewerId },
  });

  return NextResponse.json({
    stewardLevel: profile.stewardLevel,
    points: profile.points,
    displayName: profile.displayName,
    badges: badges.map((b) => b.type),
  });
}
