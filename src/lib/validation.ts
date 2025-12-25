import { z } from 'zod';

// Vinyl Record Schemas
export const createVinylRecordSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  artist: z.string().min(1, 'Artist is required').max(255),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  genre: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
});

export const updateVinylRecordSchema = createVinylRecordSchema.partial();

// Image Schemas
export const createVinylImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  imagePublicId: z.string().min(1, 'Image public ID is required'),
  altText: z.string().max(500).optional(),
});

export const reorderImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().positive(),
    })
  ),
});

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Type exports
export type CreateVinylRecordInput = z.infer<typeof createVinylRecordSchema>;
export type UpdateVinylRecordInput = z.infer<typeof updateVinylRecordSchema>;
export type CreateVinylImageInput = z.infer<typeof createVinylImageSchema>;
export type ReorderImagesInput = z.infer<typeof reorderImagesSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
