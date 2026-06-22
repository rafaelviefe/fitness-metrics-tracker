'use client';

import { WeightRepository } from '@/features/weight/repositories/weight.repository';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';
import { useState, useEffect, useRef, useCallback } from 'react';
import { WeightRecord } from '@/features/weight/types';
import { WeightRecordCard } from '@/features/weight/components/WeightRecordCard';
import { AddWeightForm } from '@/features/weight/components/AddWeightForm'; // Import AddWeightForm
import { EditWeightForm } from '@/features/weight/components/EditWeightForm'; // Import EditWeightForm
import { WeightStatisticsCard } from '@/features/weight/components/WeightStatisticsCard'; // Import WeightStatisticsCard
import { Button } from '@/components/ui/Button'; // Import Button for Clear All Records
import { WeightStatistics, refreshWeightStatistics } from '@/features/weight/utils/weight-utils'; // Import WeightStatistics (refreshWeightStatistics is no longer directly used here)
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // Import ToggleGroup and ToggleGroupItem

export default function Home() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  // Introduce displayUnit state variable
  const [displayUnit, setDisplayUnit] = useState<'kg' | 'lbs'>('kg');
  // Introduce displayTime state variable
  const [displayTime, setDisplayTime] = useState<boolean>(false);
  // Replace individual useState declarations with a single one for weightStatistics
  const [weightStatistics, setWeightStatistics] = useState<WeightStatistics>({
    latest: null,
    highest: null,
    lowest: null,
    oldest: null,
  });

  // Use useRef to hold the repository instance, ensuring it's only created once on the client
  const weightRepositoryRef = useRef<WeightRepository | null>(null);

  // Define the new helper function to update all statistics
  const updateAllStatistics = useCallback(() => {
    if (weightRepositoryRef.current) {
      const newStatistics = refreshWeightStatistics(weightRepositoryRef.current);
      setWeightStatistics(newStatistics);
    }
  }, []);

  useEffect(() => {
    // This code only runs on the client-side after component mounts
    if (weightRepositoryRef.current === null) {
      const localStorageAdapter = new LocalStorageAdapter(); // Access window.localStorage here
      weightRepositoryRef.current = new WeightRepository(localStorageAdapter);
    }

    // Capture the non-null repository instance for use within useEffect
    const repository = weightRepositoryRef.current;

    // Load initial weight records from the repository
    const initialRecords = repository.getWeightRecords();
    setWeightRecords(initialRecords);

    // Initialize weight statistics
    updateAllStatistics();
  }, [updateAllStatistics]); // Add updateAllStatistics to dependency array

  const handleAddWeight = (weight: number, date: string) => {
    console.log('Weight to add:', weight, 'Date:', date);
    if (weightRepositoryRef.current) {
      // Capture the non-null repository instance
      const repository = weightRepositoryRef.current;
      const newRecord = repository.addWeightRecord(weight, date);
      setWeightRecords((prevRecords) => [...prevRecords, newRecord]);
      // After adding, re-fetch and update all statistics
      updateAllStatistics();
    }
  };

  const handleDeleteWeight = (id: string) => {
    if (weightRepositoryRef.current) {
      // Capture the non-null repository instance
      const repository = weightRepositoryRef.current;
      const isDeleted = repository.deleteWeightRecord(id);
      if (isDeleted) {
        setWeightRecords((prevRecords) => {
          const updatedRecords = prevRecords.filter((record) => record.id !== id);
          // After deleting, re-evaluate all statistics
          updateAllStatistics();
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
      // Capture the non-null repository instance
      const repository = weightRepositoryRef.current;
      const result = repository.updateWeightRecord(updatedRecord);
      if (result) {
        setWeightRecords((prevRecords) => {
          const updatedRecords = prevRecords.map((record) =>
            record.id === updatedRecord.id ? result : record
          );
          // After editing, re-evaluate all statistics
          updateAllStatistics();
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
      // Capture the non-null repository instance
      const repository = weightRepositoryRef.current;
      repository.clearAllWeightRecords();
      setWeightRecords([]);
      setWeightStatistics({
        latest: null,
        highest: null,
        lowest: null,
        oldest: null,
      });
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
        <AddWeightForm className="mb-6" onWeightAdded={handleAddWeight} unitPreference={displayUnit} />

        {/* Render WeightStatisticsCard here, above "Your Weight Records" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <WeightStatisticsCard record={weightStatistics.latest} label="Latest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard record={weightStatistics.highest} label="Highest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard record={weightStatistics.lowest} label="Lowest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard record={weightStatistics.oldest} label="Oldest Weight" unitPreference={displayUnit} displayTime={displayTime} />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-neutral-900">Your Weight Records</h2>
          <div className="flex items-center gap-4"> {/* New wrapper to group settings toggles */}
            <ToggleGroup type="single" value={displayUnit} onValueChange={(value) => setDisplayUnit(value as 'kg' | 'lbs')} className="space-x-2">
              <ToggleGroupItem value="kg">kg</ToggleGroupItem>
              <ToggleGroupItem value="lbs">lbs</ToggleGroupItem>
            </ToggleGroup>
            {/* New ToggleGroup for displayTime */}
            <ToggleGroup type="single" value={displayTime ? 'yes' : 'no'} onValueChange={(value) => setDisplayTime(value === 'yes')} className="space-x-2">
              <ToggleGroupItem value="yes">Show Time</ToggleGroupItem>
              <ToggleGroupItem value="no">Hide Time</ToggleGroupItem>
            </ToggleGroup>
          </div>
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
                    unitPreference={displayUnit} // Pass displayUnit as unitPreference
                    displayTime={displayTime} // Pass displayTime state variable
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
