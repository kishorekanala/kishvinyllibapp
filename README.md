# Vinyl Record Web Application

A modern, full-stack web application for managing and browsing a vinyl record collection with admin and user modes.

## Features

### Admin Mode
- User authentication (email/password)
- Add new vinyl records with metadata (title, artist, year, genre, description)
- Upload multiple images per vinyl record
- Add more images to existing vinyl records
- Drag-drop image reordering
- Edit vinyl record details
- Delete complete vinyl records with confirmation
- Delete individual images from vinyl records

### User Mode
- View all vinyl records in a modern gallery layout
- Click to view full vinyl record details with image carousel
- Search by title, artist, or genre
- Filter by genre or year
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary or Vercel Blob
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for image storage) or Vercel Blob access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kishorekanala/kishvinyllibapp.git
cd kishvinyllibapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Project Structure
```
kishvinyllibapp/
├── app/                    # Next.js app router
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   └── page.tsx           # Home/gallery page
├── components/            # Reusable React components
│   ├── admin/
│   ├── user/
│   ├── shared/
│   └── ui/
├── lib/                   # Utility functions
├── types/                 # TypeScript definitions
├── prisma/               # Database schema
└── public/               # Static assets
```

### Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database migrations
npx prisma migrate dev
npx prisma studio       # Open Prisma Studio

# Linting
npm run lint
```

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

For detailed instructions, see [Vercel Documentation](https://vercel.com/docs/getting-started-with-vercel).

## Documentation

See [PLAN.md](./PLAN.md) for the complete project plan and technical specifications.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
