# Project Roadmap

[x] ID: 098: Implement `getOldestWeightRecord` method in `src/features/weight/repositories/weight.repository.ts` to retrieve the weight record with the earliest date.
[x] ID: 099: Add tests for the new `getOldestWeightRecord` method in `src/features/weight/repositories/weight.repository.test.ts`, covering cases like no records, single record, multiple records, and tie-breaking by date/ID.
[x] ID: 100: Add a new state variable `oldestWeightRecord` (initialized to `null`) in `src/app/page.tsx` and populate it using `weightRepositoryRef.current.getOldestWeightRecord()` within the `useEffect` hook.
[ ] ID: 101: Update the `oldestWeightRecord` state after `handleAddWeight`, `handleDeleteWeight`, and `handleSaveEditedWeight` operations in `src/app/page.tsx` by re-fetching from the repository.
[ ] ID: 102: Render a new `WeightStatisticsCard` in `src/app/page.tsx` to display the "Oldest Weight" using the `oldestWeightRecord` state.
[ ] ID: 103: Add a "Clear All Records" button to `src/app/page.tsx` that, when clicked, calls `weightRepositoryRef.current.clearAllWeightRecords()` and resets all relevant state variables (`weightRecords`, `latestWeightRecord`, `highestWeightRecord`, `lowestWeightRecord`, `oldestWeightRecord`) to their initial empty/null states.