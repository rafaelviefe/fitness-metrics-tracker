# Project Roadmap

[ ] ID: 029: Add unit tests for `WeightTargetForm` to verify initial rendering states and unit preference display, including when `initialTargetWeight` is `null` or a specific value (in `kg` or converted to `lbs`).
[ ] ID: 030: Add unit tests for `WeightTargetForm` to verify input change handling, focusing on the `editedTargetWeight` state updates and real-time clearing of `weightError` on valid input.
[ ] ID: 031: Add unit tests for `WeightTargetForm` to verify client-side validation for the weight input, specifically testing for non-positive numbers and non-numeric inputs, and ensuring the `weightError` state is set correctly.
[ ] ID: 032: Add unit tests for `WeightTargetForm` to verify the `onSave` callback is correctly invoked with a converted (to `kg`) numeric value when a valid positive number is entered and the form is submitted.
[ ] ID: 033: Add unit tests for `WeightTargetForm` to verify the `onSave` callback is correctly invoked with `null` when the weight input is left empty or cleared and the form is submitted.
[ ] ID: 034: Add unit tests for `WeightTargetForm` to verify the `onCancel` callback is correctly invoked when the "Cancel" button is clicked, and ensure no `onSave` action occurs.