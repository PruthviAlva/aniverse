# 🎌 AniVerse

A production-ready Anime & Manga discovery platform.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Neon.tech) + Prisma ORM
- **APIs:** Jikan (MyAnimeList), AniList GraphQL

## Getting Started

### Prerequisites
- Node.js v18+
- Git

### Frontend
cd client
npm install
npm run dev

### Backend
cd server
npm install
npx prisma db push
npm run dev

## Environment Variables
Create a `.env` file in `/server` using `.env.example` as a template.