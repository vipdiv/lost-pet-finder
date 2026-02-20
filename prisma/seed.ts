import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder images from picsum.photos (seeded for consistency)
const dogPhotos = [
  "https://picsum.photos/seed/dog1/400/300",
  "https://picsum.photos/seed/dog2/400/300",
  "https://picsum.photos/seed/dog3/400/300",
  "https://picsum.photos/seed/dog4/400/300",
  "https://picsum.photos/seed/dog5/400/300",
  "https://picsum.photos/seed/dog6/400/300",
  "https://picsum.photos/seed/dog7/400/300",
  "https://picsum.photos/seed/dog8/400/300",
];

const catPhotos = [
  "https://picsum.photos/seed/cat1/400/300",
  "https://picsum.photos/seed/cat2/400/300",
  "https://picsum.photos/seed/cat3/400/300",
  "https://picsum.photos/seed/cat4/400/300",
  "https://picsum.photos/seed/cat5/400/300",
  "https://picsum.photos/seed/cat6/400/300",
];

const sightingPhotos = [
  "https://picsum.photos/seed/sight1/400/300",
  "https://picsum.photos/seed/sight2/400/300",
  "https://picsum.photos/seed/sight3/400/300",
  "https://picsum.photos/seed/sight4/400/300",
  "https://picsum.photos/seed/sight5/400/300",
  "https://picsum.photos/seed/sight6/400/300",
  "https://picsum.photos/seed/sight7/400/300",
  "https://picsum.photos/seed/sight8/400/300",
  "https://picsum.photos/seed/sight9/400/300",
  "https://picsum.photos/seed/sight10/400/300",
  "https://picsum.photos/seed/sight11/400/300",
  "https://picsum.photos/seed/sight12/400/300",
];

