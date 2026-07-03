# Project Roadmap

[x] ID: 166: Modify `EditWeightFormProps` interface in `./src/features/weight/components/EditWeightForm.tsx` to include `unitPreference?: 'kg' | 'lbs';`.
[ ] ID: 167: Update `EditWeightForm` component in `./src/features/weight/components/EditWeightForm.tsx` to destructure the new `unitPreference` prop and use it in the weight input label: `Weight ({unitPreference})`.
[ ] ID: 168: Adjust the initial state of `editedWeight` in `EditWeightForm` (`./src/features/weight/components/EditWeightForm.tsx`) to convert `record.weight` (which is in kg) to `lbs` if `unitPreference` is `'lbs'`, otherwise use `record.weight.toString()`. Ensure `toFixed(1)` for lbs display.
[ ] ID: 169: Modify the `handleSubmit` function in `EditWeightForm` (`./src/features/weight/components/EditWeightForm.tsx`) to convert `parsedWeight` from the input back to kilograms if the `unitPreference` prop is `'lbs'` before creating the `updatedRecord`.
[ ] ID: 170: Update the `Home` component (`./src/app/page.tsx`) to pass the `displayUnit` state variable as the `unitPreference` prop to the `EditWeightForm` component.
[ ] ID: 171: Add a new test case to `EditWeightForm.test.tsx` (`./src/features/weight/components/EditWeightForm.test.tsx`) to verify that the form initializes correctly, displaying the weight in pounds (`lbs`) when `unitPreference` is set to `'lbs'`.