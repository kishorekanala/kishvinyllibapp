'use client';

import { VinylRecord } from '@/types';
import { VinylCard } from './VinylCard';
import { LoadingSkeletonCard } from '../shared/LoadingSpinner';

interface VinylGalleryProps {
  records: VinylRecord[];
  isLoading?: boolean;
}

export function VinylGallery({ records, isLoading = false }: VinylGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <LoadingSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎵</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No Vinyl Records Yet
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Check back soon for an amazing collection of vinyl records!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {records.map((record) => (
        <VinylCard key={record.id} record={record} />
      ))}
    </div>
  );
}
