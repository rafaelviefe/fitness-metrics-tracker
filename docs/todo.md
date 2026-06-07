# Project Roadmap

[x] ID: 143: Modify the `cn` function in `src/lib/utils.ts` to flatten a single level of nested arrays when processing class names.
[x] ID: 144: Update `src/lib/utils.test.ts` to modify the existing test case that asserts `cn` does *not* flatten arrays, changing it to assert that it now *does* flatten a single level of arrays.
[x] ID: 145: In `src/features/weight/components/AddWeightForm.tsx`, add logic to convert the input `weight` from pounds to kilograms using `convertLbsToKg` if `unitPreference` is `'lbs'` before passing it to `onWeightAdded`.
[ ] ID: 146: In `src/features/weight/components/AddWeightForm.test.tsx`, add a new test case to verify that when `unitPreference` is `'lbs'`, the `onWeightAdded` callback receives the weight value correctly converted to kilograms.
[ ] ID: 147: In `src/features/weight/components/WeightRecordCard.tsx`, introduce a new optional boolean prop `displayTime` (defaulting to `false`). Use this prop to conditionally format the record's date using `formatDateWithTimeForDisplay` when `true`, otherwise use `formatDateForDisplay`.
[ ] ID: 148: In `src/features/weight/components/WeightRecordCard.test.tsx`, add a new test case to verify that when the `displayTime` prop is set to `true`, the date displayed includes the time component.