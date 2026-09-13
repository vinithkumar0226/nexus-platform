# NEXUS

## Source-grounded AI content transformation and assurance

NEXUS turns one source document into coordinated communication artefacts while keeping facts, evidence, validation state, human approval, and audit history connected.

The current repository is a polished SIH 2026 product prototype with a real local PostgreSQL foundation. The UI remains demo-friendly, while the server boundary can now read the seeded workspace from Prisma.

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

The core idea is **change once, propagate everywhere**: a correction to a source-grounded fact can be analyzed and propagated across every affected artefact before approval and export.

## Current capabilities

- Responsive enterprise workspace with operator navigation
- Source management and simulated secure ingestion
- Content DNA with facts, entities, confidence, and evidence
- Multi-output transformation flow and transformation graph
- Validation center with conflict detection and provenance
- Human review, approval, rejection, propagation, and export flows
- Audit trail with actors, results, metadata, and object history
- Typed API contracts and read-only health/workspace endpoints
- PostgreSQL schema, migration, Prisma client, and repeatable demo seed

## Run locally

Requirements: Node.js 20 or newer and npm.

```powershell
git clone https://github.com/vinithkumar0226/nexus-platform.git
cd nexus-platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```powershell
npm run dev
npm run build
npm run lint
npm run prisma:validate
npm run prisma:seed
```

## Database setup

The repository uses Prisma 7 with PostgreSQL. For a machine without Docker or PostgreSQL installed, Prisma can provide a local development database:

```powershell
npx prisma dev -d --name nexus-local
Copy-Item .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run prisma:generate
```

When `DATABASE_URL` is configured, `GET /api/workspace` reads from PostgreSQL. Without it, the API safely falls back to the in-memory demo repository.

## SIH demo runbook

1. Open the Overview dashboard.
2. Show the processed cybersecurity report in Sources.
3. Open Content DNA and explain shared facts and evidence.
4. Select multiple output formats in Transform.
5. Use the graph to explain source-to-artefact lineage.
6. Open Validation and inspect the 18-versus-180 conflict.
7. Open provenance, correct the fact, and show propagation impact.
8. Approve the reviewed artefacts.
9. Finish on Audit and Exports.

Recommended routes:

| View                 | Route                      |
| -------------------- | -------------------------- |
| Overview             | `/`                        |
| Sources              | `/sources`                 |
| Content DNA          | `/content-dna/dna-001`     |
| Transform            | `/transform/src-001`       |
| Transformation graph | `/transform/src-001/graph` |
| Validation           | `/validation/src-001`      |
| Review               | `/review/art-001`          |
| Audit                | `/audit`                   |
| Exports              | `/exports`                 |

## API

```text
GET /api/health     -> service status and active persistence mode
GET /api/workspace  -> typed workspace snapshot
POST /api/sources   -> hash, store, and persist a PDF, DOCX, or TXT source
```

The repository selector uses Prisma when `DATABASE_URL` exists and the isolated in-memory adapter otherwise. Source uploads are stored under the ignored local `storage/uploads/` directory, with their storage key, SHA-256, metadata, and audit event persisted in PostgreSQL.

## Architecture

```text
src/app/             Next.js App Router screens and API routes
src/components/      Shared shell and UI components
src/data/mockData.ts Demo seed data
src/store/            Zustand UI workflow state
src/lib/server/       Repository interfaces and persistence adapters
src/types/            Domain and API contracts
prisma/schema.prisma  PostgreSQL data model
prisma/seed.ts        Repeatable demo-data seed
```

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Zustand and Framer Motion
- PostgreSQL and Prisma 7
- Tailwind CSS utilities and custom NEXUS design tokens
- Lucide icons

## Repository

[github.com/vinithkumar0226/nexus-platform](https://github.com/vinithkumar0226/nexus-platform)
