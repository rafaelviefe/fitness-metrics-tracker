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

## 3. Code Quality & SOLID Principles
**The Agent must strictly adhere to these rules. Violations cause build failure.**

- **Single Responsibility:** A component renders UI. A hook handles logic. A util calculates data. Do not mix them.
- **The "15-Line Rule":**
  - Logical functions (utils/hooks) must be under **15 lines**. If longer, break it down.
  - React Components (JSX) must be under **50 lines**. If longer, extract sub-components.
- **Descriptive Naming:** `const data` is forbidden. Use `const weightLogEntries`.
- **No Magic Numbers:** Use named constants.

## 4. Testing Mandate
- **Zero-Tolerance:** No feature is "Done" without tests.
- **Unit Tests:** Required for all hooks and utility functions.
- **Integration Tests:** Required for main feature components to verify user flows.
- **Mocking:** Mock `localStorage` interactions in tests.

## 5. Error Handling
- The app must never crash (White Screen of Death).
- Use React Error Boundaries.
- If data is missing/corrupted in `localStorage`, fail gracefully and initialize default state.