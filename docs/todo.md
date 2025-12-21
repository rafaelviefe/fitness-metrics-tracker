# Project Roadmap & Backlog

## Phase 1: Foundation (Current)
- [ ] **Task-001**: Initialize Next.js project with TypeScript, Tailwind, and Vitest. Setup folder structure according to `architecture.md`.
- [ ] **Task-002**: Create the `StorageService` utility (in `src/core/storage`). It must handle reading/writing JSON to `localStorage` with type safety. Write unit tests.
- [ ] **Task-003**: Implement the "Design System" foundation. Configure Tailwind theme to match `design_system.md` colors. Create a reusable `<Button />` and `<Card />` component.
- [ ] **Task-004**: Feature: Body Weight Log. Create a simple input form to save (Date, Weight) to storage. Display a raw list of entries.
- [ ] **Task-005**: Feature: Weight Chart. Implement a simple line chart (using a library like Recharts) to visualize the weight history.

## Phase 2: Exercise Tracking (Future)
- [ ] Define data model for Exercises and Sets.
- [ ] Create Exercise Registry (CRUD).