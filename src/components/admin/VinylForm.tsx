'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVinylRecordSchema, CreateVinylRecordInput } from '@/lib/validation';
import { VinylRecord } from '@/types';
import { apiClient } from '@/lib/api-client';

interface VinylFormProps {
  onSuccess: (record: VinylRecord) => void;
  onCancel: () => void;
  initialData?: VinylRecord;
}

export function VinylForm({ onSuccess, onCancel, initialData }: VinylFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVinylRecordInput>({
    resolver: zodResolver(createVinylRecordSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      artist: initialData.artist,
      year: initialData.year || undefined,
      genre: initialData.genre || undefined,
      description: initialData.description || undefined,
    } : {},
  });

  const onSubmit = async (data: CreateVinylRecordInput) => {
    try {
      setIsSubmitting(true);
      setError(null);

      let result;
      if (initialData) {
        result = await apiClient.updateVinylRecord(initialData.id, data);
      } else {
        result = await apiClient.createVinylRecord(data);
      }

      if (result) {
        onSuccess(result);
      } else {
        setError('Failed to save vinyl record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        {initialData ? 'Edit Vinyl Record' : 'Add New Vinyl Record'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Album title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Artist *
          </label>
          <input
            type="text"
            {...register('artist')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Artist name"
          />
          {errors.artist && (
            <p className="text-red-500 text-sm mt-1">{errors.artist.message}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Year
          </label>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Release year"
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Genre
          </label>
          <input
            type="text"
            {...register('genre')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="e.g. Rock, Jazz, Pop"
          />
          {errors.genre && (
            <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Album description"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2 px-4 rounded-md transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
