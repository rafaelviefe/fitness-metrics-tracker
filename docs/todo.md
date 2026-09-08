# Project Roadmap

[ ] ID: 220: Add a test to `src/app/page.test.tsx` that simulates adding a new weight record via `AddWeightForm`, asserting that the new record appears in the list and relevant statistics cards are updated with the new data.
[ ] ID: 221: Add a test to `src/app/page.test.tsx` that simulates deleting a weight record, asserting that the record is removed from the UI and statistics are re-calculated.
[ ] ID: 222: Add a test to `src/app/page.test.tsx` that verifies clicking the "Edit" button on a `WeightRecordCard` correctly displays the `EditWeightForm` for that record.
[ ] ID: 223: Add a test to `src/app/page.test.tsx` that verifies clicking the "Cancel" button in `EditWeightForm` correctly reverts to displaying the `WeightRecordCard`.
[ ] ID: 224: Add a test to `src/app/page.test.tsx` that simulates editing a weight record and saving the changes, asserting that the `WeightRecordCard` displays the updated values and statistics are refreshed.
[ ] ID: 225: Add a test to `src/app/page.test.tsx` that verifies changing the `displayUnit` preference from 'kg' to 'lbs' correctly updates the displayed unit and converted weight values in all `WeightRecordCard`s and `WeightStatisticsCard`s.