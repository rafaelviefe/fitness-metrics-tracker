# Project Roadmap

[x] ID: 204: Remove redundant `displayTime={false}` prop from the Average Weight `WeightStatisticsCard` component in `src/app/page.tsx`.
[ ] ID: 205: Update `src/features/weight/components/EditWeightForm.tsx` to initialize the `editedWeight` state with `record.weight.toFixed(1)` for consistent display formatting.
[ ] ID: 206: Adjust the test expectations in `src/features/weight/components/EditWeightForm.test.tsx` to account for the `toFixed(1)` formatting applied to `editedWeight` during initialization.
[ ] ID: 207: Update `src/components/ui/toggle-group.tsx` to harmonize the `toggleItemUnselectedVariantClasses.default` styles with the `Button` component's `variantClasses.default` styles.
[ ] ID: 208: Update `src/components/ui/toggle-group.tsx` to harmonize the `toggleItemUnselectedVariantClasses.secondary` styles with the `Button` component's `variantClasses.secondary` styles.
[ ] ID: 209: Update `src/components/ui/toggle-group.tsx` to harmonize the `toggleItemUnselectedVariantClasses.outline` styles with the `Button` component's `variantClasses.outline` styles.