# Project Roadmap

[ ] ID: 078: Add `clsx` and `tailwind-merge` as new dependencies to the project.
[ ] ID: 079: Update the `cn` utility function in `src/lib/utils.ts` to use `clsx` for combining class names and `tailwind-merge` for intelligently merging Tailwind CSS classes.
[ ] ID: 080: Modify `src/lib/utils.test.ts` to add a test case verifying `tailwind-merge` functionality by checking that conflicting Tailwind classes are correctly resolved (e.g., `cn('p-4', 'p-6')` should result in `p-6`).
[ ] ID: 081: Modify `src/lib/utils.test.ts` to update or add test cases that demonstrate `clsx`'s ability to handle array and object arguments for class names, replacing the current limitation test.
[ ] ID: 082: Implement sorting within the `getWeightRecords` method in `src/features/weight/repositories/weight.repository.ts` so that records are always returned sorted by `date` in descending order (newest first).
[ ] ID: 083: Add a new test case to `src/features/weight/repositories/weight.repository.test.ts` specifically to verify that `getWeightRecords` returns records sorted by date in descending order.