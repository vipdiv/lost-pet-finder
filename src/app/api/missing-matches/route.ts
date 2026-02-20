import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const species = url.searchParams.get("species");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pets = await prisma.pet.findMany({
    where: {
      status: "MISSING",
      hidden: false,
      ...(species ? { species } : {}),
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      id: true,
      name: true,
      species: true,
      description: true,
      primaryPhotoUrl: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json(pets);
}
