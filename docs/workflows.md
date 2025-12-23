# Infrastructure & Workflows

## Overview
This project relies on a strict "Quality Gate" pipeline. The infrastructure is serverless, event-driven, and designed for fully autonomous development.

## 1. CI Pipeline (GitHub Actions)
**File:** `.github/workflows/ci.yml`
**Trigger:** - Push to `dev` or any feature branch.
- Pull Request to `main`.

**Jobs:**
1. **Testing:** Runs `vitest` to verify logic and regressions.
2. **Build Check:** Runs `next build` to ensure type safety and compilability.
*Note: Linting is disabled. The Agent is responsible for code cleanliness.*

## 2. Deployment (Vercel)
**Project:** Fitness Metrics Tracker
**Triggers:**
- **Preview:** Automatically deploys a preview URL for every Pull Request.
- **Production:** Automatically deploys to the live URL when code is merged into `main`.

## 3. The Development Cycle (Autonomous Protocol)

The Agent must strictly follow this cycle to prevent conflicts and ensure clean history:

1.  **Sync & Plan:**
    * Checkout `main` branch.
    * Pull latest changes.
    * Read `todo.md` to select the next task.

2.  **Implementation:**
    * Create a branch: `feat/{task-id}-{timestamp}`.
    * Write code and tests.
    * Run `npm test` locally.

3.  **Delivery (Zero-Touch):**
    * Push the branch to origin.
    * Create a Pull Request (PR) targeting `main`.
    * **Auto-Merge:** The Agent enables "Auto-Merge" (Squash).
    * `todo.md` is updated on the feature branch to mark the task as done.

4.  **Planning Mode (Cycle End):**
    * When all tasks are checked, the Agent analyzes `todo.md` and appends new tasks.