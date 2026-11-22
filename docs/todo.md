# Project Roadmap

[ ] ID: 001: Add a new `targetFormSubmissionError` state variable to `src/app/page.tsx`, initialized to `null`.
[ ] ID: 002: Pass the new `targetFormSubmissionError` state as a `submissionError` prop to the `WeightTargetForm` component in `src/app/page.tsx`.
[ ] ID: 003: Modify `WeightTargetFormProps` in `src/features/weight/components/WeightTargetForm.tsx` to include an optional `submissionError` prop of type `string | null`.
[ ] ID: 004: Display the `submissionError` prop within the `WeightTargetForm` component in `src/features/weight/components/WeightTargetForm.tsx` using the `FormError` component.
[ ] ID: 005: Update the `handleSaveTargetWeight` function in `src/app/page.tsx` to set the `targetFormSubmissionError` state with an appropriate message if `weightRepositoryRef.current.setTargetWeight` returns `false`.
[ ] ID: 006: Add an optional `onSuccess` prop to `WeightTargetFormProps` in `src/features/weight/components/WeightTargetForm.tsx` and call it within `handleSubmit` when the target weight is successfully saved.