# PR: Week 5 — TypeScript SPA (Phase 1 Checkpoint 1)

**Branch:** `week5-day2` → `main`

## What this project is

A small single-page Task Manager app built in TypeScript with no framework —
plain DOM APIs, a hand-rolled client-side router, and a Redux-style
store/reducer/middleware for state. It started as a vanilla-JS SPA (Week 4) and was
migrated to TypeScript with `strict: true` across Week 5, ending with this
finalization pass: ESLint setup, JSDoc on every non-trivial type, project docs, and
a CI workflow.

Project lives at `Day-4/spajs-ts`; this PR's final commits (Week 5 Day 5) add:
- `Day5/Task1` — clean-up verification report (tsc/ESLint/jest, zero `any`).
- `Day5/Task2` — README, ARCHITECTURE, TYPESCRIPT_DECISIONS, and JSDoc on every
  generic/union/utility type in the source.
- `.github/workflows/ci.yml` — runs typecheck/lint/test on every PR to `main`.
- `Day5/Task3` – `Task6` — polish notes, checkpoint prep, and reflection.

## TypeScript patterns used

- **Discriminated unions** — `Action` in `src/types.ts` gives `store.dispatch(...)`
  compile-time safety and lets the reducer narrow `action.payload` per `case`.
- **Generics** — `ApiClient.get<T>()`, `Queue<T>`, `loadPersistedState<T>()`.
- **Utility types** — `Partial<AppState>`, `Pick<AppState, "items" | "theme">`, and
  the intersection `Partial<TaskItem> & { id: string }` for partial updates.
- **`strict: true`** end to end — no `any` anywhere in `src/`.
- **Type-only imports** (`import type`) to keep runtime imports separate from
  compile-time-only ones.

## What was most challenging

Getting comfortable with *why* a discriminated union is safer than a looser
`{ type: string; payload: any }` shape — it wasn't obvious until seeing the
reducer's `switch` actually narrow `action.payload` automatically per branch.
Deriving types from other types (`Pick`/`Partial` instead of hand-written
duplicate interfaces) was the second thing that took some repetition to trust,
since it's less immediately readable than a plain interface until you've seen it
prevent a rename bug.

## What the reviewer should focus on

1. `src/types.ts` — is the `Action` union modeled well, and is the JSDoc on it
   (and on the `Partial<TaskItem> & { id: string }` payload) actually clear?
2. `src/apiClient.ts` — the generic `get<T>()` method and its JSDoc note about the
   `as T` cast being a compile-time-only guarantee — is that limitation explained
   clearly enough?
3. `.github/workflows/ci.yml` — does the working-directory / script setup look
   right for this repo layout (project nested at `Day-4/spajs-ts`, not the repo
   root)?
4. `Day5/Task2/TYPESCRIPT_DECISIONS.md` — the five type decisions and alternatives
   considered; flag anything that doesn't hold up.

## Checklist

- [x] `tsc --noEmit` — 0 errors
- [x] `eslint .` — 0 warnings/errors
- [x] `jest --coverage` — 97/97 tests pass, ~99–100% coverage
- [x] No `any` in `src/`
- [x] README / ARCHITECTURE / TYPESCRIPT_DECISIONS added
- [x] CI workflow added
- [ ] CI verified green on this PR (confirm once the workflow runs on GitHub)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
