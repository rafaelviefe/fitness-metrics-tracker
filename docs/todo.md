# Project Roadmap

[x] ID: 168: Add `average: number | null;` to the `WeightStatistics` interface in `src/features/weight/utils/weight-utils.ts`.
[ ] ID: 169: Call `repository.getAverageWeight()` and assign its result to the `average` property in the returned `WeightStatistics` object within `refreshWeightStatistics` in `src/features/weight/utils/weight-utils.ts`.
[ ] ID: 170: Add a `WeightStatisticsCard` for `weightStatistics.average` with the label "Average Weight" to the grid of statistics cards in `src/app/page.tsx`. Pass `unitPreference` and `displayTime` props.
[ ] ID: 171: Add a new `useState` variable `sortOrder` to `Home` in `src/app/page.tsx` for managing the display order of records, initializing it to `'date_desc'` (for descending date order).
[ ] ID: 172: In `src/app/page.tsx`, create a `sortedWeightRecords` memoized value that sorts the `weightRecords` array based on the `sortOrder` state, before rendering them. Implement sorting for `'date_desc'`, `'date_asc'`, `'weight_desc'`, and `'weight_asc'`, using `record.id` as a secondary tie-breaker (ascending) for consistency.
[ ] ID: 173: In `src/app/page.tsx`, add a new `ToggleGroup` component above the list of records to allow users to select the `sortOrder` (e.g., `'date_desc'`, `'date_asc'`, `'weight_desc'`, `'weight_asc'`), binding its value and `onValueChange` to the `sortOrder` state.