# Blog Platform

A full-stack blog platform where users can register, write Markdown posts, comment, and
manage their profile. It has a **React + TypeScript** frontend and an **Express + Prisma +
PostgreSQL** backend, secured with **JWT authentication** and **bcrypt** password hashing.

---

## Live Demo

| | URL |
|--|--|
| **Frontend (Netlify)** | <https://lively-hummingbird-77986f.netlify.app> |
| **Backend API (Railway)** | <https://blog-website-assesment-production.up.railway.app/api> |
| **API health check** | <https://blog-website-assesment-production.up.railway.app/api/health> |

> The backend is hosted on a free tier and may take ~30–50 seconds to wake up on the first
> request after a period of inactivity.

---

## Features

### Core
- **Authentication** — register, login, logout with JWT; passwords hashed with bcrypt.
- **Posts** — full CRUD. Posts support **Markdown** content, an optional category, author
  info, and publication date.
- **Authorization** — only a post's (or comment's) author can edit or delete it, enforced by
  backend middleware **and** reflected in the UI.
- **Comments** — add, edit, and delete comments on a post (author-only edit/delete).
- **Profile** — view your profile and a paginated list of your own posts.
- **Validation & error handling** — request validation with Zod and a centralized error
  handler with clear, consistent messages.
- **Responsive design** — works on desktop, tablet, and mobile.

### Plus points
- **Search** — find posts by title or content.
- **Pagination** — server-driven pagination on listings.
- **Markdown rendering** — write posts in Markdown, rendered with GitHub-flavored Markdown.
- **Profile pictures** — upload an avatar (stored on Cloudinary).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Axios, react-markdown |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (e.g. [Neon](https://neon.com)) |
| Auth | JWT + bcrypt |
| Image storage | Cloudinary |

---

## Project Structure

```
.
├── server/                  # Backend API
│   ├── prisma/              # Prisma schema + migrations
│   └── src/
│       ├── config/          # Prisma client, Cloudinary
│       ├── routes/          # Route definitions
│       ├── controllers/     # HTTP layer (req/res only)
│       ├── services/        # Business logic & authorization
│       ├── repositories/    # Data access (Prisma queries)
│       ├── middleware/      # auth, validation, error handler, upload
│       ├── types/           # Zod schemas + DTOs
│       ├── utils/           # JWT, AppError
│       ├── app.ts           # Express app
│       └── server.ts        # Entry point
│
└── client/                  # Frontend (Vite + React)
    └── src/
        ├── api/             # Axios client + per-domain API modules
        ├── context/         # Auth context/provider
        ├── hooks/           # useAuth
        ├── components/      # Reusable UI (Navbar, PostCard, etc.)
        ├── pages/           # Route pages
        ├── types/           # Shared types
        └── utils/           # Helpers (errors, dates, text)
```

The backend follows a layered architecture: **routes → controllers → services →
repositories → Prisma**, so each layer has a single responsibility.

---

## Getting Started

### Prerequisites
- **Node.js** 20.19+ or 22.12+
- A **PostgreSQL** database (a free [Neon](https://neon.com) project works well)
- *(Optional)* a [Cloudinary](https://cloudinary.com) account for avatar uploads

### 1. Backend

```bash
cd server
npm install

# Create your env file and fill in the values (see "Environment Variables")
cp .env.example .env

# Create the database tables
npx prisma migrate dev

# Start the API on http://localhost:5000
npm run dev
```

### 2. Frontend

```bash
cd client
npm install

# Create your env file (defaults to the local API)
cp .env.example .env

# Start the app on http://localhost:5173
npm run dev
```

Open <http://localhost:5173> in your browser.

---

## Environment Variables

### `server/.env`
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `PORT` | API port (default `5000`) |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name *(optional)* |
| `CLOUDINARY_API_KEY` | Cloudinary API key *(optional)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret *(optional)* |

> Avatar upload is optional — the rest of the app runs without Cloudinary configured.

### `client/.env`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the backend API (default `http://localhost:5000/api`) |

---

## API Reference

Base URL: `http://localhost:5000/api`. Protected routes require an
`Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Log in and receive a token |
| POST | `/auth/logout` | — | Log out |
| GET | `/auth/me` | ✓ | Get the current user |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts?search=&author=&page=&limit=` | — | List posts (search + pagination) |
| GET | `/posts/:id` | — | Get a single post |
| POST | `/posts` | ✓ | Create a post |
| PUT | `/posts/:id` | ✓ (author) | Update a post |
| DELETE | `/posts/:id` | ✓ (author) | Delete a post |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts/:id/comments` | — | List a post's comments |
| POST | `/posts/:id/comments` | ✓ | Add a comment |
| PUT | `/comments/:id` | ✓ (author) | Edit a comment |
| DELETE | `/comments/:id` | ✓ (author) | Delete a comment |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/:id` | — | Get a public user profile |
| POST | `/users/me/avatar` | ✓ | Upload a profile picture (multipart, field `avatar`) |

---

## Available Scripts

### Backend (`server/`)
| Script | Action |
|--------|--------|
| `npm run dev` | Start the API with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run migrate` | Run Prisma migrations |
| `npm run studio` | Open Prisma Studio |

### Frontend (`client/`)
| Script | Action |
|--------|--------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |

---

## Design Decisions & Assumptions

- **Layered backend architecture** (routes → controllers → services → repositories) for clear
  separation of concerns. The repository layer is the only place that touches Prisma, so the
  data source could be swapped without changing business logic.
- **Custom JWT authentication** (rather than a managed auth provider) to satisfy the brief's
  explicit requirements: bcrypt password hashing and dedicated `/auth/register`, `/auth/login`,
  `/auth/logout` routes. The token is returned in the response and sent back via the
  `Authorization` header; an httpOnly cookie is also set for convenience.
- **Authorization is strict per the brief**: only the *author* of a post or comment can edit or
  delete it. A post's author cannot moderate other users' comments — the spec limits comment
  edit/delete to the comment's own author.
- **PostgreSQL + Prisma** instead of MongoDB. The brief allows "your preferred stack"; Prisma's
  schema also serves as the database design document, and it is hosted on a managed Postgres
  (Neon).
- **Cloudinary** is used only for profile-picture storage (the single image feature in the
  brief). Avatar upload degrades gracefully (returns `503`) when Cloudinary is not configured.
- **Deployment**: the backend runs on **Railway** and the frontend on **Netlify**. The brief
  suggests "a platform like Heroku"; Railway is used as an equivalent since Heroku no longer has
  a free tier.
- **Validation & errors**: request bodies are validated with Zod, and a single centralized error
  handler maps validation, Prisma, and application errors to consistent JSON responses.
- **Assumptions**: the home-page "description" is an excerpt derived from the post content;
  category is optional; passwords must be at least 6 characters; emails are unique; listings are
  paginated (6 per page on the home feed, 5 per page on a profile).

---

## Notes
- JWTs are sent in the `Authorization` header; the backend also sets an httpOnly cookie as a
  convenience.
- All passwords are hashed with bcrypt and never returned by the API.
- Deleting a user cascades to their posts and comments; deleting a post cascades to its
  comments.
