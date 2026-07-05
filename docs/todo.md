# Project Roadmap

[x] ID: 166: Modify `EditWeightFormProps` interface in `./src/features/weight/components/EditWeightForm.tsx` to include `unitPreference?: 'kg' | 'lbs';`.
[x] ID: 167: Update `EditWeightForm` component in `./src/features/weight/components/EditWeightForm.tsx` to destructure the new `unitPreference` prop and use it in the weight input label: `Weight ({unitPreference})`.