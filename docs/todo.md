# Project Roadmap

[x] ID: 008: Modify `app/page.tsx` to pass an `onSuccess` callback to the `AddWeightForm` component that clears the `addFormSubmissionError` state.
[x] ID: 009: In `app/page.tsx`, update the logic for toggling `showAddForm` so that when `setShowAddForm(false)` is called, `setAddFormSubmissionError(null)` is also called.
[x] ID: 010: Modify the `AddWeightForm` component in `src/features/weight/components/AddWeightForm.tsx` to accept a new `formId` prop and apply it to its root `form` element.
[x] ID: 011: In `app/page.tsx`, add the `formId="add-weight-form"` prop to the `AddWeightForm` component instance.
[ ] ID: 012: In `app/page.tsx`, add the `aria-expanded` attribute to the "Hide Add Form / Show Add Form" `Button`, dynamically setting its value based on the `showAddForm` state.
[ ] ID: 013: In `app/page.tsx`, add the `aria-controls="add-weight-form"` attribute to the "Hide Add Form / Show Add Form" `Button`, linking it to the `AddWeightForm`.