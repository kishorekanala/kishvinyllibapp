'use client';

import { useEffect, useState, useMemo } from 'react';
import { VinylRecord } from '@/types';
import { apiClient } from '@/lib/api-client';
import { VinylGallery } from '@/components/user/VinylGallery';
import { SearchFilter } from '@/components/user/SearchFilter';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Home() {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Fetch vinyl records on mount
  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      const data = await apiClient.getVinylRecords();
      setRecords(data);
      setIsLoading(false);
    };

    fetchRecords();
  }, []);

  // Extract unique genres
  const genres = useMemo(() => {
    return Array.from(new Set(
      records
        .filter(r => r.genre)
        .map(r => r.genre as string)
    )).sort();
  }, [records]);

  // Filter records based on search and genre
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.genre?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      const matchesGenre = !selectedGenre || record.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [records, searchQuery, selectedGenre]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          My Vinyl Collection
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Explore a curated collection of vinyl records
        </p>
      </div>

      {/* Search and Filter */}
      {!isLoading && records.length > 0 && (
        <SearchFilter
          onSearch={setSearchQuery}
          onFilterByGenre={setSelectedGenre}
          genres={genres}
        />
      )}

      {/* Results Count */}
      {!isLoading && records.length > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Showing {filteredRecords.length} of {records.length} records
        </p>
      )}

      {/* Vinyl Gallery */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <VinylGallery records={filteredRecords} />
      )}
    </div>
  );
}
