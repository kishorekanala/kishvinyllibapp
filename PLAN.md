# Vinyl Record Web Application - Project Plan

## Overview

Build a modern, full-stack web application for managing and browsing a vinyl record collection. The application features two distinct modes:
- **Admin Mode**: Add vinyl records with multiple images, manage collection
- **User Mode**: Browse and view the vinyl record collection with a modern, contemporary interface

---

## Technology Stack Recommendations

### Frontend
- **Framework**: Next.js 14+ (full-stack capability, excellent for modern UI)
- **Language**: TypeScript (type safety, better developer experience)
- **Styling**: Tailwind CSS (utility-first, modern aesthetic)
- **UI Components**: shadcn/ui (headless, highly customizable, zero-config)
- **Image Gallery**: next-image-gallery or react-medium-image-zoom (optimized image display)
- **Form Handling**: React Hook Form + Zod (type-safe form validation)
- **State Management**: TanStack Query (data fetching) or Zustand (simple state)

### Backend
- **Runtime**: Node.js with Express (or Next.js API Routes for simplicity)
- **Database**: PostgreSQL (structured, relational data, ACID compliance)
- **ORM**: Prisma (type-safe, excellent developer experience)
- **Authentication**: NextAuth.js (JWT-based, session management)
- **Image Storage**: Vercel Blob or Cloudinary (scalable, CDN-backed)

### Infrastructure & Deployment
- **Hosting**: Vercel (seamless Next.js deployment, serverless)
- **Database**: Vercel Postgres or Railway PostgreSQL
- **Version Control**: Git (already initialized)

---

## Database Schema

### Tables

#### `vinyl_records`
```
- id (UUID, primary key)
- title (string, required)
- artist (string, required)
- year (integer)
- genre (string)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `vinyl_images`
```
- id (UUID, primary key)
- vinyl_record_id (UUID, foreign key)
- image_url (string, required)
- image_public_id (string, for cloud storage reference)
- alt_text (string)
- display_order (integer)
- created_at (timestamp)
```

#### `users` (for admin authentication)
```
- id (UUID, primary key)
- email (string, unique, required)
- password_hash (string, required)
- role (enum: 'admin', 'user')
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Project Structure

