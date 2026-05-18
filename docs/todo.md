# Project Roadmap

[x] ID: 125: Add `addedDate` state, `dateError` state, and `handleDateChange` to `src/features/weight/components/AddWeightForm.tsx`, initializing date with current local time.
[x] ID: 126: Render a labeled `datetime-local` input field in `src/features/weight/components/AddWeightForm.tsx`, bound to the new `addedDate` state and `dateError`.
[x] ID: 127: Implement date validation logic within `AddWeightForm`'s `handleSubmit` function in `src/features/weight/components/AddWeightForm.tsx`, setting `dateError` if invalid.
[x] ID: 128: Define a new utility function `formatDateWithTimeForDisplay` in `src/lib/date-utils.ts` that formats an ISO date string to include time (e.g., "Month Day, Year, HH:MM AM/PM").
[x] ID: 129: Modify `WeightStatisticsCardProps` in `src/features/weight/components/WeightStatisticsCard.tsx` to include an optional `displayTime?: boolean` prop.
[ ] ID: 130: Update `WeightStatisticsCard.tsx` to conditionally use `formatDateWithTimeForDisplay` if `displayTime` prop is true and a record is present, otherwise use `formatDateForDisplay`.