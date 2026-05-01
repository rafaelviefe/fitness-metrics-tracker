# Project Roadmap

[ ] ID: 116: Import the `refreshWeightStatistics` function from `../utils/weight-utils` into `src/app/page.tsx`.
[ ] ID: 117: Refactor the `updateAllStatistics` `useCallback` hook in `src/app/page.tsx` to utilize the imported `refreshWeightStatistics` utility function.
[ ] ID: 118: Modify the `handleSubmit` function in `src/features/weight/components/AddWeightForm.tsx` to ensure the weight input field is cleared only upon a successful submission, not when validation fails.
[ ] ID: 119: Update the test case in `src/features/weight/components/AddWeightForm.test.tsx` that submits an empty string, asserting that the weight input field retains an empty value (``) when validation fails.
[ ] ID: 120: Add a new test case to `src/features/weight/components/WeightRecordCard.test.tsx` to verify that the component gracefully displays "Invalid Date" when provided with a `WeightRecord` containing an invalid date string.
[ ] ID: 121: Add a new test case to `src/features/weight/components/WeightStatisticsCard.test.tsx` to ensure the component gracefully displays "Invalid Date" for the date portion when its `record` prop contains an invalid date string.