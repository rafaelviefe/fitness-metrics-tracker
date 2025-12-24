# Project Roadmap

[!] ID: 007: Centralize `cn` utility function in `src/lib/utils.ts` using `clsx` and `tw-merge` and update `Button` and `Card` components to import it.
[ ] ID: 008: Implement logic on the `Home` page to fetch and display existing weight records using `WeightRepository`.
[ ] ID: 009: Create a dedicated `WeightRecordItem` component to display a single weight record, potentially utilizing the `Card` component.
[ ] ID: 010: Add a form to the `Home` page for users to input and add new weight records using `WeightRepository.addWeightRecord`.
[ ] ID: 011: Implement delete functionality for individual weight records on the `Home` page, integrating with `WeightRepository.deleteWeightRecord`.
[ ] ID: 012: Implement edit functionality for existing weight records, allowing users to modify a record's weight or date.