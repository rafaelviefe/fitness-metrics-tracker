# Project Roadmap

[x] ID: 020: Create the initial `WeightTargetForm` component file with basic structure.
[x] ID: 021: Update `src/app/page.tsx` to use `weightRepositoryRef.current.getTargetWeight()` for initial state and `weightRepositoryRef.current.setTargetWeight()` for persistence of the `targetWeight`.
[x] ID: 022: Integrate the `WeightTargetForm` into `src/app/page.tsx` by adding a `showTargetForm` state and a button to toggle its visibility.
[ ] ID: 023: Implement `handleSaveTargetWeight` and `handleCancelTargetWeight` functions in `src/app/page.tsx` and pass them as props to the `WeightTargetForm`.
[ ] ID: 024: Add a new `targetValue?: number | null;` prop to `WeightStatisticsCardProps` and modify `WeightStatisticsCard.tsx` to display this value if provided (without a date).
[ ] ID: 025: Render a `WeightStatisticsCard` instance in `src/app/page.tsx` dedicated to displaying the `targetWeight` state using the new `targetValue` prop.