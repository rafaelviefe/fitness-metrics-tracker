# Project Roadmap

[x] ID: 036: Add an `onDelete` prop (function accepting `string` id) to the `WeightRecordCardProps` interface in `src/features/weight/components/WeightRecordCard.tsx`.
[x] ID: 037: Render a `Button` inside `WeightRecordCard.tsx` with text "Delete" or an appropriate icon, but do not yet connect its `onClick` handler to the `onDelete` prop. Place it next to the weight display.
[x] ID: 038: Connect the `onClick` handler of the delete `Button` in `WeightRecordCard.tsx` to the `onDelete` prop, passing the `record.id`.
[x] ID: 039: Add a test case to `src/features/weight/components/WeightRecordCard.test.tsx` to verify that clicking the delete button calls the `onDelete` prop with the correct `record.id`.
[x] ID: 040: Implement a new function `handleDeleteWeight(id: string)` in `src/app/page.tsx` that calls `weightRepositoryRef.current.deleteWeightRecord(id)` and updates the `weightRecords` state to remove the deleted record.
[x] ID: 041: Pass the `handleDeleteWeight` function to the `onDelete` prop of each `WeightRecordCard` component within the `map` loop in `src/app/page.tsx`.