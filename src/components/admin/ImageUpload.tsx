'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { VinylImage } from '@/types';
import { uploadImageToCloud } from '@/lib/cloudinary';

interface ImageUploadProps {
  vinylId: string;
  onImagesUpload: (images: VinylImage[]) => void;
  existingImages?: VinylImage[];
}

export function ImageUpload({ vinylId, onImagesUpload, existingImages = [] }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<Array<{ file: File; preview: string }>>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    for (const file of files) {
      if (file.size > maxFileSize) {
        setError(`File ${file.name} is too large (max 10MB)`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} has unsupported format`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPreviewImages(prev => [...prev, ...newPreviews]);
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  const removePreview = (index: number) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (previewImages.length === 0) {
      setError('No images selected');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload images to Cloudinary first
      const uploadedImages: Array<{ url: string; publicId: string; altText: string }> = [];
      
      for (let i = 0; i < previewImages.length; i++) {
        const { file } = previewImages[i];
        
        // Update progress
        setUploadProgress(Math.round((i / previewImages.length) * 100));

        // Upload to Cloudinary
        const result = await uploadImageToCloud(file);
        
        if (!result) {
          throw new Error(`Failed to upload ${file.name} to Cloudinary`);
        }

        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          altText: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        });
      }

      // Save to database with Cloudinary URLs
      const response = await fetch(`/api/vinyl/${vinylId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save images');
      }

      const data = await response.json();
      onImagesUpload(data.images);

      // Clear previews
      previewImages.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
      setPreviewImages([]);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
        }`}
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-18-8l6 6m0 0l-6-6m6 6v16"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
          Drag and drop images here or click to select
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          Supported: JPEG, PNG, WebP, GIF (max 10MB each)
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded-md transition inline-block"
        >
          Select Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Preview images */}
      {previewImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Selected Images ({previewImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewImages.map((item, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <Image
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Current Images ({existingImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map(img => (
              <div key={img.id} className="relative rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                <div className="aspect-square relative">
                  <Image
                    src={img.imageUrl}
                    alt={img.altText || 'Album image'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <span className="text-white text-xs font-medium">Order: {img.displayOrder}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      {previewImages.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {isUploading ? `Uploading... ${uploadProgress}%` : `Upload ${previewImages.length} Image${previewImages.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  );
}
