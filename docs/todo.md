# Project Roadmap

[x] ID: 007: Implement a test in `src/app/page.test.tsx` to verify that the `Home` component correctly loads and applies the `displayUnit` preference from `localStorage` on initial render, ensuring 'lbs' is active if set.
[x] ID: 008: Implement a test in `src/app/page.test.tsx` to verify that the `Home` component correctly loads and applies the `displayTime` preference from `localStorage` on initial render, ensuring 'Date & Time' is active if set.
[ ] ID: 009: Implement a test in `src/app/page.test.tsx` to verify that the `Home` component correctly loads and applies the `sortOrder` preference from `localStorage` on initial render, ensuring the correct sort toggle is active if set.
[ ] ID: 010: Implement a test in `src/app/page.test.tsx` to verify that an `AddWeightForm` submission error message is displayed when `handleAddWeight` fails (e.g., due to a simulated `WeightRepository` storage error).
[ ] ID: 011: Implement a test in `src/app/page.test.tsx` to verify that `WeightRecordCard` components are initially rendered in `date_desc` order (newest first) when multiple weight records are added.
[ ] ID: 012: Implement a test in `src/app/page.test.tsx` to verify that `WeightRecordCard` components correctly re-sort to `weight_asc` order (lowest weight first) when the corresponding `ToggleGroupItem` is clicked.