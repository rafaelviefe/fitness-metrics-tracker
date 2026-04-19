# Project Roadmap

[x] ID: 104: Refactor `EditWeightForm` to separate its `error` state into `weightError` and `dateError` state variables, both initialized to `null`.
[x] ID: 105: Modify `EditWeightForm`'s `handleSubmit` to set `weightError` if weight validation fails and `dateError` if date validation fails, ensuring both can be set independently if their respective fields are invalid.
[ ] ID: 106: Update `EditWeightForm`'s `handleWeightChange` to clear `weightError` when the weight input changes, and `handleDateChange` to clear `dateError` when the date input changes.
[ ] ID: 107: Adjust `EditWeightForm`'s JSX to display the `weightError` message specifically below the weight input and the `dateError` message specifically below the date input, applying the `isError` prop to the respective `Input` components.
[ ] ID: 108: Create a new file `src/features/weight/utils/weight-utils.ts` and define an interface `WeightStatistics` to type the aggregated statistics (latest, highest, lowest, oldest records).
[ ] ID: 109: Implement a utility function `refreshWeightStatistics` in `src/features/weight/utils/weight-utils.ts` that accepts a `WeightRepository` instance and returns a `WeightStatistics` object by calling the appropriate repository methods.