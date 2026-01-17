'use client';

import { WeightRepository } from '@/features/weight/repositories/weight.repository';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';
import { useState, useEffect, useRef } from 'react';
import { WeightRecord } from '@/features/weight/types';
import { WeightRecordCard } from '@/features/weight/components/WeightRecordCard';
import { AddWeightForm } from '@/features/weight/components/AddWeightForm'; // Import AddWeightForm

export default function Home() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);

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
  }, []); // Empty dependency array means this runs once on mount

  const handleAddWeight = (weight: number) => {
    console.log('Weight to add:', weight);
    if (weightRepositoryRef.current) {
      const newRecord = weightRepositoryRef.current.addWeightRecord(weight);
      setWeightRecords((prevRecords) => [...prevRecords, newRecord]);
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

        <h2 className="text-2xl font-semibold mb-4 text-neutral-900">Your Weight Records</h2>
        {weightRecords.length === 0 ? (
          <p className="text-neutral-500">No weight records found. Add some!</p>
        ) : (
          <ul className="space-y-3">
            {weightRecords.map((record) => (
              <li key={record.id}>
                <WeightRecordCard record={record} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
