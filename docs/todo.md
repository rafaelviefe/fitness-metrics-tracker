# Project Roadmap

[ ] ID: 014: Define a new constant `TARGET_WEIGHT_KEY` in `src/app/page.tsx` for storing target weight in local storage.
[ ] ID: 015: Add `targetWeight` state to `src/app/page.tsx`, initialized by reading from `localStorageAdapter` using `TARGET_WEIGHT_KEY`. Default to `null`.
[ ] ID: 016: Implement a `useEffect` in `src/app/page.tsx` to persist `targetWeight` to `localStorageAdapter` whenever its value changes.
[ ] ID: 017: Add a new method `setTargetWeight(weight: number | null): boolean` to `src/features/weight/repositories/weight.repository.ts` to save the target weight, returning `true` on successful storage or `false` on failure. This method should handle converting `null` to `removeItem` and a number to `setItem`.
[ ] ID: 018: Add a new method `getTargetWeight(): number | null` to `src/features/weight/repositories/weight.repository.ts` to retrieve the target weight from storage, handling parsing errors and returning `null` if not found or invalid.
[ ] ID: 019: Add new test cases for `getTargetWeight()` in `src/features/weight/repositories/weight.repository.test.ts`, covering scenarios where no target weight exists, a valid target weight exists, and a malformed target weight exists in storage.