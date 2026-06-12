# Project Roadmap

[x] ID: 148: Add `unitPreference?: 'kg' | 'lbs';` to the `WeightStatisticsCardProps` interface in `./src/features/weight/components/WeightStatisticsCard.tsx`.
[ ] ID: 149: Pass the `displayUnit` state variable from `page.tsx` to all `WeightStatisticsCard` components as the `unitPreference` prop.
[ ] ID: 150: In `./src/features/weight/components/WeightStatisticsCard.tsx`, modify the `content` JSX to display the `unitPreference` alongside the weight.
[ ] ID: 151: In `./src/features/weight/components/WeightStatisticsCard.tsx`, import `convertKgToLbs` from `../utils/weight-utils` and apply the conversion to `record.weight` if `unitPreference` is 'lbs' before displaying.
[ ] ID: 152: Add a new test case in `./src/features/weight/components/WeightStatisticsCard.test.tsx` to verify that the component displays weight in `lbs` when `unitPreference` is set to 'lbs', including the correct unit label and conversion.
[ ] ID: 153: Add a new test case in `./src/features/weight/components/WeightStatisticsCard.test.tsx` to explicitly verify that the component displays weight in `kg` when `unitPreference` is set to 'kg'.