# Infrastructure & Workflows

## Overview
This project relies on a strict "Quality Gate" pipeline. The infrastructure is serverless and event-driven.

## 1. CI Pipeline (GitHub Actions)
**File:** `.github/workflows/ci.yml`
**Trigger:** - Push to `dev`
- Pull Request to `main`

**Jobs:**
1. **Linting:** Runs `next lint .` to ensure code style consistency.
2. **Testing:** Runs `vitest` to verify logic.
3. **Build Check:** Runs `next build` to ensure type safety and compilability.

**Rule:** The Agent must ensure the `CI Quality Check` passes before requesting a review. If this fails, the Agent must self-correct.

## 2. Deployment (Vercel)
**Project:** Fitness Metrics Tracker
**Triggers:**
- **Preview:** Automatically deploys a preview URL for every Pull Request.
- **Production:** Automatically deploys to the live URL when code is merged into `main`.

## 3. The Development Cycle
1. **Agent** reads `todo.md`.
2. **Agent** creates a new branch (e.g., `feat/weight-chart`).
3. **Agent** pushes code.
4. **GitHub Actions** validates the code.
5. **Vercel** deploys a preview.
6. **Agent** creates a PR.
7. **Human** reviews and merges to `main`.