# Green Volt Energy Solution

Next.js App Router + Payload CMS website for Green Volt Energy Solution. The original logo is retained. The app runs from `src/app`; the older `index.html` prototype is not used by the Next.js routes.

## Stack

- Next.js 16.2, React 19 and TypeScript
- Payload CMS 3 with PostgreSQL/Drizzle
- Cloudinary media adapter when configured
- Zod validated inquiry API, Cloudflare Turnstile and Resend integrations
- Tailwind CSS 4, with the approved Evergreen, Carbon, Lime, Soft White and Mist Green palette

Payload's current compatibility matrix requires Node `^22.23.4` or `>=24.22.1` and Next.js `16.2.6+`. Upgrade Node before installing/building if your active runtime is older.

## Local setup

1. Install a supported Node release. Use a PostgreSQL 15+ database locally or a configured Neon database.
2. Copy `.env.example` to `.env.local`; set `DATABASE_URL`, a unique `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SITE_URL` only after a domain is configured.
3. Install dependencies with `npm install`.
4. Run `npm run dev` and open `http://localhost:3000/admin` to create the initial administrator.
5. Add categories and only verified products, certifications and capabilities through the admin.

Payload's Postgres adapter uses its supported Drizzle integration. In development it manages schema changes automatically. For controlled environments, generate and commit migrations with `npx payload migrate:create` and apply them using `npx payload migrate`.

## Admin and access

The Payload dashboard lives at `/admin`. Only the initial administrator can be created before an account exists; subsequent user creation requires authentication. Collections require an authenticated administrator for writes. Inquiry records and private inquiry files are admin-only. The validated public enquiry endpoint creates records with explicit server-side access override. No admin data is exposed to public API reads.

## Inquiries

`POST /api/inquiries` validates contact and battery requirement fields, applies a basic per-process rate limit and Turnstile verification when configured, then stores the enquiry in PostgreSQL. Production requires Turnstile and email provider settings. Resend sends a company notification and customer acknowledgement when configured. Failed configuration or database operations return an error; the form does not claim success when no submission was stored. Authenticated administrators can download CSV at `/api/inquiries/export`. Configure durable edge/platform rate limiting before production use.

## Media and deployment

Set the three Cloudinary variables to enable the Payload Cloudinary adapter. CMS media is private by default and requires a source/rights note; set visibility to public only when appropriate. Private enquiry files use a separate admin-only collection. Public form attachments remain disabled until private object storage, file size limits and a malware scanning policy are configured. Deploy the Next.js app to Vercel, provision PostgreSQL (for example Neon), configure environment variables in the hosting platform, and connect a purchased domain. Never commit `.env.local` or credentials.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before deployment. A production launch also requires a configured database, Cloudinary account (if used), Resend sender/domain, Turnstile site/secret keys, and verified company contact details.

## Publication and launch checklist

- Upload and review the current ISO 9001 certificate (issuer, number, scope and validity) before publishing any ISO claim. No battery certification is claimed without separate documentation.
- Add only real standard products and populate technical fields with approved product specifications; custom enquiries are kept separate from standard product records.
- Replace the explicitly labelled illustrative battery images with licensed or authentic Green Volt product and workshop photos when available.
- Configure production domain, database URL, Payload secret, email sender/provider and Turnstile keys.
- Select private attachment storage, file size limits, malware scanning and retention policy before enabling public attachment uploads.
- Confirm business hours, exact technical test procedures, warranty terms and any additional service claims before publishing them.
- Review privacy and commercial terms with the company before treating the website information pages as formal legal policies.
