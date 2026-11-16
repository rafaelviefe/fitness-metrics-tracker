# Project Roadmap

[ ] ID: 001: Update the `WeightStatistics` interface in `src/features/weight/utils/weight-utils.ts` to include `target: number | null;`.
[ ] ID: 002: Modify the `refreshWeightStatistics` function in `src/features/weight/utils/weight-utils.ts` to retrieve the target weight using `repository.getTargetWeight()` and add it to the returned `WeightStatistics` object under the `target` key.
[ ] ID: 003: Remove the `targetWeight` state (`useState`) and its corresponding `useEffect` for persistence from the `Home` component in `src/app/page.tsx`.
[ ] ID: 004: Update the `WeightStatisticsCard` component instance for "Target Weight" in `src/app/page.tsx` to pass `targetValue={weightStatistics.target}` instead of the standalone `targetWeight` state.
[ ] ID: 005: Update the `WeightTargetForm` component instance in `src/app/page.tsx` to pass `initialTargetWeight={weightStatistics.target}` instead of the standalone `targetWeight` state.
[ ] ID: 006: Modify the `handleSaveTargetWeight` callback in `src/app/page.tsx` to call `updateAllStatistics()` after successfully saving the target weight to the repository, to ensure the `weightStatistics` state is refreshed.