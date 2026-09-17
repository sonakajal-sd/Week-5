# Task Manager SPA (TypeScript)

A small single-page task manager app, built with plain TypeScript and the browser DOM
APIs (no framework). It has client-side routing, a Redux-style store/reducer for state,
and localStorage persistence for tasks and theme.

> This README documents the project at `Day-4/spajs-ts`.

## What it does

- Lets you view, add, complete, and delete tasks.
- Has four pages — Home, Task list, Task detail, Settings — navigated with a tiny
  hash-free client-side router.
- Remembers your tasks and light/dark theme choice across page reloads
  (via localStorage).
- Shows a loading/error state while "async" work is happening, using a small
  dispatch-based helper instead of scattering `try/catch` everywhere.

## Live demo

Not deployed yet — the project includes a `404.html` fallback so it's ready to be
hosted on GitHub Pages, but no live URL exists at this point. Run it locally with the
steps below.

## Tech stack

- **TypeScript** (strict mode) — the entire app, no `any`.
- **Vanilla DOM APIs** — no UI framework; pages/components are plain functions that
  build and return `HTMLElement`s.
- **Jest** + **ts-jest** + **jest-environment-jsdom** — unit tests that run against a
  simulated DOM.
- **ESLint** + **typescript-eslint** — linting.
- **npm** for scripts/dependencies.

## TypeScript features used

- `strict: true` compiler option (see [TYPESCRIPT_DECISIONS.md](./TYPESCRIPT_DECISIONS.md)).
- **Discriminated unions** — the `Action` type in `src/types.ts`, so `store.dispatch(...)`
  is type-checked end to end.
- **Generics** — `ApiClient.get<T>()`, `Queue<T>`, `loadPersistedState<T>()`.
- **Utility types** — `Partial<AppState>`, `Pick<AppState, "items" | "theme">`, and the
  intersection `Partial<TaskItem> & { id: string }` for partial updates.
- **Type-only imports** (`import type { ... }`) to keep type information separate from
  runtime imports.
- **Path aliases** (`@utils`, `@components/*`) configured in `tsconfig.json`.
- Full JSDoc on every generic/union/utility type explaining what it does and why
  (see the source files directly, or [ARCHITECTURE.md](./ARCHITECTURE.md) for an overview).

## Folder structure

```
Day-4/spajs-ts/
├── index.html            # entry HTML, loads src/app.js as a module
├── 404.html              # GitHub Pages SPA fallback
├── styles.css
├── src/
│   ├── app.ts            # wires everything together: store, router, nav, theme
│   ├── types.ts          # shared types: AppState, Action, Store, PageComponent...
│   ├── store.ts          # createStore, middleware, localStorage helpers
│   ├── reducer.ts        # (state, action) => newState
│   ├── router.ts         # tiny client-side router
│   ├── apiClient.ts      # generic fetch wrapper
│   ├── async.ts          # runAsync() — dispatches loading/error around a task
│   ├── queue.ts          # generic Queue<T>
│   ├── utils.ts          # small helpers
│   ├── components/       # button.ts, card.ts, modal.ts — reusable DOM builders
│   ├── pages/            # home.ts, list.ts, detail.ts, settings.ts
│   └── tests/            # one *.test.ts per source file (mirrors src/ layout)
├── tsconfig.json
├── tsconfig.declarations.json
├── eslint.config.js
├── jest.config.cjs
└── package.json
```

## How to run

```bash
cd Day-4/spajs-ts
npm install
npm run dev
```

`npm run dev` serves the folder statically (via `serve`) at http://localhost:5500.

## How to test

```bash
npm test              # run the Jest suite once
npm run test:coverage # run with a coverage report
```

## How to type-check

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # eslint .
```
