# Project Roadmap

[ ] ID: 001: Introduce a new state variable, `targetFormSubmissionError`, initialized to `null`, in `src/app/page.tsx` to manage submission errors for `WeightTargetForm`.
[ ] ID: 002: Enhance the `WeightTargetFormProps` interface in `src/features/weight/components/WeightTargetForm.tsx` to include an optional `submissionError` prop of type `string | null`.
[ ] ID: 003: Add a `FormError` component at the bottom of the `WeightTargetForm` in `src/features/weight/components/WeightTargetForm.tsx` to display the `submissionError` prop.
[ ] ID: 004: Pass the `targetFormSubmissionError` state from `src/app/page.tsx` to the `WeightTargetForm` component via its new `submissionError` prop.
[ ] ID: 005: Modify the `handleSaveTargetWeight` callback in `src/app/page.tsx` to set `targetFormSubmissionError` to a descriptive message if `weightRepositoryRef.current.setTargetWeight()` returns `false`.
[ ] ID: 006: In `src/app/page.tsx`, ensure `targetFormSubmissionError` is explicitly set to `null` within `handleSaveTargetWeight` upon successful target weight save.