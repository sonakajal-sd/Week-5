# TypeScript Decisions

Five type-design decisions made in `Day-4/spajs-ts`, and what was considered instead.

## 1. A discriminated union for `Action`, instead of a loose action shape

**Chosen:** `Action` is a union of exact `{ type: "..."; payload: ... }` objects
(`src/types.ts`).

**Alternative considered:** a single generic shape like
`{ type: string; payload: any }`, or `{ type: string; payload?: unknown }`.

**Why the union won:** with a loose shape, `store.dispatch({ type: "ADD_ITEM", payload: 123 })`
would compile even though `123` isn't a `TaskItem` — the bug only shows up at runtime.
With the discriminated union, that call is a compile error, and inside the reducer's
`switch (action.type)`, TypeScript automatically narrows `action.payload` to the right
type per branch. The cost is that adding a new action means touching one union
definition, which is a small, worthwhile trade for the safety.

## 2. A generic `ApiClient.get<T>()`, instead of per-endpoint methods or `any`

**Chosen:** one generic method, `get<T>(path: string): Promise<T>` (`src/apiClient.ts`),
called as `apiClient.get<User>("/users/1")`.

**Alternatives considered:**
- Return `any` from `get()` and let callers cast however they like.
- Write a separate typed method per endpoint (`getUser()`, `getTasks()`, ...).

**Why the generic won:** returning `any` defeats the point of using TypeScript at the
call site — every property access on the result would be unchecked. Per-endpoint
methods are fully safe but don't scale — every new endpoint means a new method. A
generic method is the middle ground: one implementation, and the caller supplies the
expected shape. The trade-off (documented in the JSDoc on that method) is that it's
still trusting the caller — `response.json()` is actually `unknown`, so a wrong `<T>`
won't be caught until the shape is used incorrectly elsewhere.

## 3. `strict: true` in `tsconfig.json`, instead of enabling flags one at a time

**Chosen:** `"strict": true`, which turns on `strictNullChecks`, `noImplicitAny`,
`strictFunctionTypes`, and the rest of the strict family together.

**Alternative considered:** start with a loose config and enable individual flags
(e.g. just `noImplicitAny`) as the project matured.

**Why `strict: true` won:** turning flags on individually tends to leave gaps —
it's easy to forget `strictNullChecks`, and that's the one that catches the most
real bugs (e.g. forgetting a page's `params` value could be missing). Starting
strict from day one meant every file was written against the same rules
throughout, instead of needing a later cleanup pass. See `TYPESCRIPT_DECISIONS`
in spirit with the Day 4 `TASK4_STRICT_NULLS.md` notes on this same project.

## 4. Utility types (`Partial`, `Pick`, intersections) for partial shapes, instead of hand-written interfaces

**Chosen:** derive new types from existing ones — e.g.
`type PersistedState = Partial<Pick<AppState, "items" | "theme">>` (`src/app.ts`) and
`Partial<TaskItem> & { id: string }` for the `UPDATE_ITEM` payload (`src/types.ts`).

**Alternative considered:** write a separate, hand-authored interface for each of
these shapes (e.g. `interface PersistedState { items?: TaskItem[]; theme?: string }`).

**Why the derived types won:** hand-written duplicates drift — if `AppState.theme`
were renamed, a hand-written `PersistedState` wouldn't notice and would silently
become wrong. Deriving with `Pick`/`Partial`/intersections keeps these "shapes of a
shape" tied to the one source of truth (`AppState`, `TaskItem`), so a rename is a
compile error everywhere it matters instead of a silent mismatch.

## 5. `import type` for type-only imports, instead of regular imports

**Chosen:** anywhere a module imports something used only as a type (e.g.
`import type { AppState, Action, Store } from "./types.js"` in `store.ts`), it uses
`import type` rather than a plain `import`.

**Alternative considered:** just use regular `import { AppState, Action, Store } from "./types.js"`
for everything, types included.

**Why `import type` won:** it documents intent — anyone reading the import line can
tell at a glance that `AppState`/`Action`/`Store` only exist at compile time and carry
no runtime code. It also means a bundler/transpiler can safely elide the import
entirely instead of needing to analyze usage to figure out it's type-only, which
keeps the compiled output smaller and avoids accidental circular-import issues from
type-only modules.
