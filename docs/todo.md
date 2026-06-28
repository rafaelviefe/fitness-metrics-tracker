# Project Roadmap

[x] ID: 160: Modify `src/app/page.tsx` to read the initial `displayUnit` state from `localStorage` (using `LocalStorageAdapter.getItem`). If no value is stored, default to 'kg'.
[x] ID: 161: Modify `src/app/page.tsx` to save the `displayUnit` preference to `localStorage` (using `LocalStorageAdapter.setItem`) whenever the `displayUnit` state changes.
[x] ID: 162: Modify `src/app/page.tsx` to read the initial `displayTime` state (as a boolean) from `localStorage`. If no value is stored, default to `false`.
[ ] ID: 163: Modify `src/app/page.tsx` to save the `displayTime` preference to `localStorage` whenever the `displayTime` state changes.
[ ] ID: 164: Add a new method `getAverageWeight(): number | null` to `src/features/weight/repositories/weight.repository.ts`. This method should calculate the average weight of all valid records and return it, or `null` if no records exist.
[ ] ID: 165: Add a new `describe` block or `it` statement within the `WeightRepository` test file (`src/features/weight/repositories/weight.repository.test.ts`) to test the `getAverageWeight` method. Include tests for empty records, single record, multiple records, and records with decimal values.