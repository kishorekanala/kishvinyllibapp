'use client';

import { useState } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterByGenre: (genre: string) => void;
  genres: string[];
}

export function SearchFilter({ onSearch, onFilterByGenre, genres }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by title, artist, or genre..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Genre Filter */}
      {genres.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Filter by Genre
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterByGenre('')}
              className="px-4 py-2 rounded-full text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-violet-500 hover:text-white transition"
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => onFilterByGenre(genre)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-violet-500 hover:text-white transition"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
