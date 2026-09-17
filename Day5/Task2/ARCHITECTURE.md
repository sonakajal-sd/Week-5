# Architecture

This describes how the modules in `Day-4/spajs-ts/src` fit together.

## Module diagram

```
                        ┌─────────────┐
                        │  index.html │
                        └──────┬──────┘
                               │ loads
                               ▼
                        ┌─────────────┐
                        │   app.ts    │  entry point: builds store + router,
                        └──────┬──────┘  renders nav, kicks off first route
                 ┌─────────────┼─────────────────┐
                 ▼             ▼                 ▼
          ┌────────────┐ ┌───────────┐    ┌─────────────┐
          │  store.ts  │ │ router.ts │    │  types.ts   │
          │ createStore│ │ register  │    │ (shared     │
          │ middleware │ │ navigate  │    │  types used │
          └──────┬─────┘ └─────┬─────┘    │  everywhere)│
                 │             │          └─────────────┘
                 ▼             ▼
          ┌────────────┐ ┌────────────────────────────┐
          │ reducer.ts │ │           pages/            │
          │ (state,    │ │ home.ts / list.ts /         │
          │  action)   │ │ detail.ts / settings.ts     │
          │  => state  │ │ (each is a PageComponent)   │
          └────────────┘ └───────────┬─────────────────┘
                                      │ build UI with
                                      ▼
                             ┌────────────────────┐
                             │    components/      │
                             │ button.ts / card.ts  │
                             │ modal.ts             │
                             └────────────────────┘

          ┌────────────┐   ┌────────────┐   ┌────────────┐
          │apiClient.ts│   │  async.ts  │   │  queue.ts  │
          │ generic    │   │ dispatches │   │ generic    │
          │ fetch<T>() │   │ loading/   │   │ Queue<T>   │
          │            │   │ error      │   │ (FIFO)     │
          └────────────┘   └────────────┘   └────────────┘
                (support modules, used where needed
                 by pages/store — not always wired to
                 every page in this small demo app)
```

## How a user action flows through the app

1. **`app.ts`** builds the initial `AppState` (seeded or loaded from
   localStorage via `loadPersistedState`), creates the `store` with the
   `reducer` and a storage middleware, and creates the `router`.
2. The **router** (`router.ts`) matches the current URL to a registered
   `PageComponent` and calls it with `PageProps` (`state`, `store`, `navigate`,
   `params`).
3. A **page** (`pages/*.ts`) renders DOM using shared **components**
   (`components/*.ts`) and wires up event listeners that call
   `store.dispatch(...)` with an `Action`.
4. **`store.ts`** runs the action through the **reducer** (`reducer.ts`),
   which returns a new `AppState` (never mutates the old one).
5. The store notifies **subscribers** — `app.ts` re-applies the theme, and
   the storage middleware persists `{ items, theme }` back to localStorage.
6. For anything that needs to look async (e.g. loading remote data via
   `apiClient.ts`), `async.ts`'s `runAsync()` wraps the work and dispatches
   `SET_LOADING` / `SET_ERROR` actions around it, so pages don't need their
   own `try/catch` boilerplate.

## Why this shape

- **One-way data flow** (dispatch → reducer → new state → re-render) keeps
  state changes predictable and easy to test — see `src/tests/reducer.test.ts`.
- **Pages and components are plain functions**, not classes or a framework's
  component model, which keeps the TypeScript surface small: a `PageComponent`
  is just `(props: PageProps) => HTMLElement`.
- **Middleware** (`Middleware` type in `store.ts`) lets cross-cutting concerns
  (persistence) live outside the reducer, instead of the reducer knowing
  about localStorage.
