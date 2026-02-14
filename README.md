# Next School

Aplikasi manajemen sekolah berbasis web untuk mengelola data Kelas, Guru, dan Siswa dengan panel admin dan autentikasi JWT.

## Tech Stack

- **Next.js 16**
- **TypeScript**
- **SQLite**
- **Prisma**
- **JWT**
- **bcryptjs**
- **Tailwind CSS 4**, **shadcn/ui**, **Radix UI** — UI
- **Lucide React**

## Prasyarat

- **Node.js** >= 20
- **npm** (atau pnpm / yarn)

## Environment Variables

- `DATABASE_URL` (wajib) — `file:./dev.db`
- `JWT_SECRET` (wajib) — Secret key untuk JWT. Gunakan string acak yang panjang di produksi.

## Cara Menjalankan

```bash
npm install
npx prisma migrate dev
npm run dev
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000).
