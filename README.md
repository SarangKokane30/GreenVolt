# GreenVolt Energy Solutions

Next.js App Router + Payload CMS foundation for the GreenVolt corporate website. The original approved logo and visual palette are retained. The previous static prototype remains in `index.html` for reference; the application runs from `src/app`.

## Stack

- Next.js 16.2, React 19 and TypeScript
- Payload CMS 3 with PostgreSQL/Drizzle
- Cloudinary media adapter when configured
- Zod validated inquiry API, Cloudflare Turnstile and Resend integrations
- Tailwind CSS 4, with the approved GreenVolt palette in the site styles

Payload's current compatibility matrix requires Node `^22.23.4` or `>=24.22.1` and Next.js `16.2.6+`. Upgrade Node before installing/building if your active runtime is older.

## Local setup

1. Install a supported Node release and PostgreSQL 15+.
2. Copy `.env.example` to `.env.local`; set `DATABASE_URL` and a unique `PAYLOAD_SECRET`.
3. Install dependencies with `npm install`.
4. Run `npm run dev` and open `http://localhost:3000/admin` to create the initial administrator.
5. Add categories and only verified products, certifications and capabilities through the admin.

Payload's Postgres adapter uses its supported Drizzle integration. In development it manages schema changes automatically. For controlled environments, generate and commit migrations with `npx payload migrate:create` and apply them using `npx payload migrate`.

## Admin and access

The Payload dashboard lives at `/admin`. Public registration is not exposed; administrator creation is performed from the admin setup screen. Collections require an authenticated administrator for writes. Inquiry records are private and public creation is disabled at the collection level; the validated server endpoint uses Payload Local API with explicit override access.

## Inquiries

`POST /api/inquiries` validates fields, applies a basic per-process rate limit and optional Turnstile verification, then stores the submission in PostgreSQL. Production requires Turnstile and email provider settings. Resend sends an administrator notification and customer acknowledgement. Failed configuration or database operations return an error; the form does not claim success when no submission was stored. Configure durable edge/platform rate limiting before production use.

## Media and deployment

Set the three Cloudinary variables to enable the Payload Cloudinary adapter. Deploy the Next.js app to Vercel, provision PostgreSQL (for example Neon), configure environment variables in the hosting platform, and point DNS through Cloudflare. Keep customer-upload attachments disabled until a private object-storage bucket and file scanning policy are configured. Never commit `.env.local` or credentials.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before deployment. A production launch also requires a configured database, Cloudinary account (if used), Resend sender/domain, Turnstile site/secret keys, and verified company contact details.

## Information still required

- Confirmed company/factory addresses, phone, email, hours, map location, WhatsApp and social URLs
- Approved company overview, vision, mission and service/capability descriptions
- Product names, codes, images, technical specs, datasheets and application mappings
- Current certificate documents, numbers, issuing authorities, scope and expiry dates
- Production domain, database URL, Payload secret, Cloudinary credentials, Resend sender and Turnstile keys
- Private inquiry attachment storage choice and retention policy before attachments are enabled
