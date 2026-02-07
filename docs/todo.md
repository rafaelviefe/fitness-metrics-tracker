# Project Roadmap

[ ] ID: 048: Update `WeightRecordCardProps` interface in `src/features/weight/components/WeightRecordCard.tsx` to include an optional `onEdit` callback prop: `onEdit?: (record: WeightRecord) => void;`.
[ ] ID: 049: Add an "Edit" `Button` component to `src/features/weight/components/WeightRecordCard.tsx`. Place it next to the existing "Delete" button, using `variant="secondary"` and `size="sm"` with the text "Edit". Do not connect `onClick` yet.
[ ] ID: 050: Implement `handleEditClick` in `src/features/weight/components/WeightRecordCard.tsx` to call `onEdit?.(record)`. Connect this handler to the `onClick` prop of the "Edit" button added in the previous task.
[ ] ID: 051: Add a new test case to `src/features/weight/components/WeightRecordCard.test.tsx` to verify that when the "Edit" button is clicked, the `onEdit` prop is called exactly once with the correct `WeightRecord` object.
[ ] ID: 052: Create a new file `src/features/weight/components/EditWeightForm.tsx`. Define a basic functional component `EditWeightForm` that accepts `record: WeightRecord` as a prop and returns a simple `div` containing "Edit Form for {record.id}" for now.
[ ] ID: 053: Create a new file `src/features/weight/components/EditWeightForm.test.tsx`. Add a basic rendering test to verify that the `EditWeightForm` component renders correctly with a mock `WeightRecord` prop.