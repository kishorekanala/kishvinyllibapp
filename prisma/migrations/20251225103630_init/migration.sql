-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "vinyl_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" INTEGER,
    "genre" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "vinyl_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vinylRecordId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vinyl_images_vinylRecordId_fkey" FOREIGN KEY ("vinylRecordId") REFERENCES "vinyl_records" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vinyl_images_vinylRecordId_idx" ON "vinyl_images"("vinylRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "vinyl_images_vinylRecordId_displayOrder_key" ON "vinyl_images"("vinylRecordId", "displayOrder");
