# Project Roadmap

[x] ID: 026: Add a test to `page.test.tsx` to verify that the `WeightTargetForm` is initially hidden when no `SHOW_TARGET_FORM_PREFERENCE_KEY` is set in `localStorage`.
[x] ID: 027: Add a test to `page.test.tsx` to verify that the `WeightTargetForm` is initially visible if `SHOW_TARGET_FORM_PREFERENCE_KEY` is set to `'true'` in `localStorage`.
[ ] ID: 028: Add a test to `page.test.tsx` to verify that the `targetWeight` loaded from `localStorage` is correctly displayed in the `WeightStatisticsCard` on initial render.
[ ] ID: 029: Add a test to `page.test.tsx` to simulate saving a new `targetWeight` via the `WeightTargetForm` and verify that the `targetWeight` state and `localStorage` are updated.
[ ] ID: 030: Add a test to `page.test.tsx` to simulate clearing `targetWeight` via the `WeightTargetForm` (empty input) and verify that the `targetWeight` state becomes `null` and the `targetWeight` entry is removed from `localStorage`.
[ ] ID: 031: Add a test to `page.test.tsx` to verify that the `WeightTargetForm` clears its internal validation error when it is hidden and then re-shown.