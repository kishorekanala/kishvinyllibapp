// Cloudinary/Image Storage Integration
// Handles image uploads, optimization, and CDN delivery

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Generate a Cloudinary URL with transformations
 * @param publicId - The Cloudinary public_id
 * @param options - Transformation options
 */
export function generateCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    crop?: 'fill' | 'fit' | 'crop';
    format?: 'auto' | string;
  } = {}
): string {
  if (!publicId) return '';

  const {
    width = 800,
    height = 800,
    quality = 'auto',
    crop = 'fill',
    format = 'auto',
  } = options;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Build transformation string
  const transforms = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',');

  return `${baseUrl}/v1/${transforms}/${publicId}`;
}

/**
 * Upload image to Cloudinary using unsigned upload
 * Requires NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to be set
 */
export async function uploadImageToCloud(file: File): Promise<CloudinaryUploadResponse | null> {
  try {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name not configured');
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'auto');
    formData.append('folder', 'vinyl-collection'); // Organize uploads in folder

    const response = await fetch(
      `${CLOUDINARY_URL}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload error:', error);
      throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
}

/**
 * Delete image from Cloudinary using server-side API
 * Must be called from backend to use API secret
 */
export async function deleteImageFromCloud(publicId: string): Promise<boolean> {
  try {
    // Use server-side endpoint for deletion
    // (requires API secret which should only be used on server)
    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}
