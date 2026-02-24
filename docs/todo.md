# Project Roadmap

[x] ID: 060: In `src/app/page.tsx`, add a new state variable `editingRecordId` using `useState<string | null>(null)` to track which weight record is currently being edited.
[x] ID: 061: In `src/app/page.tsx`, define a new function `handleEditWeight(id: string)` that sets the `editingRecordId` state to the provided `id`.
[x] ID: 062: In `src/app/page.tsx`, update the `WeightRecordCard` component in the `map` function to pass the `onEdit` prop, linking it to the `handleEditWeight` function.
[ ] ID: 063: In `src/app/page.tsx`, within the `map` function for `weightRecords`, add conditional rendering logic to display either `WeightRecordCard` or `EditWeightForm`. If `record.id` matches `editingRecordId`, render `EditWeightForm` for that record.
[ ] ID: 064: In `src/app/page.tsx`, define a new function `handleSaveEditedWeight(updatedRecord: WeightRecord)` that calls `weightRepositoryRef.current.updateWeightRecord(updatedRecord)`, updates the `weightRecords` state using the returned record (or `updatedRecord` if `updateWeightRecord` doesn't return null), and then resets `editingRecordId` to `null`.
[ ] ID: 065: In `src/app/page.tsx`, when rendering the `EditWeightForm` (conditionally), pass the `onSave` prop, linking it to `handleSaveEditedWeight`, and the `onCancel` prop, linking it to a function that resets `editingRecordId` to `null`.