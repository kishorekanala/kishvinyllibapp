'use client';

import { useEffect, useState, useCallback } from 'react';
import { VinylRecord } from '@/types';
import { VinylGallery } from '@/components/user/VinylGallery';
import { SearchFilter } from '@/components/user/SearchFilter';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Home() {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Fetch vinyl records with search and filters
  const fetchRecords = useCallback(async (search?: string, genre?: string, year?: number) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year.toString());

      const response = await fetch(`/api/vinyl?${params.toString()}`);
      const data = await response.json();

      setRecords(data.data || []);
      setGenres(data.filters?.genres || []);
      setYears(data.filters?.years || []);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch records on mount only
  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle search and filter changes
  const handleSearch = useCallback((search: string, genre?: string, year?: number) => {
    setSearchQuery(search);
    setSelectedGenre(genre || '');
    setSelectedYear(year || null);
    fetchRecords(search, genre, year);
  }, [fetchRecords]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          KishSat's Vinyl Collection
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Explore a curated collection of vinyl records
        </p>
      </div>

      {/* Search and Filter - Always mounted to prevent state reset */}
      <SearchFilter
        onSearch={handleSearch}
        genres={genres}
        years={years}
      />

      {/* Results Count */}
      {records.length > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Found {records.length} record{records.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Vinyl Gallery */}
      {isLoading ? (
        <LoadingSpinner />
      ) : records.length > 0 ? (
        <VinylGallery records={records} />
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            No vinyl records found. Try adjusting your search filters.
          </p>
        </div>
      )}
    </div>
  );
}
