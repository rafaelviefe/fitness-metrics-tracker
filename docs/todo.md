# Project Roadmap

[x] ID: 072: Define `--card` and `--card-foreground` CSS custom properties in the `:root` and dark media query blocks in `src/app/globals.css`, mapping them to `var(--background)` and `var(--foreground)` respectively.
[x] ID: 073: Define `@apply` directives for `.bg-card` and `.text-card-foreground` within a `@layer components` block in `src/app/globals.css`, using the `--card` and `--card-foreground` CSS variables.
[x] ID: 074: Add an optional boolean prop `isError` to the `InputProps` interface in `src/components/ui/Input.tsx`.
[x] ID: 075: Modify the `Input` component implementation in `src/components/ui/Input.tsx` to apply `border-red-500` and `focus-visible:ring-red-500` classes when the `isError` prop is true.
[x] ID: 076: Update `src/features/weight/components/AddWeightForm.tsx` to pass the component's `error` state (converted to a boolean) to the `Input` component's new `isError` prop.
[ ] ID: 077: Update `src/features/weight/components/EditWeightForm.tsx` to pass the component's `error` state (converted to a boolean) to both `Input` components' new `isError` prop.