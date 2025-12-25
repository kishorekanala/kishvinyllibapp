'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { VinylRecord } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function VinylDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vinylId = params.id as string;

  const [record, setRecord] = useState<VinylRecord | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vinyl/${vinylId}`);
        const data = await response.json();
        setRecord(data.data);
      } catch (error) {
        console.error('Failed to fetch record:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vinylId) {
      fetchRecord();
    }
  }, [vinylId]);

  if (isLoading) return <LoadingSpinner />;
  if (!record) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Record not found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 text-violet-600 dark:text-violet-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const currentImage = record.images?.[currentImageIndex];
  const hasImages = record.images && record.images.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {hasImages ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                {currentImage && (
                  <Image
                    src={currentImage.imageUrl}
                    alt={currentImage.altText || record.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {/* Image Navigation */}
              {record.images.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev - 1 + record.images.length) % record.images.length
                      )
                    }
                    className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    ← Previous
                  </button>
                  <div className="flex-1 flex gap-2 overflow-x-auto">
                    {record.images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          idx === currentImageIndex
                            ? 'border-violet-500'
                            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev + 1) % record.images.length)
                    }
                    className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Image Counter */}
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Image {currentImageIndex + 1} of {record.images.length}
              </p>
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💿</div>
                <p className="text-slate-500 dark:text-slate-400">No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {record.title}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {record.artist}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {record.year && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Release Year</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {record.year}
                </p>
              </div>
            )}
            {record.genre && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Genre</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {record.genre}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {record.description && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {record.description}
              </p>
            </div>
          )}

          {/* Images Info */}
          {hasImages && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This album has {record.images.length} image{record.images.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
