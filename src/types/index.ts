// Vinyl Record Types
export interface VinylRecord {
  id: string
  title: string
  artist: string
  year?: number | null
  genre?: string | null
  description?: string | null
  images: VinylImage[]
  createdAt: Date
  updatedAt: Date
}

export interface VinylImage {
  id: string
  vinylRecordId: string
  imageUrl: string
  imagePublicId: string
  altText?: string | null
  displayOrder: number
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface VinylRecordResponse extends ApiResponse<VinylRecord> {}

export interface VinylRecordsResponse extends ApiResponse<VinylRecord[]> {}

export interface VinylImageResponse extends ApiResponse<VinylImage> {}

export interface VinylImagesResponse extends ApiResponse<VinylImage[]> {}

// Request payload types
export interface CreateVinylRecordPayload {
  title: string
  artist: string
  year?: number
  genre?: string
  description?: string
}

export interface UpdateVinylRecordPayload {
  title?: string
  artist?: string
  year?: number
  genre?: string
  description?: string
}

export interface CreateVinylImagePayload {
  imageUrl: string
  imagePublicId: string
  altText?: string
  displayOrder: number
}

export interface UpdateImageOrderPayload {
  id: string
  displayOrder: number
}

// User/Auth Types
export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: Date
  updatedAt: Date
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name?: string
}
