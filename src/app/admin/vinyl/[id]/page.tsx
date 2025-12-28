'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { VinylRecord } from '@/types';
import { VinylForm } from '@/components/admin/VinylForm';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';

export default function VinylDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vinylId = params.id as string;

  const [record, setRecord] = useState<VinylRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVinylRecord();
  }, [vinylId]);

  const loadVinylRecord = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getVinylRecord(vinylId);
      setRecord(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesUpload = async (images: any[]) => {
    // Reload the record to show new images
    await loadVinylRecord();
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setError(null);
      await apiClient.deleteImage(imageId);
      // Reload record to refresh images
      await loadVinylRecord();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-600 dark:text-red-400">Record not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 text-violet-600 dark:text-violet-400 hover:underline"
      >
        ← Back
      </button>

      {/* Edit Form */}
      <VinylForm
        initialData={record}
        onSuccess={(updatedRecord) => {
          setRecord(updatedRecord);
        }}
        onCancel={() => router.back()}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Image Upload */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Add Images
          </h2>
          <ImageUpload
            vinylId={vinylId}
            onImagesUpload={handleImagesUpload}
            existingImages={record.images || []}
          />
        </div>

        {/* Record Info Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Record Summary
          </h2>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <p><strong>Title:</strong> {record.title}</p>
            <p><strong>Artist:</strong> {record.artist}</p>
            {record.year && <p><strong>Year:</strong> {record.year}</p>}
            {record.genre && <p><strong>Genre:</strong> {record.genre}</p>}
            {record.description && (
              <p><strong>Description:</strong> {record.description}</p>
            )}
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            <strong>Total Images:</strong> {record.images?.length || 0}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Images Gallery */}
      {record.images && record.images.length > 0 && (
        <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Current Images ({record.images.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {record.images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.imageUrl}
                    alt="Vinyl"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
                  title="Delete image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
