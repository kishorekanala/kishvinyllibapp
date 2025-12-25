'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { VinylRecord, VinylImage } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function EditVinylPage() {
  const params = useParams();
  const router = useRouter();
  const vinylId = params.id as string;

  const [vinyl, setVinyl] = useState<VinylRecord | null>(null);
  const [images, setImages] = useState<VinylImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vinyl/${vinylId}`);
        const data = await response.json();
        if (data.data) {
          setVinyl(data.data);
          setImages(data.data.images || []);
        }
      } catch (err) {
        setError('Failed to load vinyl record');
      } finally {
        setIsLoading(false);
      }
    };

    if (vinylId) {
      loadData();
    }
  }, [vinylId]);

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const response = await fetch(`/api/vinyl/${vinylId}/images/${imageId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId));
      } else {
        setError('Failed to delete image');
      }
    } catch {
      setError('Failed to delete image');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!vinyl) return <div className="text-slate-500">Vinyl record not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {vinyl.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">by {vinyl.artist}</p>
        </div>
      </div>

      {/* Vinyl Details */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Year</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {vinyl.year || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Genre</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {vinyl.genre || 'N/A'}
            </p>
          </div>
          {vinyl.description && (
            <div className="col-span-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">Description</p>
              <p className="text-slate-700 dark:text-slate-300">{vinyl.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Current Images ({images.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map(img => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                    <img
                      src={img.imageUrl}
                      alt={img.altText || vinyl.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                    <p className="text-white text-sm font-semibold mb-2">#{img.displayOrder}</p>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
