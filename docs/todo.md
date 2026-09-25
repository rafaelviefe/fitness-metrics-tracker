# Project Roadmap

[x] ID: 001: Refactor `AddWeightForm` to use the `FormError` component for displaying the `submissionError` prop.
[ ] ID: 002: Update label text colors in `AddWeightForm` to use `text-[var(--foreground)]` for improved theme consistency.
[ ] ID: 003: Update label text colors in `EditWeightForm` to use `text-[var(--foreground)]` for improved theme consistency.
[ ] ID: 004: Introduce a new `useState` variable `showAddForm` in `page.tsx` to control the visibility of the `AddWeightForm`. Initialize its value by reading from `localStorage`.
[ ] ID: 005: Add a `Button` in `page.tsx` that toggles the `showAddForm` state, and conditionally render the `AddWeightForm` based on this state.
[ ] ID: 006: Implement a `useEffect` hook in `page.tsx` to persist the `showAddForm` state to `localStorage` whenever it changes.