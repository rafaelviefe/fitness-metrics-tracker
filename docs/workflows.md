# Infrastructure & Workflows

## Overview
This project relies on a strict "Quality Gate" pipeline. The infrastructure is serverless, event-driven, and designed for fully autonomous development.

## 1. CI Pipeline (GitHub Actions)
**File:** `.github/workflows/ci.yml`
**Trigger:** - Push to `dev` or any feature branch.
- Pull Request to `main`.

**Jobs:**
1. **Linting:** Runs `eslint .` to ensure code style consistency.
2. **Testing:** Runs `vitest` to verify logic and regressions.
3. **Build Check:** Runs `next build` to ensure type safety and compilability.

**Rule:** The Agent must ensure the `CI Quality Check` passes locally before pushing.

## 2. Deployment (Vercel)
**Project:** Fitness Metrics Tracker
**Triggers:**
- **Preview:** Automatically deploys a preview URL for every Pull Request.
- **Production:** Automatically deploys to the live URL when code is merged into `main`.

## 3. The Development Cycle (Autonomous Protocol)

The Agent must strictly follow this cycle to prevent conflicts and ensure clean history:

1.  **Sync & Plan:**
    * Checkout `main` branch.
    * Pull latest changes (`git pull origin main`).
    * Read `todo.md` to select the next task.

2.  **Branching:**
    * **CRITICAL:** Always create a NEW branch from `main`.
    * Naming convention: `feat/{task-id}-{short-description}` (e.g., `feat/task-004-weight-log`).

3.  **Implementation:**
    * Write code and tests.
    * Run `npm test` locally. **Do not push if tests fail.**

4.  **Delivery (Zero-Touch):**
    * Push the branch to origin.
    * Create a Pull Request (PR) targeting `main`.
    * **Auto-Merge:** The Agent MUST strictly enable "Auto-Merge" on the PR immediately after creation (using GitHub API).
    * *Note:* The repository is configured to automatically delete the branch after the merge is complete.

5.  **Clean Up:**
    * Delete local branch.
    * Update `journal.md` with the result.