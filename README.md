# SkillSync — Intelligent Internship Matching (Next.js + Supabase + RAG)

An integrated frontend+backend Next.js 16 (App Router) application using TypeScript and Tailwind v4. Supabase provides Auth, Postgres, Storage, and pgvector for embeddings. RAG (Retrieval-Augmented Generation) powered recommendations match students and internships in both directions.

- Students: register, edit profile, paste resume, manage skills, browse/apply, get AI recommendations.
- Companies: register, create company profile, post internships, view matched students, shortlist/reject (shortlist/reject can be extended from the `applications` table).
- Admin: analytics overview, RAG tools (refresh analytics materialized view). Extendable to full user management.

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase: Auth, Postgres, pgvector, RLS
- Gemini embeddings (default: `text-embedding-004`)
- Deployed on AWS Elastic Beanstalk (Node.js platform)

## 1) Local Setup

Prerequisites
- Node.js 18+ and npm
- Supabase project (https://supabase.com/)
- Google Gemini API key

Clone and install
```bash
npm install
```

Environment variables
Create a `.env.local` file based on `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
GEMINI_API_KEY=your_gemini_api_key
GEMINI_EMBEDDING_MODEL=text-embedding-004
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Database schema
- Open Supabase SQL editor, paste and run `supabase.sql` from the project root. This:
  - Enables `vector` and `uuid-ossp`
  - Creates tables: `profiles`, `students`, `companies`, `internships`, `applications`, `skills`, `student_skills`, `internship_skills`, `embeddings`
  - Adds materialized view `analytics_overview` and RPC funcs:
    - `match_internships_for_student(student_id, limit)`
    - `match_students_for_internship(internship_id, limit)`
    - `refresh_analytics()`
  - Enables basic Row Level Security (adjust for production)

Run the app
```bash
npm run dev
```
Visit http://localhost:3000

## 2) App Overview & Navigation
- Landing: overview and CTAs
- Auth: `/login`, `/register`
- Dashboard: `/dashboard`
- Student:
  - Profile: `/student/profile` (update profile and paste resume text to index via embeddings)
  - Browse: `/student/browse` (list internships, apply)
  - AI Recs: `/student/recommendations`
- Company:
  - Post Internship: `/company/internships/new` (auto-index description for matching)
  - Matches: `/company/matches` (select a posting to see matched students)
- Admin:
  - Analytics: `/admin/analytics` (counts from materialized view)
  - Refresh analytics (API): `POST /api/admin/refresh-analytics`

APIs (App Router `route.ts`)
- Embeddings ingest: `POST /api/embeddings/ingest` { owner_type, owner_id, content }
- Student recs: `GET /api/recommendations/student?student_id=...`
- Internship recs: `GET /api/recommendations/internship?internship_id=...`
- List internships: `GET /api/internships/list`
- Apply: `POST /api/applications/apply` { internship_id, cover_letter? }
- Student update: `POST /api/student/update` { student_id, updates }
- Company new internship: `POST /api/company/internships/new`
- Company mine: `GET /api/company/internships/mine`
- Current user/profile: `GET /api/me`
- Admin analytics: `GET /api/admin/analytics`
- Admin refresh analytics: `POST /api/admin/refresh-analytics`

Notes
- On registration, a `profile` and role-specific record are ensured lazily on first dashboard visit.
- Embedding ingestion uses Google Gemini embeddings; ensure `GEMINI_API_KEY` is set.
- RLS policies in `supabase.sql` are permissive for selects. Tighten for production.

## 3) RAG Matching
- Student resume text is chunked and embedded; saved in `embeddings` with `owner_type='student_resume'`.
- Internship descriptions are embedded with `owner_type='internship'` on creation.
- Matching uses pgvector cosine distance via Supabase RPC functions returning scored results.

## 4) Professional UI
- Utility components in `src/components/ui.tsx`
- Global layout with sticky header and modern, minimal theme using Tailwind v4.
- Pages follow clean, responsive, accessible design.

## 5) AWS Elastic Beanstalk Deployment

What EB will run
- Node.js platform, using `Procfile`:
```
web: next start -p $PORT
```
- `next.config.ts` sets `output: 'standalone'` so EB runs the standalone server.

Steps
1. Ensure `.env.production` is configured locally (same keys as `.env.local`). You will set these as EB environment variables.
2. Build locally (optional):
   ```bash
   npm run build
   ```
3. Zip your project excluding `node_modules` (EB will install) or use `eb init` workflow.
4. Create an EB application and environment (Node.js 18+ platform). Using AWS CLI:
   ```bash
   aws elasticbeanstalk create-application --application-name SkillSync
   aws elasticbeanstalk create-environment \
     --application-name SkillSync \
     --environment-name skillsync-env \
     --solution-stack-name "64bit Amazon Linux 2 v5.8.4 running Node.js 18" 
   ```
   Or run `eb init` and `eb create` in the repo.
5. Set environment variables in EB Console → Configuration → Software:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `GEMINI_EMBEDDING_MODEL` (optional)
   - `NEXT_PUBLIC_APP_URL` (your EB URL)
   - `NODE_ENV=production`
6. Deploy:
   - If using EB CLI:
     ```bash
     eb deploy
     ```
   - Otherwise, upload your source bundle (zip) in the EB console.

Troubleshooting
- Logs: EB Console → Logs. Ensure environment vars are present.
- Health check: ensure port is bound via `$PORT`; the `Procfile` covers this.

## 6) Extend & Harden
- RLS: add insert/update/delete policies per role. Enforce that students can update only their records, companies only their internships, admins privileged.
- Skills: add UI to tag skills to students and internships via `skills`, `student_skills`, `internship_skills` tables.
- Applications: add company workflows to shortlist/reject/hire by updating `applications.status`.
- Admin: add Users page to approve/deactivate users; add more analytics (top skills, match accuracy).
- File upload: integrate Supabase Storage to upload PDFs and run server-side text extraction before embedding.
- Background jobs: move embedding to a queue for large documents.

## 7) Quick Smoke Test
1. Register a new user (Student). Visit Dashboard.
2. Open Student Profile, paste sample resume text, Save (this ingests embeddings).
3. As Company (create another account), post a new internship with detailed description.
4. As Student, browse internships and apply, then open AI Recommendations and confirm scores appear.
5. As Company, open Matches and select your posting to see matched students.
6. As Admin (manually set role in `profiles` to `admin`), open Admin Analytics and POST `/api/admin/refresh-analytics`.

Happy matching! 🎯
