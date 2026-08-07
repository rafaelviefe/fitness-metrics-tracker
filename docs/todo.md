# Project Roadmap

[x] ID: 192: Update `body` styles in `src/app/globals.css` to use `var(--font-sans)` instead of `Arial, Helvetica, sans-serif` for consistent typography.
[x] ID: 193: Modify the `WeightRecordCard` component in `src/features/weight/components/WeightRecordCard.tsx` to format the `displayedWeight` to one decimal place when the `unitPreference` is 'kg'.
[ ] ID: 194: Modify the `WeightStatisticsCard` component in `src/features/weight/components/WeightStatisticsCard.tsx` to format the `displayedWeight` (for both `record` and `averageValue`) to one decimal place when the `unitPreference` is 'kg'.
[ ] ID: 195: Update the `AddWeightFormProps` interface in `src/features/weight/components/AddWeightForm.tsx` to include an optional `submissionError?: string | null` prop.
[ ] ID: 196: In `src/features/weight/components/AddWeightForm.tsx`, within the `AddWeightForm` component, conditionally render the `submissionError` prop (if present) as a red-colored paragraph below the form's submit button.
[ ] ID: 197: In `src/app/page.tsx`, define a new `addFormSubmissionError` state variable of type `string | null` initialized to `null`.