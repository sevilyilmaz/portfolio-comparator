# AGENTS.md

## Project Overview

- `portfolio-comparator` is a small Vue 3 + TypeScript app built with Vite.
- The app compares long-term portfolio outcomes, with calculations tailored to Dutch investing assumptions.
- There is no backend or router in this repo; most business logic lives in composables under `src/composables`.

## Common Commands

- Install dependencies: `pnpm install`
- Start local dev server: `pnpm dev`
- Build production bundle: `pnpm build`
- Run tests: `pnpm test`

## Code Layout

- `src/App.vue`: top-level page composition and shared app state wiring
- `src/components`: UI components for broker input, portfolio display, and layout
- `src/composables`: core calculation logic and reusable helpers
- `src/types`: shared TypeScript types
- `dist`: generated build output; do not edit manually

## Working Conventions

- Keep calculation changes focused and easy to verify, especially in `src/composables`.
- When changing financial logic, add or update Vitest coverage near the affected composable or component.
- Follow the existing code style: simple Vue components, TypeScript types in `src/types`, and colocated `*.spec.ts` tests.
- Prefer small, targeted changes over broad refactors unless the task clearly calls for one.

## Notes For Agents

- Check whether a change affects wealth tax, service fee, exit cost, or security return calculations before editing related components.
- If UI text or defaults change, confirm they still match the Netherlands-focused behavior described in the README and seeded state.
