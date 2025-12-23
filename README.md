# Self-Evolving Fitness Tracker

## Project Overview
This is a **Fitness Metrics Tracker** built entirely by an Autonomous AI Agent using a "One-Day-One-Commit" methodology. The goal is to build a high-value, resilient frontend application for tracking physical progress (Weights, PRs, Goals) without a dedicated backend.

## Structure
- `docs/todo.md`: The active roadmap.
- `docs/architecture.md`: Technical constraints.
- `src/`: Application source code.

## The "Self-Developing" Protocol
This repository is managed by an AI Agent.
1. **Cadence:** The Agent picks the top task from `docs/todo.md` every day.
2. **Execution:** It implements the feature, writes tests, and updates documentation.
3. **Validation:** No code is merged unless all tests pass.
4. **Evolution:** The Agent is responsible for proposing new features in `docs/todo.md` after completing a milestone.

## How to Start (Human Supervisor)
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Run tests: `npm run test`

*Note: Do not modify `src/` manually unless fixing a critical breakage the Agent cannot resolve.*