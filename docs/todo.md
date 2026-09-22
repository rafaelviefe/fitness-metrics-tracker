# Project Roadmap

[ ] ID: 010: Add a test to `app/page.test.tsx` to verify that adding a weight record via `AddWeightForm` correctly displays the new record and updates relevant statistics (e.g., latest and average weight) on the `Home` page.
[ ] ID: 020: Add a test to `app/page.test.tsx` to verify that deleting a weight record via `WeightRecordCard` correctly removes the record from the display and updates relevant statistics on the `Home` page.
[ ] ID: 030: Add a test to `app/page.test.tsx` to verify that editing a weight record via `EditWeightForm` correctly updates the displayed record and relevant statistics on the `Home` page.
[ ] ID: 040: Add a test to `app/page.test.tsx` to verify that changing the unit preference toggle (`kg`/`lbs`) correctly updates the displayed weight units in `AddWeightForm`, `WeightRecordCard`, and `WeightStatisticsCard` components.
[ ] ID: 050: Add a test to `app/page.test.tsx` to verify that changing the display time preference toggle (`Date & Time`/`Date Only`) correctly updates the date format in `WeightRecordCard` and `WeightStatisticsCard` components.
[ ] ID: 060: Add a test to `app/page.test.tsx` to verify that changing the sort order preference correctly reorders the list of displayed `WeightRecordCard` components.