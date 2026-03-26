# Project Roadmap

[x] ID: 084: Create an empty file `src/features/weight/components/WeightStatisticsCard.tsx`.
[x] ID: 085: Add necessary imports (`React`, `Card`, `cn`, `formatDateForDisplay`, `WeightRecord`) and define the `WeightStatisticsCardProps` interface in `src/features/weight/components/WeightStatisticsCard.tsx`, accepting `record?: WeightRecord` and `className`.
[x] ID: 086: Implement the `WeightStatisticsCard` functional component in `src/features/weight/components/WeightStatisticsCard.tsx` to display a single `WeightRecord` prop (for a 'Latest Weight' label) inside a `Card`. It should show "No records yet." if `record` is null/undefined.
[ ] ID: 087: In `src/app/page.tsx`, add a new state variable `latestWeightRecord` using `useState<WeightRecord | null>(null)` and initialize it by calling `weightRepositoryRef.current.getLatestWeightRecord()` within the `useEffect` hook.
[ ] ID: 088: In `src/app/page.tsx`, render the `WeightStatisticsCard` component above the "Your Weight Records" section and pass the `latestWeightRecord` state to its `record` prop.
[ ] ID: 089: Update `handleAddWeight` and `handleSaveEditedWeight` functions in `src/app/page.tsx` to re-fetch and update the `latestWeightRecord` state after any changes to `weightRecords`.