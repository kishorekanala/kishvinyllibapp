'use client';

import { useState, useEffect, useCallback } from 'react';
import { VinylRecord } from '@/types';
import { apiClient } from '@/lib/api-client';
import { VinylForm } from './VinylForm';
import { VinylList } from './VinylList';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function AdminDashboard() {
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VinylRecord | undefined>();

  // Fetch records with useCallback to handle dependency array correctly
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    const data = await apiClient.getVinylRecords();
    setRecords(data);
    setIsLoading(false);
  }, []);

  // Fetch records on mount
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFormSuccess = (record: VinylRecord) => {
    if (selectedRecord) {
      // Update existing record
      setRecords(records.map(r => r.id === record.id ? record : r));
      setSelectedRecord(undefined);
    } else {
      // Add new record
      setRecords([record, ...records]);
    }
    setShowForm(false);
  };

  const handleEdit = (record: VinylRecord) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedRecord(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vinyl record?')) {
      return;
    }

    const success = await apiClient.deleteVinylRecord(id);
    if (success) {
      setRecords(records.filter(r => r.id !== id));
    } else {
      alert('Failed to delete vinyl record');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Vinyl Collection Manager
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your vinyl records and images
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-6 rounded-md transition"
          >
            + Add Record
          </button>
        )}
      </div>

      {/* Form or List */}
      {showForm ? (
        <VinylForm
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
          initialData={selectedRecord}
        />
      ) : (
        <>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <VinylList
              records={records}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
