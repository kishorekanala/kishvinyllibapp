'use client';

import { VinylRecord } from '@/types';
import Image from 'next/image';

interface VinylListProps {
  records: VinylRecord[];
  onEdit: (record: VinylRecord) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function VinylList({ records, onEdit, onDelete, onRefresh }: VinylListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
        <div className="text-4xl mb-4">💿</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No Vinyl Records Yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Create your first vinyl record to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Year
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Images
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                  {record.title}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {record.artist}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {record.year || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {record.genre || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    {record.images?.length || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => onEdit(record)}
                    className="text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(record.id)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
