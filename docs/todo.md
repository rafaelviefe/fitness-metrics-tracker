# Project Roadmap

[ ] ID: 001: Modify `AddWeightForm.tsx`'s `handleSubmit` to remove the logic for clearing the weight and date input fields, delegating this responsibility entirely to the parent component.
[ ] ID: 002: Update `page.tsx`'s `handleAddFormSuccess` callback to explicitly clear the `AddWeightForm`'s weight and date input fields after a successful record addition.
[ ] ID: 003: In `WeightRecordCard.tsx`, add a new boolean prop `isEditingAnyOtherRecord` and use it to conditionally disable the "Edit" and "Delete" buttons when `true`.
[ ] ID: 004: In `page.tsx`, calculate and pass the `isEditingAnyOtherRecord` prop to each `WeightRecordCard`, setting it to `true` if an edit form is currently active for a different record.
[ ] ID: 005: In `WeightTargetForm.tsx`, add a new optional `submissionError` prop (string | null) and display it using the `FormError` component if a value is provided.
[ ] ID: 006: In `page.tsx`, introduce a new state variable `targetFormSubmissionError` to manage repository-level errors for `WeightTargetForm`. Update `handleSaveTargetWeight` to set this error state if `weightRepositoryRef.current.setTargetWeight()` returns `false`, and pass `targetFormSubmissionError` to the `WeightTargetForm` component.