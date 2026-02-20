"use server";

import { prisma } from "@/lib/db";
import { uploadImage } from "@/lib/upload";
import { awardPoints, awardReunionPoints, checkAndAwardBadges } from "@/lib/gamification";
import { checkAndHideTarget } from "@/lib/moderation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getIpFromHeader } from "@/lib/viewer";
import { revalidatePath } from "next/cache";

// ── Sightings ──────────────────────────────────────────

export async function createSighting(formData: FormData) {
  const viewerId = formData.get("viewerId") as string;
  if (!viewerId) return { error: "No viewer ID" };

  const ip = getIpFromHeader();
  const { allowed } = await checkRateLimit(ip, viewerId);
  if (!allowed) return { error: "Too many requests. Please wait a moment." };

  const photo = formData.get("photo") as File;
  if (!photo || photo.size === 0) return { error: "Photo is required" };
  if (photo.size > 5 * 1024 * 1024) return { error: "Photo must be under 5MB" };

  const species = formData.get("species") as string;
  const locationText = formData.get("locationText") as string;
  const notes = formData.get("notes") as string | null;
  const seenAtStr = formData.get("seenAt") as string | null;
  const waitMinutesStr = formData.get("waitMinutes") as string | null;

  if (!species || !locationText) return { error: "Species and location are required" };

  const photoUrl = await uploadImage(photo);
  const seenAt = seenAtStr ? new Date(seenAtStr) : new Date();
  const waitMinutes = waitMinutesStr ? parseInt(waitMinutesStr) : null;

  const sighting = await prisma.sighting.create({
    data: {
      species,
      photoUrl,
      locationText,
      seenAt,
      notes: notes || null,
      waitMinutes,
      createdByViewerId: viewerId,
    },
  });

  await awardPoints(viewerId, "POST_SIGHTING");
  await checkAndAwardBadges(viewerId);

  revalidatePath("/sightings");
  revalidatePath("/");

  return { success: true, sightingId: sighting.id };
}

export async function linkSightingToPet(
  sightingId: string,
  petId: string,
  viewerId: string
) {
  if (!viewerId) return { error: "No viewer ID" };

  await prisma.sighting.update({
    where: { id: sightingId },
    data: { petId },
  });

  await awardPoints(viewerId, "LINK_SIGHTING_TO_MISSING");
  await checkAndAwardBadges(viewerId);

  revalidatePath(`/pets/${petId}`);
  revalidatePath("/sightings");

  return { success: true };
}

// ── Missing Pets ───────────────────────────────────────

export async function createMissingPet(formData: FormData) {
  const viewerId = formData.get("viewerId") as string;
  if (!viewerId) return { error: "No viewer ID" };

  const ip = getIpFromHeader();
  const { allowed } = await checkRateLimit(ip, viewerId);
  if (!allowed) return { error: "Too many requests. Please wait a moment." };

  const photo = formData.get("photo") as File;
  if (!photo || photo.size === 0) return { error: "Photo is required" };
  if (photo.size > 5 * 1024 * 1024) return { error: "Photo must be under 5MB" };

  const species = formData.get("species") as string;
  const name = formData.get("name") as string | null;
  const description = formData.get("description") as string;
  const contactInfo = formData.get("contactInfo") as string;

  if (!species || !description || !contactInfo) {
    return { error: "Species, description, and contact info are required" };
  }

  const photoUrl = await uploadImage(photo);

  const pet = await prisma.pet.create({
    data: {
      status: "MISSING",
      species,
      name: name || null,
      description,
      contactInfo,
      primaryPhotoUrl: photoUrl,
    },
  });

  revalidatePath("/missing");
  revalidatePath("/");

  return { success: true, petId: pet.id };
}

// ── Comments ───────────────────────────────────────────

export async function createComment(
  petId: string,
  body: string,
  viewerId: string,
  sightingId?: string
) {
  if (!viewerId) return { error: "No viewer ID" };
  if (!body.trim()) return { error: "Comment cannot be empty" };

  const comment = await prisma.comment.create({
    data: {
      petId,
      sightingId: sightingId || null,
      body: body.trim(),
      createdByViewerId: viewerId,
    },
  });

  await awardPoints(viewerId, "POST_COMMENT");
  await checkAndAwardBadges(viewerId);

  revalidatePath(`/pets/${petId}`);

  return { success: true, commentId: comment.id };
}

// ── Votes ──────────────────────────────────────────────

export async function castVote(
  targetType: string,
  targetId: string,
  viewerId: string,
  authorViewerId: string
) {
  if (!viewerId) return { error: "No viewer ID" };
  if (viewerId === authorViewerId) return { error: "Cannot vote on your own content" };

  const existing = await prisma.vote.findUnique({
    where: { targetId_createdByViewerId: { targetId, createdByViewerId: viewerId } },
  });
  if (existing) return { error: "Already voted" };

  await prisma.vote.create({
    data: {
      targetType,
      targetId,
      voteType: "UP",
      createdByViewerId: viewerId,
    },
  });

  // Award points to the content author
  await awardPoints(authorViewerId, "UPVOTE_HELPFUL");
  await checkAndAwardBadges(authorViewerId);

  return { success: true };
}

// ── Reports ────────────────────────────────────────────

export async function submitReport(
  targetType: string,
  targetId: string,
  reason: string,
  viewerId: string
) {
  if (!viewerId) return { error: "No viewer ID" };
  if (!reason.trim()) return { error: "Reason is required" };

  await prisma.report.create({
    data: {
      targetType,
      targetId,
      reason: reason.trim(),
      createdByViewerId: viewerId,
    },
  });

  await checkAndHideTarget(targetType, targetId);

  return { success: true };
}

// ── Reunions ───────────────────────────────────────────

export async function confirmReunion(
  petId: string,
  viewerId: string,
  note?: string
) {
  if (!viewerId) return { error: "No viewer ID" };

  const existing = await prisma.reunion.findUnique({ where: { petId } });
  if (existing) return { error: "Reunion already confirmed" };

  await prisma.reunion.create({
    data: {
      petId,
      confirmedByViewerId: viewerId,
      note: note || null,
    },
  });

  await prisma.pet.update({
    where: { id: petId },
    data: { status: "REUNITED" },
  });

  await awardReunionPoints(petId, viewerId);
  await checkAndAwardBadges(viewerId);

  revalidatePath(`/pets/${petId}`);
  revalidatePath("/missing");
  revalidatePath("/");

  return { success: true };
}
