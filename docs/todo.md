# Project Roadmap

[x] ID: 032: Add `handleAddWeight` function to `Home.tsx`: Define `const handleAddWeight = (weight: number) => { console.log('Weight to add:', weight); };` within the `Home` component.
[x] ID: 033: Pass `handleAddWeight` to `AddWeightForm` in `Home.tsx`: Update the `AddWeightForm` component instance in `Home.tsx` to include the `onWeightAdded={handleAddWeight}` prop.
[x] ID: 034: Integrate `WeightRepository` into `handleAddWeight` in `Home.tsx`: Inside the `handleAddWeight` function, call `weightRepositoryRef.current.addWeightRecord(weight)` to persist the new weight.
[ ] ID: 035: Update `Home.tsx` state after adding a record: Modify `handleAddWeight` to use the record returned by `addWeightRecord` to update the `weightRecords` state using `setWeightRecords`, ensuring the UI reflects the new data.
[ ] ID: 036: Enhance `Home.test.tsx` to mock `WeightRepository` methods: Add `vi.mock` for `@/features/weight/repositories/weight.repository` at the top of `Home.test.tsx` to control the behavior of `addWeightRecord` and `getWeightRecords`.
[ ] ID: 037: Add test case to `Home.test.tsx` for adding a record: Write a test that simulates entering a weight in `AddWeightForm`, submitting it, and then asserts that the newly added weight record is displayed on the page.