```
kishvinyllibapp/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/gallery page (user mode)
│   ├── admin/
│   │   ├── layout.tsx             # Admin layout
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── vinyl/
│   │   │   ├── page.tsx           # Vinyl list management
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Edit vinyl record
│   │   │       └── edit.tsx
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       └── logout/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth].ts   # NextAuth configuration
│       │   └── login.ts           # Login endpoint
│       ├── vinyl/
│       │   ├── route.ts           # GET all, POST new vinyl
│       │   └── [id]/route.ts      # GET, PUT, DELETE specific vinyl
│       ├── images/
│       │   ├── route.ts           # POST image upload
│       │   └── [id]/route.ts      # DELETE image
│       └── upload/
│           └── route.ts           # Image upload handler (Cloudinary/S3)
├── components/
│   ├── admin/
│   │   ├── VinylForm.tsx          # Form to add/edit vinyl
│   │   ├── ImageUpload.tsx        # Drag-drop image upload
│   │   ├── VinylList.tsx          # List of vinyl records
│   │   └── AdminNav.tsx           # Admin navigation
│   ├── user/
│   │   ├── VinylGallery.tsx       # Main gallery view
│   │   ├── VinylCard.tsx          # Individual vinyl card
│   │   ├── VinylDetail.tsx        # Detail modal/page
│   │   └── SearchFilter.tsx       # Search and filter
│   ├── shared/
│   │   ├── Navigation.tsx         # Main navigation
│   │   ├── Footer.tsx
│   │   └── LoadingSpinner.tsx
│   └── ui/
│       └── [shadcn components]    # Button, Input, Modal, etc.
├── lib/
│   ├── auth.ts                    # Auth utilities
│   ├── db.ts                      # Prisma client
│   ├── api-client.ts              # API utilities
│   └── cloudinary.ts              # Image service integration
├── types/
│   ├── index.ts                   # TypeScript types/interfaces
│   └── vinyl.ts
├── middleware.ts                  # Authentication middleware
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── public/
│   └── [static assets]
├── .env.local                     # Environment variables (local)
├── .env.example                   # Template for env variables
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## Implementation Phases

### Phase 1: Project Setup (Week 1)
- Initialize Next.js 14 project with TypeScript
- Configure Tailwind CSS and shadcn/ui
- Set up Git repository with proper .gitignore
- Create basic folder structure
- Set up environment variables template

### Phase 2: Database & Backend (Week 1-2)
- Create PostgreSQL database (Vercel Postgres or Railway)
- Set up Prisma ORM with schema
- Create database migrations
- Build API routes for vinyl records (CRUD)
- Build API routes for images
- Implement error handling and validation

### Phase 3: Authentication (Week 2)
- Set up NextAuth.js
- Create login/logout flows
- Implement admin middleware
- Create admin authentication UI

### Phase 4: Admin Dashboard (Week 2-3)
- Build vinyl record form (add/edit)
- Implement image upload with drag-drop
- Build add images to existing vinyl records feature
- Create vinyl list management view
- Add delete/edit functionality
- Set up form validation

### Phase 5: User Interface (Week 3-4)
- Design and build modern gallery/grid layout
- Create vinyl card components
- Implement detail view (modal or dedicated page)
- Add search and filter functionality
- Optimize for responsive design

### Phase 6: Image Management (Week 4)
- Integrate Cloudinary or Vercel Blob
- Set up image optimization
- Implement image ordering for multiple images
- Handle image deletion

### Phase 7: Testing & Deployment (Week 4-5)
- Test authentication and authorization
- Test upload and gallery functionality
- Deploy to Vercel
- Set up custom domain (optional)
- Performance optimization

---

## Key Features to Implement

### Admin Panel
- ✅ User authentication (email/password)
- ✅ Add new vinyl records with details (title, artist, year, genre, description)
- ✅ Upload multiple images per vinyl record during creation
- ✅ Add more images to existing vinyl records
- ✅ Drag-drop image reordering
- ✅ Edit vinyl record details
- ✅ Delete complete vinyl records with confirmation dialog
- ✅ Delete individual images from vinyl records
- ✅ Dashboard showing all vinyl records with thumbnail previews
- ✅ Form validation and error handling

### User Gallery
- ✅ View all vinyl records in a modern grid/gallery layout
- ✅ Click to view full vinyl record details (with all images in a carousel)
- ✅ Search by title, artist, or genre
- ✅ Filter by genre or year
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Image optimization for fast loading
- ✅ Smooth animations and transitions

### Modern UI/UX Elements
- ✅ Clean, minimal design with good typography
- ✅ Smooth transitions and hover effects
- ✅ Loading states and error boundaries
- ✅ Mobile-first responsive design
- ✅ Dark mode support (optional)
- ✅ Accessibility (WCAG standards)

---

## Image Management Workflows

### Adding More Images to Existing Vinyl Records

#### User Flow
1. Admin navigates to Vinyl List in admin dashboard
2. Admin finds the vinyl record and clicks "Edit" or "Add Images" button
3. Edit page loads showing:
   - Vinyl record details (title, artist, etc.) - read-only or editable
   - Current images gallery with thumbnails
   - "Add More Images" upload area (drag-drop or file picker)
4. Admin drags files or selects files to upload
5. Images are uploaded and appear in gallery in real-time
6. Admin can reorder images by dragging
7. Admin can delete individual images
8. Admin clicks "Save" or changes auto-save
9. Success notification shows new images have been added

#### Backend Implementation
- **POST `/api/vinyl/[id]/images`** endpoint:
  - Verify admin authentication
  - Fetch vinyl record by ID (validate it exists)
  - Accept multiple image files
  - Upload images to Cloudinary/Vercel Blob
  - Create vinyl_images records with:
    - vinyl_record_id (from URL parameter)
    - image_url (from cloud storage)
    - image_public_id (for future deletion)
    - alt_text (optional, from metadata)
    - display_order (auto-calculated: current max + 1, 2, 3, etc.)
  - Return array of created images with IDs and URLs

- **GET `/api/vinyl/[id]/images`** endpoint:
  - Fetch all images for a vinyl record
  - Return ordered by display_order
  - Include image IDs, URLs, and metadata

#### Frontend Components
- **VinylEditPage.tsx**:
  - Display vinyl record being edited
  - Show existing images with thumbnail gallery
  - Include "Add More Images" section
  - Allow image reordering and deletion

- **ImageUpload.tsx** (Enhanced):
  - Support drag-drop for adding multiple images
  - Show upload progress
  - Display uploaded images immediately
  - Allow adding more images to existing set
  - Disable upload during processing
  - Show error messages if upload fails

- **ImageGallery.tsx** (New Component):
  - Display all current images for vinyl record
  - Allow drag-to-reorder images
  - Show delete button on hover
  - Display image count
  - Handle empty state

#### Database Considerations
```prisma
model VinylRecord {
  id String @id @default(cuid())
  title String
  artist String
  year Int?
  genre String?
  description String?
  images VinylImage[] @relation(onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model VinylImage {
  id String @id @default(cuid())
  vinylRecordId String
  vinylRecord VinylRecord @relation(fields: [vinylRecordId], references: [id])
  imageUrl String
  imagePublicId String  // For Cloudinary/Blob deletion
  altText String?
  displayOrder Int      // For custom ordering
  createdAt DateTime @default(now())
  
  @@unique([vinylRecordId, displayOrder])  // Ensure unique ordering per vinyl
  @@index([vinylRecordId])                  // Index for quick lookups
}
```

#### File Size & Image Limits
- **Max file size per image**: 10MB
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Max images per vinyl record**: 50 (or configurable)
- **Image validation**: Check dimensions (min 200x200, max 10000x10000)
- **Auto-optimization**: Compress via Cloudinary/Vercel Blob

#### Image Ordering
- When adding new images: assign display_order = max(current) + 1
- When reordering: update display_order values via PATCH endpoint
- When deleting: keep existing display_order values (no need to consolidate)
- Display always ordered by display_order ASC

#### Error Handling for Adding Images
- **Upload fails**: Show error message, allow retry
- **Vinyl record not found**: Display error, redirect to list
- **Quota exceeded**: Inform admin of limit reached
- **Invalid file type**: Reject before upload
- **Network error**: Queue for retry or manual intervention

---

## Deletion & Content Management Workflows

### Complete Vinyl Record Deletion

#### User Flow
1. Admin navigates to Vinyl List in admin dashboard
2. Admin clicks "Delete" button on a vinyl record card or in a details view
3. A confirmation modal appears with:
   - Warning message: "This will permanently delete this vinyl record and all associated images"
   - Show number of images that will be deleted
   - Two buttons: "Cancel" and "Delete Permanently"
4. On confirmation, the record is deleted from database and all associated images are removed from cloud storage
5. Gallery view updates, showing success notification

#### Backend Implementation
- **DELETE `/api/vinyl/[id]`** endpoint:
  - Verify admin authentication
  - Fetch vinyl record by ID
  - Get all associated images from vinyl_images table
  - Delete image files from Cloudinary/Vercel Blob
  - Delete all vinyl_images records
  - Delete vinyl_records record
  - Return success or error response
  - Handle cascading deletes via Prisma relations

#### Database Considerations
- Use Prisma cascade delete:
  ```prisma
  model VinylRecord {
    id String @id @default(cuid())
    images VinylImage[] @relation(onDelete: Cascade)
  }
  ```
- This ensures all images are automatically deleted when vinyl record is deleted

### Individual Image Deletion

#### User Flow
1. Admin views vinyl record details (edit mode)
2. Admin sees gallery of all images for that vinyl record
3. Admin hovers over an image to see delete button (X icon)
4. Admin clicks delete button on specific image
5. A small confirmation appears: "Delete this image?"
6. On confirmation, image is removed from gallery and cloud storage
7. Gallery updates showing remaining images with correct ordering

#### Backend Implementation
- **DELETE `/api/images/[id]`** endpoint:
  - Verify admin authentication
  - Fetch image record by ID
  - Delete image file from Cloudinary/Vercel Blob using image_public_id
  - Delete image record from vinyl_images table
  - Reorder remaining images (adjust display_order for consistency)
  - Return success or error response

#### Frontend Components
- **ImageUpload.tsx**:
  - Display image preview thumbnails
  - Show delete button on hover/focus
  - Confirm deletion before API call
  - Update local state to remove image immediately
  - Handle errors gracefully

- **VinylForm.tsx**:
  - Allow viewing images while editing vinyl record
  - Provide quick delete option for images
  - Maintain image ordering after deletion

### Deletion Safety Features

#### Confirmation Dialogs
- **Complete Record Deletion**: 
  - Modal dialog with prominent warning
  - Show count of images being deleted
  - Require explicit "Delete Permanently" button click
  - Disable default confirmation for safety

- **Individual Image Deletion**:
  - Quick confirmation (toast or small modal)
  - Inline delete button with icon
  - Undo option available for 5 seconds (optional)

#### Error Handling
- If Cloudinary/Blob deletion fails but database deletion succeeds:
  - Log error and retry failed deletions
  - Alert admin to manually verify
  - Provide admin interface to clean up orphaned images

- If database deletion fails but image file deleted:
  - Rollback image file deletion (restore from backup if possible)
  - Keep image record intact
  - Return error to user

#### Audit Trail (Optional)
- Log deletion events in an audit table:
  - User who deleted
  - Vinyl record ID and name
  - Images deleted count
  - Timestamp
  - Reason (if provided)

### API Endpoints for Deletion

```typescript
// Delete complete vinyl record
DELETE /api/vinyl/[id]
Request: { }
Response: { success: boolean, message: string }

// Delete individual image
DELETE /api/images/[id]
Request: { }
Response: { success: boolean, message: string, remainingImages: number }

// Soft delete (archive instead of delete) - Optional
PATCH /api/vinyl/[id]
Request: { action: "archive" }
Response: { success: boolean, status: "archived" }
```

### Image Ordering After Deletion
- When an image is deleted, remaining images maintain their display_order
- No need to reorder if using sequential ordering
- If using gaps in ordering, consolidate: (1, 2, 4, 5) → (1, 2, 3, 4)
- Update done via database transaction to ensure consistency

---

## Technical Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 14 | Full-stack, serverless, built-in API routes, great for modern UI |
| Language | TypeScript | Type safety, better DX, catches bugs early |
| Database | PostgreSQL | Structured data, ACID compliance, relational integrity |
| ORM | Prisma | Type-safe, excellent migrations, great dev experience |
| Styling | Tailwind CSS | Utility-first, no CSS file bloat, highly customizable |
| UI Library | shadcn/ui | Headless, zero config, modern components, customizable |
| Auth | NextAuth.js | Built for Next.js, session + JWT, minimal setup |
| Image Storage | Cloudinary/Vercel Blob | Automatic optimization, CDN, handles scaling |
| Deployment | Vercel | Seamless Next.js, serverless, auto-scaling |

---

## Environment Variables Needed

```
# Database
DATABASE_URL=postgresql://user:password@host:port/vinyl_db

# Authentication
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000 (development) or https://yourdomain.com (production)

# Image Storage (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Alternative: Vercel Blob
BLOB_READ_WRITE_TOKEN=your_token
```

---

## Success Criteria

- [x] Users can view all vinyl records in a modern gallery ✅ (Gallery page fully functional with 4 test records)
- [ ] Admins can log in securely (NextAuth.js needs final configuration)
- [x] Admins can add/edit/delete vinyl records ✅ (All CRUD endpoints tested and working)
- [ ] Admins can upload multiple images per record (Routes ready, image upload placeholder)
- [x] Images display properly in gallery ✅ (API returns images with records)
- [ ] Search and filter work smoothly (Components created, needs API integration)
- [ ] Application is responsive on all devices (Tailwind CSS configured, responsive classes applied)
- [ ] Application is fast (PageSpeed Insights > 90) (Build optimized, needs testing)
- [ ] Authentication is secure (NextAuth.js configured in .env, routes ready)
- [x] All data persists correctly ✅ (SQLite database working, migrations applied, seeded with test data)

---

## Dependencies Overview

### Core Dependencies
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.x",
  "@headlessui/react": "^1.x",
  "class-variance-authority": "^0.x",
  "clsx": "^2.x"
}
```

### Database & Backend
```json
{
  "@prisma/client": "^5.x",
  "bcryptjs": "^2.x",
  "jsonwebtoken": "^9.x"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@hookform/resolvers": "^3.x"
}
```

### Authentication
```json
{
  "next-auth": "^4.x"
}
```

### Image Management
```json
{
  "next-image-gallery": "^x.x",
  "cloudinary-next": "^1.x"
}
```

### Dev Dependencies
```json
{
  "prisma": "^5.x",
  "@types/react": "^18.x",
  "@types/node": "^20.x",
  "eslint": "^8.x"
}
```

---

## Next Steps

1. **Review & Approve** this plan - are you satisfied with the tech stack and approach?
2. **Clarify Any Points** - do you want any changes to the plan?
3. **Implementation** - once approved, project setup and development can begin
4. **Iterative Development** - build in phases, test frequently

---

## Questions for Refinement

1. **Admin Authentication**: Do you want email/password, or also support Google/GitHub OAuth?
2. **Image Limits**: Maximum images per vinyl record? Maximum file size?
3. **Additional Fields**: Any other vinyl record metadata beyond title, artist, year, genre?
4. **User Accounts**: Do regular users need accounts, or is public viewing enough?
5. **Dark Mode**: Should the app support dark mode toggle?
6. **Mobile Priority**: Should design be mobile-first or desktop-first?
7. **Budget**: Any preference for free/paid services (Cloudinary free vs. paid)?
