# Architectural Constitution & Technical Constraints

## 1. Tech Stack
- **Framework:** Next.js (App Router).
- **Language:** TypeScript (Strict mode).
- **State Management:** React Context + Hooks (Keep it native).
- **Persistence:** Browser `localStorage` (MVB). *Do not implement a backend database yet.*
- **Testing:** Vitest + React Testing Library.
- **Styling:** Tailwind CSS.

## 2. Architecture Pattern: Feature-Sliced (DDD-Lite)
We avoid "spaghetti code" by organizing around **Business Features**, not technical types.

### Folder Structure Rules:
- `src/features/{feature-name}/`: Contains all logic for a specific domain (e.g., `weight-log`, `exercise-library`).
  - `/components`: UI elements specific to this feature.
  - `/hooks`: Logic and state management.
  - `/types.ts`: Domain models.
- `src/components/ui/`: Shared, dumb UI atoms (Buttons, Inputs) following the Design System.
- `src/core/`: Shared utilities (Dates, Math, Storage wrappers).

## 3. Code Quality & Principles (Honor System)
**Note:** Automated linting is disabled to save resources. The Agent is trusted to produce clean code by default.

- **Atomic Complexity:** - Prefer many small files over one large file.
  - If a file exceeds 100 lines, you MUST consider refactoring it immediately.
- **Naming:** - Use Descriptive Naming (`userWeightInKg` vs `w`).
  - Boolean variables should start with `is`, `has`, or `should`.
- **Comments:** - Do not comment *what* code does (the code speaks).
  - Comment *why* complex business logic exists.

## 4. Testing Mandate
- **Zero-Tolerance:** No feature is "Done" without tests.
- **Unit Tests:** Required for all hooks and utility functions.
- **Integration Tests:** Required for main feature components to verify user flows.
- **Mocking:** Mock `localStorage` interactions in tests.

## 5. Error Handling
- The app must never crash (White Screen of Death).
- Use React Error Boundaries.
- If data is missing/corrupted in `localStorage`, fail gracefully and initialize default state.