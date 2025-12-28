'use client';

import { useState } from 'react';
import { WeightRecord } from '@/features/weight/types';
import { WeightRepository } from '@/features/weight/repositories/weight.repository';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';

// Instantiate services outside the component to ensure singletons across renders
// and avoid re-instantiation overhead for these core services.
const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
const weightRepository = new WeightRepository(localStorageAdapter);

export default function Home() {
  // Define weightRecords state initialized to an empty array
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);

  // For now, these instances are just defined as per the task.
  // Future tasks will involve using them to manage the state.

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
        Fitness Metrics Tracker
      </h1>
      <p className="text-neutral-500">
        System Status: <span className="text-green-600 font-semibold">Online</span>
      </p>
    </main>
  );
}
