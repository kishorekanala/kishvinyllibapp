'use client';

import { VinylRecord } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface VinylCardProps {
  record: VinylRecord;
}

export function VinylCard({ record }: VinylCardProps) {
  const firstImage = record.images?.[0];

  return (
    <Link href={`/vinyl/${record.id}`}>
      <div className="group cursor-pointer rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
        {/* Image Container */}
        <div className="relative h-64 bg-slate-200 dark:bg-slate-700 overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage.imageUrl}
              alt={firstImage.altText || record.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">💿</div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No images</p>
              </div>
            </div>
          )}
          
          {/* Image Count Badge */}
          {record.images && record.images.length > 0 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {record.images.length} {record.images.length === 1 ? 'image' : 'images'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
            {record.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {record.artist}
          </p>
          
          <div className="flex items-center justify-between">
            {record.year && (
              <span className="text-xs text-slate-500 dark:text-slate-500">
                {record.year}
              </span>
            )}
            {record.genre && (
              <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">
                {record.genre}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
