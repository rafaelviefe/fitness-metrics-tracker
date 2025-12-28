# Project Roadmap

[x] ID: 014: Convert `src/app/page.tsx` into a client component by adding the `'use client';` directive.
[x] ID: 015: In `src/app/page.tsx`, import `WeightRepository` and `LocalStorageAdapter` from their respective paths.
[x] ID: 016: In `src/app/page.tsx`, instantiate `LocalStorageAdapter` and `WeightRepository` outside or inside the `Home` component, and define a `weightRecords` state using `useState` initialized to an empty array.
[ ] ID: 017: In `src/app/page.tsx`, add a `useEffect` hook that fetches existing weight records using `weightRepository.getWeightRecords()` and updates the `weightRecords` state upon component mount.
[ ] ID: 018: In `src/app/page.tsx`, import the `WeightRecordCard` component.
[ ] ID: 019: In `src/app/page.tsx`, render the `weightRecords` array by mapping over it and displaying each `WeightRecord` using the `WeightRecordCard` component, ensuring each card has a unique `key` prop.