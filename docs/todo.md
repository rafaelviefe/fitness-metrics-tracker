# Project Roadmap

[x] ID: 054: Update `EditWeightFormProps` interface to include `onSave` and `onCancel` function props, and update the component signature to accept them.
[x] ID: 055: Add `useState` hooks for `editedWeight` (string), `editedDate` (string), and `error` (string or null) in `EditWeightForm`, initializing them from the `record` prop. Convert `record.date` to `YYYY-MM-DDTHH:mm` format for `datetime-local` input.
[ ] ID: 056: Refactor the `EditWeightForm` JSX from a placeholder `div` to a `form` element, adding a basic `className`. Import `Input` and `Button` components.
[ ] ID: 057: Render an `Input` component for the weight field within `EditWeightForm`, setting `id`, `type="number"`, `step="0.1"`, `placeholder`, `value` from `editedWeight` state, and an `onChange` handler (`handleWeightChange`). Include an associated `label`.
[ ] ID: 058: Render an `Input` component for the date field within `EditWeightForm`, setting `id`, `type="datetime-local"`, `value` from `editedDate` state, and an `onChange` handler (`handleDateChange`). Include an associated `label`.
[ ] ID: 059: Render "Save Changes" and "Cancel" `Button` components within `EditWeightForm`. Set "Save Changes" `type="submit"`. Set "Cancel" `variant="outline"` and attach `onCancel` to its `onClick` handler. Add basic layout (e.g., `space-x-2`) for the buttons.