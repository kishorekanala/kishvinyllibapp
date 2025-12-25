'use client';

import { useState, useEffect } from 'react';
import { VinylRecord } from '@/types';
import { VinylForm } from '@/components/admin/VinylForm';
import { VinylList } from '@/components/admin/VinylList';
import { apiClient } from '@/lib/api-client';

export default function AdminPage() {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VinylRecord | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Load vinyl records
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getVinylRecords();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedRecord(undefined);
    setShowForm(true);
  };

  const handleEdit = (record: VinylRecord) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleFormSuccess = (record: VinylRecord) => {
    // If editing, update the record in the list
    if (selectedRecord) {
      setRecords(records.map(r => r.id === record.id ? record : r));
    } else {
      // If creating new, add to the list
      setRecords([record, ...records]);
    }
    setShowForm(false);
    setSelectedRecord(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedRecord(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vinyl record and all its images?')) {
      return;
    }

    try {
      setError(null);
      await apiClient.deleteVinylRecord(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Kishore's Vinyl Collection Manager
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Create, edit, and manage your vinyl record collection
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="mb-8">
          <VinylForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            initialData={selectedRecord}
          />
        </div>
      ) : (
        <div className="mb-8">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition"
          >
            <span className="mr-2">+</span> Add New Vinyl Record
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Loading records...</p>
        </div>
      ) : (
        <VinylList
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

