# Project Roadmap

[x] 002: Setup CI/CD Pipeline and GitHub Actions.
[x] 003: Create `StorageService` interface and a specific `LocalStorageAdapter` in `src/core/storage/`. Just the reading/writing logic. Tests required.
[x] 004: Create a specialized `WeightRepository` in `src/features/weight/repositories/`. It should use the `StorageService` to save/load weight records. Tests required.
[x] 005: Create the UI atom: `<Button />` in `src/components/ui/`. Implementation must match `design_system.md`.
[x] 006: Create the UI atom: `<Card />` in `src/components/ui/`. Simple container with tailwind classes from design system.
[x] 007: Create the UI atom: `<Input />` in `src/components/ui/`. A styled HTML input for numbers/text.