# Project Roadmap

[x] ID: 026: Implement `useState` for the weight input value (e.g., `weight`) in the `AddWeightForm` component.
[x] ID: 027: Connect the `Input` component's `value` and `onChange` props to the new `weight` state in `AddWeightForm`.
[x] ID: 028: Wrap the `Input` and `Button` components within a `<form>` element in `AddWeightForm.tsx`.
[ ] ID: 029: Define a `handleSubmit` function in `AddWeightForm` that prevents the default form submission and logs the current `weight` state.
[ ] ID: 030: Add a prop `onWeightAdded?: (weight: number) => void;` to the `AddWeightFormProps` interface in `AddWeightForm.tsx`.
[ ] ID: 031: Call the `onWeightAdded` prop with the current `weight` value inside `AddWeightForm`'s `handleSubmit` function.