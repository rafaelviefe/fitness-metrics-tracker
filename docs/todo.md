# Project Roadmap

[ ] ID: 131: Add a new function `convertKgToLbs(kg: number): number` to `src/features/weight/utils/weight-utils.ts` that converts kilograms to pounds (1 kg = 2.20462 lbs).
[ ] ID: 132: Add a test case for the `convertKgToLbs` function in `src/features/weight/utils/weight-utils.test.ts` to verify its correct conversion with a sample value.
[ ] ID: 133: In `src/app/page.tsx`, introduce a `useState` variable named `displayUnit` (initialized to `'kg'`) to control the preferred unit for displaying weights.
[ ] ID: 134: In `src/app/page.tsx`, pass the `displayUnit` state as a new prop named `unitPreference` to the `WeightRecordCard` component.
[ ] ID: 135: Update the `WeightRecordCardProps` interface in `src/features/weight/components/WeightRecordCard.tsx` to include an optional `unitPreference?: 'kg' | 'lbs'` prop.
[ ] ID: 136: In `src/features/weight/components/WeightRecordCard.tsx`, import `convertKgToLbs` and use the `unitPreference` prop to conditionally format and display the `record.weight` (in kilograms or converted to pounds) and append the corresponding unit string (e.g., "kg" or "lbs").