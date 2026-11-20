# Project Roadmap

[ ] ID: 001: Add `targetFormSubmissionError` state variable (`string | null`) to `app/page.tsx`, initialized to `null`.
[ ] ID: 002: Pass the new `targetFormSubmissionError` state as a `submissionError` prop to the `WeightTargetForm` component in `app/page.tsx`.
[ ] ID: 003: Update the `WeightTargetFormProps` interface in `src/features/weight/components/WeightTargetForm.tsx` to include an optional `submissionError` prop of type `string | null`.
[ ] ID: 004: Render the `submissionError` prop using the `FormError` component at the bottom of the form in `src/features/weight/components/WeightTargetForm.tsx`.
[ ] ID: 005: Modify the `handleSaveTargetWeight` callback in `app/page.tsx` to set `targetFormSubmissionError` with an appropriate message if `weightRepositoryRef.current.setTargetWeight()` returns `false`.
[ ] ID: 006: In `app/page.tsx`, clear `targetFormSubmissionError` to `null` within `handleSaveTargetWeight` on successful save, and also when the `setShowTargetForm` action is triggered to hide the form.