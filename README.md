# Aaharika — Flavours Made for Memories

A premium, full-stack **catering & event-management** website for **Aaharika**, serving Kolkata and
surrounding areas. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
and **Turso (libSQL)**.

> Aaharika is not just a catering service — we help customers create memorable events with great
> food, premium service and complete event-management support.

---

## ✨ Features

### Public website
- Elegant hero with clear CTAs (Explore Menus, Book Your Event, Customize Your Menu, Contact)
- **Our Signature Menus** — horizontally scrollable menu cards with prices, dish previews, *Book This Menu* & *Customize Menu*
- **Customize Your Menu** — build a custom menu by selecting dishes, then request a quote / book
- **Dishes We Serve** — category-filterable dish cards with details modal
- **Customize Your Dish** — request a custom dish (modal form, no page navigation)
- **We Offer** — Taste / Quality / Premium Service / Cost Friendly
- **Events We Manage** — 8 event types, each with a *Book Us* button that scrolls to Contact
- **Testimonials** — scrollable review cards + *Share Your Experience* modal (star ratings)
- **Contact Us** — form with email notifications + embedded Google Map & *View Location*
- SEO metadata, Open Graph, JSON-LD structured data, favicon, responsive design

### Admin portal (`/admin`)
- Secure JWT (httpOnly cookie) authentication with middleware-protected routes
- Signup / Login / Logout
- Dashboard with summary cards + recent activity
- CRUD for **Menus** (with dish linking) and **Dishes** (auto Dish IDs)
- **Orders**, **Enquiries**, **Testimonials** (approve/reject), **Custom Dish Requests** management
- Soft-delete/deactivation, confirmation dialogs, toasts, responsive tables

---

## 🧱 Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Turso / libSQL (`@libsql/client`) |
| Auth | `jose` JWT + httpOnly cookie, `bcryptjs` password hashing |
| Email | `nodemailer` (Gmail SMTP) |
| Deploy | Vercel |

---

## 📁 Project structure

```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css     # Public site
│   ├── admin/                                # Admin pages
│   └── api/                                   # Public + admin API routes
├── components/
│   ├── public/   # Navbar, Footer, Hero, sections, modals
│   ├── admin/    # AdminShell, ConfirmDialog
│   └── ui/       # Modal, Toast, StarRating, Spinner, VegBadge
├── db/           # schema.ts, migrate.ts, seed.ts
├── lib/          # db, auth, email, api helpers, types, client
└── middleware.ts # protects /admin and /api/admin
```

---

## 🚀 Local development

### 1. Prerequisites
- Node.js 18+
- A [Turso](https://turso.tech) account
- A Gmail account with an **App Password** (for email)

### 2. Install
```bash
npm install
```

### 3. Set up Turso
Install the Turso CLI and create the database:
```bash
# Install CLI (see https://docs.turso.tech)
turso db create Aaharika_Catering
turso db show Aaharika_Catering --url          # -> TURSO_DATABASE_URL
turso db tokens create Aaharika_Catering       # -> TURSO_AUTH_TOKEN
```

### 4. Configure environment
```bash
cp .env.example .env
```
Fill in `.env`:
```
TURSO_DATABASE_URL=libsql://aaharika-catering-xxxx.turso.io
TURSO_AUTH_TOKEN=...
JWT_SECRET=<random 32+ char string>
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=soumikmondal723@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Migrate & seed the database
```bash
npm run db:setup      # runs migrate + seed
```
This creates all tables and inserts sample dishes, menus, testimonials and a default admin:

```
Email:    admin@aaharika.com
Password: Admin@123
```
> Change this password (or create your own admin via /admin/signup) before going live.

### 6. Run
```bash
npm run dev
```
Open http://localhost:3000 (public site) and http://localhost:3000/admin/login (admin).

---

## 🗄️ Database schema

Tables: `Admin`, `Dish`, `Menu`, `MenuDish` (m2m), `Orders`, `OrderItems` (custom-menu dishes),
`ContactUs`, `Testimonials`, `CustomDishRequests`. Indexes are added on commonly queried columns
(emails, statuses, categories, created dates). See [src/db/schema.ts](src/db/schema.ts).

---

## 🔌 API reference

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus` | Active menus with dishes |
| GET | `/api/menus/:id` | Single menu |
| GET | `/api/dishes` | Active dishes (`?category=`) |
| GET | `/api/dishes/:id` | Single dish |
| POST | `/api/orders` | Create booking (menu or custom) |
| POST | `/api/contact` | Submit enquiry (+ emails) |
| GET/POST | `/api/testimonials` | Approved reviews / submit review |
| POST | `/api/custom-dish` | Custom dish request |

### Admin (auth required)
| Method | Endpoint |
|--------|----------|
| POST | `/api/admin/login`, `/api/admin/signup`, `/api/admin/logout` |
| GET | `/api/admin/stats` |
| GET/POST/PUT/DELETE | `/api/admin/menus`, `/api/admin/menus/:id` |
| GET/POST/PUT/DELETE | `/api/admin/dishes`, `/api/admin/dishes/:id` |
| GET/PUT | `/api/admin/orders`, `/api/admin/orders/:id` |
| GET/PUT/DELETE | `/api/admin/contact`, `/api/admin/contact/:id` |
| GET/PUT/DELETE | `/api/admin/testimonials`, `/api/admin/testimonials/:id` |
| GET/PUT/DELETE | `/api/admin/custom-dish`, `/api/admin/custom-dish/:id` |

All `/api/admin/*` routes (except auth) are protected by `src/middleware.ts`.

---

## 📧 Email

Contact submissions send two emails via `nodemailer` (Gmail SMTP):
1. **Admin notification** → `ADMIN_EMAIL` (`soumikmondal723@gmail.com`)
2. **Customer confirmation** → the email entered in the form

Credentials are read from environment variables only and never exposed to the client. If email
env vars are missing, sending is skipped gracefully (the enquiry is still stored).

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables (from `.env.example`) in **Project → Settings → Environment Variables**:
   `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`,
   `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy. Run `npm run db:setup` locally (or via Turso) once to initialise the database.

---

## 🔐 Security

- Passwords hashed with **bcrypt** (cost 12) — never stored in plaintext
- JWT stored in an **httpOnly** cookie; admin routes guarded by middleware
- Server-side + client-side validation on every form
- Secrets via environment variables; `.env` is git-ignored
- Generic error messages to users; real errors logged server-side only

---

## 📜 License / Credits

copyright@soumikmondal723
