'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface SearchFilterProps {
  onSearch: (search: string, genre?: string, year?: number) => void;
  genres: string[];
  years: number[];
}

export function SearchFilter({ onSearch, genres, years }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((search: string, genre?: string, year?: number) => {
    onSearch(search, genre, year);
  }, [onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce the search API call
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query, selectedGenre || undefined, selectedYear || undefined);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    handleSearch(searchQuery, genre || undefined, selectedYear || undefined);
  };

  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);
    handleSearch(searchQuery, selectedGenre || undefined, year || undefined);
  };

  const hasActiveFilters = searchQuery || selectedGenre || selectedYear;

  return (
    <div className="space-y-6 mb-8">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search by title, artist, genre, or description..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Genre Filter */}
        {genres.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Filter */}
        {years.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Year
            </label>
            <select
              value={selectedYear || ''}
              onChange={(e) => handleYearChange(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedGenre('');
            setSelectedYear(null);
            handleSearch('');
          }}
          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
