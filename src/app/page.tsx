'use client';

import { WeightRepository } from '@/features/weight/repositories/weight.repository';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WeightRecord } from '@/features/weight/types';
import { WeightRecordCard } from '@/features/weight/components/WeightRecordCard';
import { AddWeightForm } from '@/features/weight/components/AddWeightForm';
import { EditWeightForm } from '@/features/weight/components/EditWeightForm';
import { WeightStatisticsCard } from '@/features/weight/components/WeightStatisticsCard';
import { Button } from '@/components/ui/Button';
import { WeightStatistics, refreshWeightStatistics } from '@/features/weight/utils/weight-utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const UNIT_PREFERENCE_KEY = 'unitPreference';
const DISPLAY_TIME_PREFERENCE_KEY = 'displayTimePreference';
const SORT_ORDER_PREFERENCE_KEY = 'sortOrderPreference';

type SortOrder = 'date_desc' | 'date_asc' | 'weight_desc' | 'weight_asc';

export default function Home() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [displayUnit, setDisplayUnit] = useState<'kg' | 'lbs'>(() => {
    if (typeof window !== 'undefined') {
      const localStorageAdapter = new LocalStorageAdapter();
      const storedUnit = localStorageAdapter.getItem<'kg' | 'lbs'>(UNIT_PREFERENCE_KEY);
      return storedUnit || 'kg';
    }
    return 'kg';
  });
  const [displayTime, setDisplayTime] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const localStorageAdapter = new LocalStorageAdapter();
      const storedDisplayTime = localStorageAdapter.getItem<string>(DISPLAY_TIME_PREFERENCE_KEY);
      return storedDisplayTime === 'true';
    }
    return false;
  });
  const [weightStatistics, setWeightStatistics] = useState<WeightStatistics> ({
    latest: null,
    highest: null,
    lowest: null,
    oldest: null,
    average: null,
  });

  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    if (typeof window !== 'undefined') {
      const localStorageAdapter = new LocalStorageAdapter();
      const storedSortOrder = localStorageAdapter.getItem<SortOrder>(SORT_ORDER_PREFERENCE_KEY);
      // Ensure the stored value is one of the valid SortOrder types, otherwise default.
      const validSortOrders: SortOrder[] = ['date_desc', 'date_asc', 'weight_desc', 'weight_asc'];
      if (storedSortOrder && validSortOrders.includes(storedSortOrder)) {
        return storedSortOrder;
      }
    }
    return 'date_desc'; // Default sort order
  });

  const weightRepositoryRef = useRef<WeightRepository | null>(null);
  const localStorageAdapterRef = useRef<LocalStorageAdapter | null>(null);

  const updateAllStatistics = useCallback(() => {
    if (weightRepositoryRef.current) {
      const newStatistics = refreshWeightStatistics(weightRepositoryRef.current);
      setWeightStatistics(newStatistics);
    }
  }, []);

  useEffect(() => {
    if (localStorageAdapterRef.current === null) {
      localStorageAdapterRef.current = new LocalStorageAdapter();
      weightRepositoryRef.current = new WeightRepository(localStorageAdapterRef.current);
    }

    const repository = weightRepositoryRef.current;
    if (repository) { // Ensure repository is not null before usage
      const initialRecords = repository.getWeightRecords();
      setWeightRecords(initialRecords);

      updateAllStatistics();
    }
  }, [updateAllStatistics]);

  useEffect(() => {
    if (localStorageAdapterRef.current) {
      localStorageAdapterRef.current.setItem(UNIT_PREFERENCE_KEY, displayUnit);
    }
  }, [displayUnit]);

  useEffect(() => {
    if (localStorageAdapterRef.current) {
      localStorageAdapterRef.current.setItem(DISPLAY_TIME_PREFERENCE_KEY, displayTime.toString());
    }
  }, [displayTime]);

  // Persist sortOrder to local storage whenever it changes
  useEffect(() => {
    if (localStorageAdapterRef.current) {
      localStorageAdapterRef.current.setItem(SORT_ORDER_PREFERENCE_KEY, sortOrder);
    }
  }, [sortOrder]);

  const handleAddWeight = (weight: number, date: string) => {
    console.log('Weight to add:', weight, 'Date:', date);
    if (weightRepositoryRef.current) {
      const repository = weightRepositoryRef.current;
      const newRecord = repository.addWeightRecord(weight, date);
      if (newRecord) { // Only add if the record was successfully stored
        setWeightRecords((prevRecords) => [...prevRecords, newRecord]);
        updateAllStatistics();
      } else {
        console.error('Failed to add weight record due to a storage error.');
      }
    }
  };

  const handleDeleteWeight = (id: string) => {
    if (weightRepositoryRef.current) {
      const repository = weightRepositoryRef.current;
      const isDeleted = repository.deleteWeightRecord(id);
      if (isDeleted) {
        setWeightRecords((prevRecords) => {
          const updatedRecords = prevRecords.filter((record) => record.id !== id);
          updateAllStatistics();
          return updatedRecords;
        });
      }
    }
  };

  const handleEditWeight = (id: string) => {
    setEditingRecordId(id);
  };

  const handleSaveEditedWeight = (updatedRecord: WeightRecord) => {
    if (weightRepositoryRef.current) {
      const repository = weightRepositoryRef.current;
      const result = repository.updateWeightRecord(updatedRecord);
      if (result) {
        setWeightRecords((prevRecords) => {
          const updatedRecords = prevRecords.map((record) =>
            record.id === updatedRecord.id ? result : record
          );
          updateAllStatistics();
          return updatedRecords;
        });
        setEditingRecordId(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingRecordId(null);
  };

  const handleClearAllRecords = () => {
    // Prompt user for confirmation before clearing records
    if (window.confirm('Are you sure you want to delete ALL weight records? This action cannot be undone.')) {
      if (weightRepositoryRef.current) {
        const repository = weightRepositoryRef.current;
        repository.clearAllWeightRecords();
        setWeightRecords([]);
        setWeightStatistics({
          latest: null,
          highest: null,
          lowest: null,
          oldest: null,
          average: null,
        });
      }
    }
  };

  const sortedWeightRecords = useMemo(() => {
    const sorted = [...weightRecords].sort((a, b) => {
      let comparison = 0;

      switch (sortOrder) {
        case 'date_desc':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'date_asc':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'weight_desc':
          comparison = b.weight - a.weight;
          break;
        case 'weight_asc':
          comparison = a.weight - b.weight;
          break;
        default:
          break;
      }

      // Secondary tie-breaker: sort by ID ascending if primary comparison is equal
      if (comparison === 0) {
        return a.id.localeCompare(b.id);
      }

      return comparison;
    });
    return sorted;
  }, [weightRecords, sortOrder]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
        Fitness Metrics Tracker
      </h1>
      <p className="text-neutral-500">
        System Status: <span className="text-green-600 font-semibold">Online</span>
      </p>

      <section className="mt-8 max-w-md w-full">
        <AddWeightForm className="mb-6" onWeightAdded={handleAddWeight} unitPreference={displayUnit} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <WeightStatisticsCard record={weightStatistics.latest} label="Latest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard record={weightStatistics.highest} label="Highest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard record={weightStatistics.lowest} label="Lowest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard record={weightStatistics.oldest} label="Oldest Weight" unitPreference={displayUnit} displayTime={displayTime} />
          <WeightStatisticsCard
            label="Average Weight"
            unitPreference={displayUnit}
            averageValue={weightStatistics.average}
            displayTime={false} // Date/time is always suppressed for average value
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-neutral-900">Your Weight Records</h2>
          <div className="flex items-center gap-4">
            {/* Unit Preference Toggle Group */}
            <span id="unit-preference-label" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Unit:</span>
            <ToggleGroup
              type="single"
              value={displayUnit}
              onValueChange={(value) => setDisplayUnit(value as 'kg' | 'lbs')}
              className="space-x-2"
              aria-labelledby="unit-preference-label"
            >
              <ToggleGroupItem value="kg">kg</ToggleGroupItem>
              <ToggleGroupItem value="lbs">lbs</ToggleGroupItem>
            </ToggleGroup>

            {/* Display Time Preference Toggle Group */}
            <span id="display-time-label" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Display:</span>
            <ToggleGroup
              type="single"
              value={displayTime.toString()}
              onValueChange={(value) => setDisplayTime(value === 'true')}
              className="space-x-2"
              aria-labelledby="display-time-label"
            >
              <ToggleGroupItem value="true">Date & Time</ToggleGroupItem>
              <ToggleGroupItem value="false">Date Only</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Button variant="destructive" size="sm" onClick={handleClearAllRecords}>
            Clear All Records
          </Button>
        </div>

        {/* New controls for sorting */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span id="sort-order-label" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sort by:</span>
          <ToggleGroup
            type="single"
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
            aria-labelledby="sort-order-label"
          >
            <ToggleGroupItem value="date_desc" size="sm" aria-label="Sort by date, newest first">Date (Newest)</ToggleGroupItem>
            <ToggleGroupItem value="date_asc" size="sm" aria-label="Sort by date, oldest first">Date (Oldest)</ToggleGroupItem>
            <ToggleGroupItem value="weight_desc" size="sm" aria-label="Sort by weight, highest first">Weight (Highest)</ToggleGroupItem>
            <ToggleGroupItem value="weight_asc" size="sm" aria-label="Sort by weight, lowest first">Weight (Lowest)</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {weightRecords.length === 0 ? (
          <p className="text-neutral-500">No weight records found. Add some!</p>
        ) : (
          <ul className="space-y-3">
            {sortedWeightRecords.map((record) => (
              <li key={record.id}>
                {editingRecordId === record.id ? (
                  <EditWeightForm
                    record={record}
                    onSave={handleSaveEditedWeight}
                    onCancel={handleCancelEdit}
                    unitPreference={displayUnit}
                  />
                ) : (
                  <WeightRecordCard
                    record={record}
                    onDelete={handleDeleteWeight}
                    onEdit={(recordToEdit) => handleEditWeight(recordToEdit.id)}
                    unitPreference={displayUnit}
                    displayTime={displayTime}
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