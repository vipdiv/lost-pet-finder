# Lawndale Park Pet Registry

**Seen here. Safe here. Found faster.**

A neighborly web app for Houston's Lawndale Park community to report pet sightings, track missing pets, and document familiar park regulars — all without accounts or complicated setup.

## Features

- **Post Sightings** — Share a photo, location, and notes when you spot a pet in the park
- **Missing Pets** — Report a missing dog or cat with contact info for neighbors
- **Park Regulars** — Document well-known roaming pets to reduce false alarms
- **Matching** — After posting a sighting, see possible matches to missing pets
- **Reunion Tracking** — Confirm when a pet is found and celebrate with the community
- **Gentle Gamification** — Earn steward levels and badges for helpful participation
- **Community Garden** — Visual progress panel showing reunions and regulars
- **Abuse Prevention** — Report posts, auto-hide after 3 reports, rate limiting
- **No Accounts Required** — Lightweight device identity via localStorage UUID

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with custom historic Houston theme
- **SQLite** via Prisma ORM
- **Image Uploads**: local filesystem (dev) / Cloudinary (prod)

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed with sample data (6 missing pets, 6 regulars, 12 sightings)
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── actions.ts            # Server actions
│   ├── globals.css           # Global styles + Tailwind
│   ├── api/                  # API routes
│   ├── sightings/            # Sightings feed + new sighting
│   ├── missing/              # Missing pets list + report form
│   ├── pets/[id]/            # Pet detail page
│   └── regulars/             # Park regulars list
├── components/               # Shared UI components
└── lib/                      # Server utilities
    ├── db.ts                 # Prisma client singleton
    ├── upload.ts             # Image upload (local/Cloudinary)
    ├── cloudinary.ts         # Cloudinary config
    ├── gamification.ts       # Points, levels, badges
    ├── moderation.ts         # Auto-hide after 3 reports
    ├── rate-limit.ts         # IP + viewerId rate limiting
    └── viewer.ts             # Server-side viewer helpers
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed script
```

## Deploy to Vercel

1. Push your repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Set environment variables:

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_UPLOAD_MODE="cloudinary"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Deploy!

> **Note**: For production, consider using a hosted database (e.g., Turso for SQLite or switch to PostgreSQL). The local SQLite file works for development and demos.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Prisma database connection | `file:./dev.db` |
| `NEXT_PUBLIC_UPLOAD_MODE` | `"local"` or `"cloudinary"` | `"local"` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |

## Gamification

Points and steward levels are earned through helpful participation:

| Action | Points |
|---|---|
| Post a sighting | +2 |
| Post a comment | +1 |
| Receive an upvote | +2 |
| Link sighting to missing pet | +5 |
| Confirm a reunion | +10 |
| Accepted abuse report | +2 |

**Steward Levels**: Visitor (0-9) → Neighbor (10-29) → Park Watcher (30-69) → Steward (70-149) → Bridge Guardian (150+)

## License

MIT