const viewerIds = [
  "viewer-seed-alice",
  "viewer-seed-bob",
  "viewer-seed-carla",
  "viewer-seed-dave",
  "viewer-seed-elena",
];

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.badge.deleteMany();
  await prisma.gamificationEvent.deleteMany();
  await prisma.viewerProfile.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.report.deleteMany();
  await prisma.reunion.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.sighting.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.rateLimit.deleteMany();

  // ── Missing Pets ──────────────────────────────────────
  const missingPets = await Promise.all([
    prisma.pet.create({
      data: {
        status: "MISSING",
        name: "Buddy",
        species: "DOG",
        description:
          "Golden retriever, about 70 lbs. Friendly but skittish when scared. Wearing a red collar with tags.",
        primaryPhotoUrl: dogPhotos[0],
        contactInfo: "Call Maria: 713-555-0142",
        createdAt: hoursAgo(48),
      },
    }),
    prisma.pet.create({
      data: {
        status: "MISSING",
        name: "Whiskers",
        species: "CAT",
        description:
          "Orange tabby, medium size. Indoor cat, not used to being outside. Microchipped.",
        primaryPhotoUrl: catPhotos[0],
        contactInfo: "Text James: 832-555-0198",
        createdAt: hoursAgo(24),
      },
    }),
    prisma.pet.create({
      data: {
        status: "MISSING",
        name: "Luna",
        species: "CAT",
        description:
          "Black cat with white paws and a tiny white spot on her chest. Very shy.",
        primaryPhotoUrl: catPhotos[1],
        contactInfo: "Email: luna.lost@email.com",
        createdAt: hoursAgo(72),
      },
    }),
    prisma.pet.create({
      data: {
        status: "MISSING",
        name: "Tank",
        species: "DOG",
        description:
          "Brindle pit bull mix, 55 lbs. Muscular but gentle. Blue harness, no tags.",
        primaryPhotoUrl: dogPhotos[1],
        contactInfo: "Call or text: 713-555-0277",
        createdAt: hoursAgo(12),
      },
    }),
    prisma.pet.create({
      data: {
        status: "MISSING",
        species: "DOG",
        description:
          "Small white poodle mix, matted fur. Seen running near the pavilion yesterday. No collar.",
        primaryPhotoUrl: dogPhotos[2],
        contactInfo: "DM @lawndale_pets on Instagram",
        createdAt: hoursAgo(6),
      },
    }),
    prisma.pet.create({
      data: {
        status: "MISSING",
        name: "Cleo",
        species: "CAT",
        description:
          "Siamese mix, blue eyes, cream and brown coloring. Indoor/outdoor cat who hasn't come home.",
        primaryPhotoUrl: catPhotos[2],
        contactInfo: "Call Rosa: 281-555-0333",
        createdAt: hoursAgo(96),
      },
    }),
  ]);

  // ── Regular Pets ──────────────────────────────────────
  const regularPets = await Promise.all([
    prisma.pet.create({
      data: {
        status: "REGULAR",
        name: "Old Gus",
        species: "DOG",
        description:
          "Big lazy hound dog. Belongs to the Hernandez family on the east side. He just likes to sunbathe by the tennis courts.",
        primaryPhotoUrl: dogPhotos[3],
        createdAt: hoursAgo(720),
      },
    }),
    prisma.pet.create({
      data: {
        status: "REGULAR",
        name: "Patches",
        species: "CAT",
        description:
          "Calico cat, very friendly. Lives at the yellow house near the trailhead. She roams the park daily.",
        primaryPhotoUrl: catPhotos[3],
        createdAt: hoursAgo(600),
      },
    }),
    prisma.pet.create({
      data: {
        status: "REGULAR",
        name: "Biscuit",
        species: "DOG",
        description:
          "Small tan chihuahua mix. Belongs to Mr. Chen. Usually off-leash in the mornings — he always comes when called.",
        primaryPhotoUrl: dogPhotos[4],
        createdAt: hoursAgo(500),
      },
    }),
    prisma.pet.create({
      data: {
        status: "REGULAR",
        name: "Shadow",
        species: "CAT",
        description:
          "All-black cat with bright green eyes. Community cat — fed by several neighbors. Neutered (tipped ear).",
        primaryPhotoUrl: catPhotos[4],
        createdAt: hoursAgo(400),
      },
    }),
    prisma.pet.create({
      data: {
        status: "REGULAR",
        name: "Duchess",
        species: "DOG",
        description:
          "Older German Shepherd. Very well-behaved. Her owner walks her at dawn and dusk along the bridge path.",
        primaryPhotoUrl: dogPhotos[5],
        createdAt: hoursAgo(300),
      },
    }),
    prisma.pet.create({
      data: {
        status: "REGULAR",
        name: "Marble",
        species: "CAT",
        description:
          "Gray and white cat, a bit chunky. Hangs out under the pavilion benches. Known and loved by regulars.",
        primaryPhotoUrl: catPhotos[5],
        createdAt: hoursAgo(200),
      },
    }),
  ]);

  // ── Sightings ─────────────────────────────────────────
  const sightings = await Promise.all([
    // Linked to missing pets
    prisma.sighting.create({
      data: {
        petId: missingPets[0].id, // Buddy
        species: "DOG",
        photoUrl: sightingPhotos[0],
        locationText: "Near the tennis courts, heading toward the bridge",
        seenAt: hoursAgo(3),
        notes: "Golden retriever, seemed confused. Had a red collar.",
        waitMinutes: 20,
        createdByViewerId: viewerIds[0],
      },
    }),
    prisma.sighting.create({
      data: {
        petId: missingPets[1].id, // Whiskers
        species: "CAT",
        photoUrl: sightingPhotos[1],
        locationText: "Under the pavilion, near the east picnic tables",
        seenAt: hoursAgo(8),
        notes: "Orange tabby hiding under the table. Seemed scared.",
        createdByViewerId: viewerIds[1],
      },
    }),
    prisma.sighting.create({
      data: {
        petId: missingPets[3].id, // Tank
        species: "DOG",
        photoUrl: sightingPhotos[2],
        locationText: "By the creek trail entrance, south side",
        seenAt: hoursAgo(1),
        notes: "Brindle pit bull walking slowly. Had a blue harness. Friendly.",
        waitMinutes: 30,
        createdByViewerId: viewerIds[2],
      },
    }),
    // Linked to regulars
    prisma.sighting.create({
      data: {
        petId: regularPets[0].id, // Old Gus
        species: "DOG",
        photoUrl: sightingPhotos[3],
        locationText: "Sunbathing by the tennis courts, as usual",
        seenAt: hoursAgo(2),
        notes: "Just Old Gus doing his thing. He's fine.",
        createdByViewerId: viewerIds[3],
      },
    }),
    prisma.sighting.create({
      data: {
        petId: regularPets[1].id, // Patches
        species: "CAT",
        photoUrl: sightingPhotos[4],
        locationText: "On the fence near the trailhead",
        seenAt: hoursAgo(5),
        notes:
          "Patches is out and about. She's a known regular — friendly and well-fed.",
        createdByViewerId: viewerIds[4],
      },
    }),
    prisma.sighting.create({
      data: {
        petId: regularPets[3].id, // Shadow
        species: "CAT",
        photoUrl: sightingPhotos[5],
        locationText: "Under the bridge, eating kibble someone left out",
        seenAt: hoursAgo(4),
        createdByViewerId: viewerIds[0],
      },
    }),
    // Unlinked sightings
    prisma.sighting.create({
      data: {
        species: "DOG",
        photoUrl: sightingPhotos[6],
        locationText: "Running along the jogging trail, north loop",
        seenAt: hoursAgo(0.5),
        notes:
          "Small white fluffy dog, no collar. Seemed lost. Moving fast.",
        waitMinutes: 10,
        createdByViewerId: viewerIds[1],
      },
    }),
    prisma.sighting.create({
      data: {
        species: "CAT",
        photoUrl: sightingPhotos[7],
        locationText: "Behind the community garden shed",
        seenAt: hoursAgo(7),
        notes: "Gray cat with a bell collar. Haven't seen this one before.",
        createdByViewerId: viewerIds[2],
      },
    }),
    prisma.sighting.create({
      data: {
        species: "DOG",
        photoUrl: sightingPhotos[8],
        locationText: "Near the playground, by the water fountain",
        seenAt: hoursAgo(10),
        notes: "Brown lab mix, very friendly, approached kids gently.",
        createdByViewerId: viewerIds[3],
      },
    }),
    prisma.sighting.create({
      data: {
        species: "CAT",
        photoUrl: sightingPhotos[9],
        locationText: "On the roof of the restroom building",
        seenAt: hoursAgo(15),
        notes: "Black and white tuxedo cat. Just sitting up there watching.",
        createdByViewerId: viewerIds[4],
      },
    }),
    prisma.sighting.create({
      data: {
        species: "DOG",
        photoUrl: sightingPhotos[10],
        locationText: "Under the big oak by the parking lot",
        seenAt: hoursAgo(20),
        notes: "Small terrier, barking at squirrels. Had a leash dragging.",
        createdByViewerId: viewerIds[0],
      },
    }),
    prisma.sighting.create({
      data: {
        species: "OTHER",
        photoUrl: sightingPhotos[11],
        locationText: "By the duck pond, east bank",
        seenAt: hoursAgo(36),
        notes: "Someone's pet rabbit? White with brown spots. In the grass.",
        createdByViewerId: viewerIds[1],
      },
    }),
  ]);

  // ── Comments ──────────────────────────────────────────
  await Promise.all([
    prisma.comment.create({
      data: {
        petId: missingPets[0].id,
        sightingId: sightings[0].id,
        body: "I saw him too about 20 minutes later heading toward the bridge. Still had the red collar on.",
        createdByViewerId: viewerIds[1],
        createdAt: hoursAgo(2.5),
      },
    }),
    prisma.comment.create({
      data: {
        petId: missingPets[0].id,
        body: "Maria, I left some water out near the bridge just in case. Hope Buddy comes home soon.",
        createdByViewerId: viewerIds[2],
        createdAt: hoursAgo(2),
      },
    }),
    prisma.comment.create({
      data: {
        petId: missingPets[1].id,
        sightingId: sightings[1].id,
        body: "I think this is the same cat from the flyer on the lamppost. Orange tabby, right?",
        createdByViewerId: viewerIds[3],
        createdAt: hoursAgo(7),
      },
    }),
    prisma.comment.create({
      data: {
        petId: missingPets[3].id,
        sightingId: sightings[2].id,
        body: "Just saw Tank! He's still near the creek. I can wait here another 15 minutes if the owner is on the way.",
        createdByViewerId: viewerIds[4],
        createdAt: hoursAgo(0.5),
      },
    }),
    prisma.comment.create({
      data: {
        petId: regularPets[0].id,
        body: "Old Gus is a known regular — he's friendly and belongs to the Hernandez family. No need to worry!",
        createdByViewerId: viewerIds[0],
        createdAt: hoursAgo(1.5),
      },
    }),
    prisma.comment.create({
      data: {
        petId: regularPets[1].id,
        body: "Patches is friendly and a known park regular. She lives nearby and always comes home.",
        createdByViewerId: viewerIds[3],
        createdAt: hoursAgo(4),
      },
    }),
  ]);

  // ── Votes ─────────────────────────────────────────────
  await Promise.all([
    prisma.vote.create({
      data: {
        targetType: "SIGHTING",
        targetId: sightings[0].id,
        voteType: "UP",
        createdByViewerId: viewerIds[1],
      },
    }),
    prisma.vote.create({
      data: {
        targetType: "SIGHTING",
        targetId: sightings[0].id,
        voteType: "UP",
        createdByViewerId: viewerIds[2],
      },
    }),
    prisma.vote.create({
      data: {
        targetType: "SIGHTING",
        targetId: sightings[2].id,
        voteType: "UP",
        createdByViewerId: viewerIds[0],
      },
    }),
    prisma.vote.create({
      data: {
        targetType: "SIGHTING",
        targetId: sightings[2].id,
        voteType: "UP",
        createdByViewerId: viewerIds[4],
      },
    }),
    prisma.vote.create({
      data: {
        targetType: "SIGHTING",
        targetId: sightings[6].id,
        voteType: "UP",
        createdByViewerId: viewerIds[3],
      },
    }),
  ]);

  // ── Viewer Profiles ───────────────────────────────────
  await Promise.all(
    viewerIds.map((vid, i) =>
      prisma.viewerProfile.create({
        data: {
          viewerId: vid,
          displayName: ["Alice", "Bob", "Carla", "Dave", "Elena"][i],
          points: [12, 8, 15, 6, 10][i],
          stewardLevel: [
            "NEIGHBOR",
            "VISITOR",
            "NEIGHBOR",
            "VISITOR",
            "NEIGHBOR",
          ][i],
        },
      })
    )
  );

  console.log("Seed complete!");
  console.log(
    `  ${missingPets.length} missing pets, ${regularPets.length} regulars, ${sightings.length} sightings`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
