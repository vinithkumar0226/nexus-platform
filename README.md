# NEXUS

## Source-grounded AI content transformation and assurance

NEXUS turns one source document into a coordinated set of communication artefacts while keeping the facts, evidence, validation state, human approval, and audit history connected.

The current repository is a polished, mock-driven product prototype for the SIH 2026 demonstration. It is designed to make the end-to-end operating model visible before the production ingestion and persistence services are connected.

## Product story

```text
One source
	-> secure ingestion
	-> Content DNA (shared fact base)
	-> audience-specific artefacts
	-> factual validation and provenance
	-> human review
	-> approved export
```

The key product idea is **change once, propagate everywhere**. A correction to a source-grounded fact can be analyzed for impact and propagated across every affected artefact before approval and export.

## Current capabilities

- Dark enterprise workspace with responsive navigation and operator controls
- Source management and simulated secure ingestion
- Content DNA view with facts, entities, confidence, and evidence
- Multi-output transformation flow
- Transformation graph for explaining the lifecycle to reviewers
- Validation center with conflicts and provenance links
- Human review with approve and reject actions
- Change-impact analysis and propagation simulation
- Export dashboard and artifact history
- Cryptographic-style audit trail with actor, result, metadata, and object history
- Zustand state layer that mirrors the future backend contracts

## Run locally

Requirements: Node.js 20 or newer and npm.

````bash
git clone https://github.com/vinithkumar0226/nexus-platform.git
cd nexus-platform

## Database setup

The repository includes a Prisma 7 PostgreSQL schema and a repeatable demo-data seed.

```bash
Copy-Item .env.example .env
npm run prisma:validate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run prisma:generate
```

For a machine without Docker or PostgreSQL installed, Prisma can provide a local development database:

```bash
npx prisma dev -d --name nexus-local
```

The current UI and workspace API still use the in-memory adapter by design. The database is now migrated and seeded, ready for the Prisma repository adapter to become the next integration step.
- Add confidence and extraction-quality reporting

### Milestone 3: assurance services

- Generate artefacts through a model gateway
- Require evidence references for important claims
- Detect unsupported claims and conflicting facts
- Persist propagation previews and approval decisions

### Milestone 4: release readiness

- Add unit, integration, and Playwright workflow tests
- Deploy the frontend and backend
- Add observability, access logs, and retention controls
- Run a complete judge rehearsal using a fixed demo dataset

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Zustand for prototype workflow state
- PostgreSQL and Prisma 7 persistence foundation
- Tailwind CSS utilities and custom NEXUS design tokens
- Framer Motion for restrained state transitions
- Lucide icons

## Repository

[github.com/vinithkumar0226/nexus-platform](https://github.com/vinithkumar0226/nexus-platform)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````
