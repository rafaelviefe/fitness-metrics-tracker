'use client';

import { WeightRepository } from '@/features/weight/repositories/weight.repository';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';
import { useState, useEffect, useRef } from 'react';
import { WeightRecord } from '@/features/weight/types';
import { WeightRecordCard } from '@/features/weight/components/WeightRecordCard';
import { AddWeightForm } from '@/features/weight/components/AddWeightForm'; // Import AddWeightForm
import { EditWeightForm } from '@/features/weight/components/EditWeightForm'; // Import EditWeightForm
import { WeightStatisticsCard } from '@/features/weight/components/WeightStatisticsCard'; // Import WeightStatisticsCard
import { Button } from '@/components/ui/Button'; // Import Button for Clear All Records
import { WeightStatistics, refreshWeightStatistics } from '@/features/weight/utils/weight-utils'; // Import WeightStatistics and refreshWeightStatistics

export default function Home() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [latestWeightRecord, setLatestWeightRecord] = useState<WeightRecord | null>(null);
  const [highestWeightRecord, setHighestWeightRecord] = useState<WeightRecord | null>(null);
  const [lowestWeightRecord, setLowestWeightRecord] = useState<WeightRecord | null>(null);
  const [oldestWeightRecord, setOldestWeightRecord] = useState<WeightRecord | null>(null); // New state variable

  // Use useRef to hold the repository instance, ensuring it's only created once on the client
  const weightRepositoryRef = useRef<WeightRepository | null>(null);

  useEffect(() => {
    // This code only runs on the client-side after component mounts
    if (weightRepositoryRef.current === null) {
      const localStorageAdapter = new LocalStorageAdapter(); // Access window.localStorage here
      weightRepositoryRef.current = new WeightRepository(localStorageAdapter);
    }

    // Load initial weight records from the repository
    const initialRecords = weightRepositoryRef.current.getWeightRecords();
    setWeightRecords(initialRecords);

    // Initialize latestWeightRecord
    const latestRecord = weightRepositoryRef.current.getLatestWeightRecord();
    setLatestWeightRecord(latestRecord);

    // Initialize highestWeightRecord
    const highestRecord = weightRepositoryRef.current.getHighestWeightRecord();
    setHighestWeightRecord(highestRecord);

    // Initialize lowestWeightRecord
    const lowestRecord = weightRepositoryRef.current.getLowestWeightRecord();
    setLowestWeightRecord(lowestRecord);

    // Initialize oldestWeightRecord
    const oldestRecord = weightRepositoryRef.current.getOldestWeightRecord();
    setOldestWeightRecord(oldestRecord);
  }, []); // Empty dependency array means this runs once on mount

  const handleAddWeight = (weight: number) => {
    console.log('Weight to add:', weight);
    if (weightRepositoryRef.current) {
      const newRecord = weightRepositoryRef.current.addWeightRecord(weight);
      setWeightRecords((prevRecords) => [...prevRecords, newRecord]);
      // After adding, re-fetch and update the latest record display from the repository
      const newLatest = weightRepositoryRef.current.getLatestWeightRecord();
      setLatestWeightRecord(newLatest || null);
      // After adding, re-fetch and update the highest record display from the repository
      const newHighest = weightRepositoryRef.current.getHighestWeightRecord();
      setHighestWeightRecord(newHighest || null);
      // After adding, re-fetch and update the lowest record display from the repository
      const newLowest = weightRepositoryRef.current.getLowestWeightRecord();
      setLowestWeightRecord(newLowest || null);
      // After adding, re-fetch and update the oldest record display from the repository
      const newOldest = weightRepositoryRef.current.getOldestWeightRecord();
      setOldestWeightRecord(newOldest || null);
    }
  };

  const handleDeleteWeight = (id: string) => {
    if (weightRepositoryRef.current) {
      const isDeleted = weightRepositoryRef.current.deleteWeightRecord(id);
      if (isDeleted) {
        setWeightRecords((prevRecords) => {
          const updatedRecords = prevRecords.filter((record) => record.id !== id);
          // After deleting, re-evaluate the latest record
          const newLatest = weightRepositoryRef.current?.getLatestWeightRecord();
          setLatestWeightRecord(newLatest || null);
          // After deleting, re-evaluate the highest record
          const newHighest = weightRepositoryRef.current?.getHighestWeightRecord();
          setHighestWeightRecord(newHighest || null);
          // After deleting, re-evaluate the lowest record
          const newLowest = weightRepositoryRef.current?.getLowestWeightRecord();
          setLowestWeightRecord(newLowest || null);
          // After deleting, re-evaluate the oldest record
          const newOldest = weightRepositoryRef.current?.getOldestWeightRecord();
          setOldestWeightRecord(newOldest || null);
          return updatedRecords;
        });
      }
    }
  };

  // New function to set the editing record ID
  const handleEditWeight = (id: string) => {
    setEditingRecordId(id);
  };

  // New function to handle saving an updated weight record
  const handleSaveEditedWeight = (updatedRecord: WeightRecord) => {
    if (weightRepositoryRef.current) {
      const result = weightRepositoryRef.current.updateWeightRecord(updatedRecord);
      if (result) {
        setWeightRecords((prevRecords) => {
          const updatedRecords = prevRecords.map((record) =>
            record.id === updatedRecord.id ? result : record
          );
          // After editing, re-evaluate the latest record
          const newLatest = weightRepositoryRef.current?.getLatestWeightRecord();
          setLatestWeightRecord(newLatest || null);
          // After editing, re-evaluate the highest record
          const newHighest = weightRepositoryRef.current?.getHighestWeightRecord();
          setHighestWeightRecord(newHighest || null);
          // After editing, re-evaluate the lowest record
          const newLowest = weightRepositoryRef.current?.getLowestWeightRecord();
          setLowestWeightRecord(newLowest || null);
          // After editing, re-evaluate the oldest record
          const newOldest = weightRepositoryRef.current?.getOldestWeightRecord();
          setOldestWeightRecord(newOldest || null);
          return updatedRecords;
        });
        setEditingRecordId(null); // Exit editing mode after saving
      }
    }
  };

  // New function to handle cancelling the edit operation
  const handleCancelEdit = () => {
    setEditingRecordId(null); // Exit editing mode without saving changes
  };

  // Function to clear all records
  const handleClearAllRecords = () => {
    if (weightRepositoryRef.current) {
      weightRepositoryRef.current.clearAllWeightRecords();
      setWeightRecords([]);
      setLatestWeightRecord(null);
      setHighestWeightRecord(null);
      setLowestWeightRecord(null);
      setOldestWeightRecord(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
        Fitness Metrics Tracker
      </h1>
      <p className="text-neutral-500"> 
        System Status: <span className="text-green-600 font-semibold">Online</span>
      </p>

      <section className="mt-8 max-w-md w-full">
        {/* Render AddWeightForm here, before the "Your Weight Records" section */}
        <AddWeightForm className="mb-6" onWeightAdded={handleAddWeight} />

        {/* Render WeightStatisticsCard here, above "Your Weight Records" */}
        <WeightStatisticsCard record={latestWeightRecord} label="Latest Weight" className="mb-6" />
        <WeightStatisticsCard record={highestWeightRecord} label="Highest Weight" className="mb-6" />
        <WeightStatisticsCard record={lowestWeightRecord} label="Lowest Weight" className="mb-6" />
        <WeightStatisticsCard record={oldestWeightRecord} label="Oldest Weight" className="mb-6" />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-neutral-900">Your Weight Records</h2>
          <Button variant="destructive" size="sm" onClick={handleClearAllRecords}>
            Clear All Records
          </Button>
        </div>

        {weightRecords.length === 0 ? (
          <p className="text-neutral-500">No weight records found. Add some!</p>
        ) : (
          <ul className="space-y-3">
            {weightRecords.map((record) => (
              <li key={record.id}>
                {editingRecordId === record.id ? (
                  <EditWeightForm
                    record={record}
                    onSave={handleSaveEditedWeight}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <WeightRecordCard
                    record={record}
                    onDelete={handleDeleteWeight}
                    onEdit={(recordToEdit) => handleEditWeight(recordToEdit.id)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}