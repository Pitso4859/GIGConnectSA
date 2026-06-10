# GIGConnect SA — Informal Worker Marketplace

> Connecting skilled informal workers with clients across South Africa.  
> Built with Spring Boot 3, React 18, Gemini AI, Docker, and deployed on Render.com.

---

## Table of Contents
1. [Architecture Overview](#architecture)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Quick Start — Local Development](#quick-start)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Render Deployment](#render-deployment)
10. [SDLC Approach](#sdlc)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  React 18 + Vite + Tailwind CSS + Zustand                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼────────────────────────────────────┐
│  Spring Boot 3.3 (Port 8080)                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Auth    │  │  REST APIs   │  │  Gemini AI Service    │  │
│  │  JWT +   │  │  /api/v1/*   │  │  google gemini-1.5    │  │
│  │  Refresh │  │              │  │  -flash               │  │
│  └──────────┘  └──────────────┘  └───────────────────────┘  │
│  Spring Security  │  JPA + Flyway  │  OkHttp Client         │
└───────────────────┼────────────────┼────────────────────────┘
                    │                │
          ┌─────────▼──────┐   ┌─────▼────────────┐
          │  PostgreSQL 16  │   │  Google Gemini   │
          │  (Render DB /  │   │  API             │
          │   local)       │   └──────────────────┘
          └────────────────┘
```

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, Zustand       |
| Backend    | Spring Boot 3.3, Java 21, Spring Security, JPA          |
| Database   | PostgreSQL 16 + Flyway migrations                       |
| Auth       | JWT (15 min access) + Refresh tokens (7 days, rotated)  |
| AI         | Google Gemini 1.5 Flash via REST (OkHttp)               |
| CI/CD      | GitHub Actions + Jenkins + Docker + Render.com          |
| DevOps     | Docker, docker-compose, multi-stage builds              |

---

## Project Structure

```
gigconnect/
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/gigconnect/
│   │   ├── config/                   # Security, CORS, OpenAPI
│   │   ├── controller/               # REST endpoints (versioned)
│   │   ├── dto/                      # Request / Response DTOs
│   │   ├── entity/                   # JPA entities
│   │   ├── exception/                # Global error handling
│   │   ├── repository/               # Spring Data JPA
│   │   ├── security/                 # JWT filter, UserDetails
│   │   └── service/                  # Business logic + AI
│   └── src/main/resources/
│       ├── application.yml           # Config (env-var driven)
│       └── db/migration/             # Flyway SQL scripts
│
├── frontend/                         # React SPA
│   └── src/
│       ├── components/               # Reusable UI + SVG Icons
│       ├── pages/                    # Auth, Dashboard, Jobs, AI…
│       ├── services/                 # Axios API layer
│       ├── store/                    # Zustand auth store
│       └── types/                    # TypeScript interfaces
│
└── cicd/                             # DevOps
    ├── Dockerfile.backend            # Multi-stage Java build
    ├── Dockerfile.frontend           # Multi-stage Node + Nginx
    ├── docker-compose.yml            # Local dev stack
    ├── nginx.conf                    # SPA routing + caching
    ├── render.yaml                   # Render.com blueprint
    └── .github/workflows/ci-cd.yml   # GitHub Actions pipeline
        jenkins/Jenkinsfile           # Jenkins pipeline
```

---

## Features

### Core
- **Job Board** — browse, filter by category/status/search, paginated
- **Job Lifecycle** — OPEN → IN_PROGRESS → AWAITING_APPROVAL → COMPLETED
- **Proof Submission** — worker submits photo + GPS location as proof
- **Escrow Payments** — wallet-based; funds released only on approval
- **Leaderboard** — ranked workers with ELITE/GOLD/SILVER/BRONZE/NEWCOMER badges
- **Ratings** — mutual rating system post-job-completion

### Security
- JWT access tokens (15 min) + rotating refresh tokens (7 days)
- BCrypt password hashing (cost factor 12)
- Role-based access control: WORKER / CLIENT / ADMIN
- `@PreAuthorize` method-level security
- HttpOnly cookie-ready refresh token rotation
- Global exception handler with structured error responses

### AI (GigAssist)
- Powered by **Gemini 1.5 Flash**
- Context-aware: knows user's name, role, location
- SA-specific system prompt: labour law, CCMA, informal economy
- Chat history persisted to PostgreSQL (last 20 messages as context)
- Streaming typing indicator in UI

---

## Quick Start

### Prerequisites
- Java 21+, Maven 3.9+
- Node 20+, npm 10+
- Docker + Docker Compose
- PostgreSQL 16 (or use Docker)

### 1. Clone & configure

```bash
git clone https://github.com/your-org/gigconnect-sa.git
cd gigconnect-sa
cp .env .env
# Edit .env — set GEMINI_API_KEY and JWT_SECRET
```

### 2. Run with Docker Compose (easiest)

```bash
docker-compose -f cicd/docker-compose.yml up -d
# Frontend → http://localhost:3000
# Backend  → http://localhost:8080/api/v1
```

### 3. Run individually

**Backend:**
```bash
cd backend
export DATABASE_URL=jdbc:postgresql://localhost:5432/gigconnect
export GEMINI_API_KEY=your-key
export JWT_SECRET=your-32-char-secret
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

| Variable                    | Required | Description                              |
|-----------------------------|----------|------------------------------------------|
| `DATABASE_URL`              | ✅       | JDBC connection string                   |
| `DATABASE_USERNAME`         | ✅       | DB username                              |
| `DATABASE_PASSWORD`         | ✅       | DB password                              |
| `JWT_SECRET`                | ✅       | ≥32 char secret for HMAC-SHA256          |
| `GEMINI_API_KEY`            | ✅       | Google AI Studio API key                 |
| `CORS_ORIGINS`              | ✅       | Comma-separated allowed origins          |
| `PORT`                      | —        | HTTP port (default: 8080)                |
| `DOCKER_HUB_USERNAME`       | CI/CD    | Docker Hub login                         |
| `DOCKER_HUB_TOKEN`          | CI/CD    | Docker Hub access token                  |
| `RENDER_DEPLOY_HOOK_BACKEND`| CI/CD    | Render webhook URL                       |
| `RENDER_DEPLOY_HOOK_FRONTEND`| CI/CD   | Render webhook URL                       |

---

## API Reference

All endpoints prefixed with `/api/v1`

### Auth
| Method | Endpoint              | Auth  | Description          |
|--------|-----------------------|-------|----------------------|
| POST   | `/auth/register`      | ❌    | Register new user    |
| POST   | `/auth/login`         | ❌    | Login → JWT pair     |
| POST   | `/auth/refresh`       | ❌    | Rotate refresh token |
| POST   | `/auth/logout`        | ✅    | Revoke refresh token |

### Jobs
| Method | Endpoint              | Role        | Description            |
|--------|-----------------------|-------------|------------------------|
| GET    | `/jobs`               | Public      | List jobs (filtered)   |
| GET    | `/jobs/{id}`          | Public      | Job detail             |
| GET    | `/jobs/my`            | Any         | My jobs                |
| POST   | `/jobs`               | CLIENT      | Post a job             |
| PATCH  | `/jobs/{id}/accept`   | WORKER      | Accept open job        |
| PATCH  | `/jobs/{id}/submit-proof` | WORKER  | Submit completion proof|
| PATCH  | `/jobs/{id}/approve`  | CLIENT      | Approve + pay worker   |
| PATCH  | `/jobs/{id}/cancel`   | CLIENT/WORKER| Cancel job            |

### Users
| Method | Endpoint              | Auth | Description         |
|--------|-----------------------|------|---------------------|
| GET    | `/users/me`           | ✅   | My profile          |
| PUT    | `/users/me`           | ✅   | Update profile      |
| GET    | `/users/workers`      | ✅   | Search workers      |

### Wallet & Ratings
| Method | Endpoint        | Auth | Description        |
|--------|-----------------|------|--------------------|
| GET    | `/wallet`       | ✅   | Balance + history  |
| POST   | `/ratings`      | ✅   | Submit rating      |
| GET    | `/leaderboard`  | Public | Top workers      |

### AI Chat
| Method | Endpoint        | Auth | Description        |
|--------|-----------------|------|--------------------|
| POST   | `/ai/chat`      | ✅   | Send message       |
| GET    | `/ai/history`   | ✅   | Chat history       |
| DELETE | `/ai/history`   | ✅   | Clear history      |

---

## CI/CD Pipeline

```
GitHub Push (main)
       │
       ▼
GitHub Actions
  ├── backend-ci    → mvn test + mvn package
  ├── frontend-ci   → npm ci + npm run build
  └── docker-build  → multi-stage builds → push to Docker Hub
       │
       ▼
Jenkins (optional orchestrator)
  └── Triggers same stages via Jenkinsfile
       │
       ▼
Deploy to Render.com
  ├── POST render deploy hook (backend)
  └── POST render deploy hook (frontend)
       │
       ▼
Health Check → https://gigconnect-api.onrender.com/api/v1/actuator/health
```

### Required GitHub Secrets
```
DOCKER_HUB_USERNAME
DOCKER_HUB_TOKEN
RENDER_DEPLOY_HOOK_BACKEND
RENDER_DEPLOY_HOOK_FRONTEND
```

---

## Render Deployment

### One-click deploy with Blueprint
1. Fork this repo
2. Go to [Render Dashboard](https://dashboard.render.com) → **New Blueprint**
3. Connect your repo — Render reads `cicd/render.yaml` automatically
4. Set `GEMINI_API_KEY` manually in the backend service's Environment tab
5. Deploy!

### Manual deploy
```bash
# Backend: Web Service → Docker → Dockerfile: cicd/Dockerfile.backend
# Frontend: Web Service → Docker → Dockerfile: cicd/Dockerfile.frontend
# Database: PostgreSQL → link to backend via DATABASE_URL
```

---

## SDLC

This project follows a standard SDLC:

| Phase      | Artifact                                          |
|------------|---------------------------------------------------|
| Plan       | User stories, ERD, API contract                   |
| Design     | Component architecture, DB schema (Flyway V1)     |
| Build      | Feature branches, PR reviews, conventional commits|
| Test       | JUnit 5 (unit), Spring Boot Test (integration)    |
| Deploy     | Docker → GitHub Actions → Render                  |
| Monitor    | Spring Actuator `/health`, `/metrics`, `/info`    |

### Branch strategy
```
main       → production
develop    → staging / integration
feature/*  → individual features (PR → develop)
hotfix/*   → urgent production fixes (PR → main)
```
