# Task 5 — Checkpoint 1 Review Preparation

## Q1: Walk me through how your generic `ApiClient<T>` type system works

> Note: in this project the class itself isn't generic — it's the `get` **method**
> that's generic: `apiClient.get<T>(path)`. Here's how it works.

```ts
export class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`Request to ${path} failed with status ${response.status}`);
    }
    return (await response.json()) as T;
  }
}
```

- `<T>` is a **generic type parameter** — a placeholder type that isn't decided until
  someone calls the method. It's like a function parameter, but for types instead of
  values.
- The caller fills it in at the call site: `apiClient.get<TaskItem[]>("/items")`
  returns `Promise<TaskItem[]>`, while `apiClient.get<User>("/users/1")` returns
  `Promise<User>`. One method body, many return-type shapes — I don't have to write
  `getTasks()`, `getUser()`, etc. separately.
- Inside the method, `response.json()` actually returns `Promise<any>` at
  runtime — TypeScript can't know what shape the JSON really is. The `as T` is a
  **type assertion**: it tells the compiler "trust me, treat this as `T`." That's the
  honest limit of this pattern — it's compile-time safety for the *caller*, not a
  runtime guarantee that the server actually sent that shape. If I wanted the runtime
  guarantee too, I'd add a validation step (e.g. a schema check) before the cast.
- Because it's generic rather than typed as `any`, every place that calls `.get<T>()`
  still gets full autocomplete and type-checking on the result — the type just isn't
  locked in until the call site chooses it.

## Q2: Why did you use a discriminated union for API responses?

In this project, the discriminated union I actually built is `Action` (in
`src/types.ts`), used for `store.dispatch(...)`, not a dedicated `ApiResponse<T>`
union — I don't have a "call an endpoint, get back success/error" flow yet, just
`ApiClient.get<T>()`, which currently either resolves or throws.

What I do have that plays the same role is state-level: `AppState` carries `loading`
and `error` fields, and `SET_LOADING` / `SET_ERROR` actions (both part of the `Action`
union) update them. `runAsync()` in `async.ts` wraps a task and dispatches those
actions around it — so the "was this successful, loading, or failed" information
lives in the union of possible actions/state, not in a return-value union from the
fetch call itself.

If I extended this to have a real `ApiResponse<T>` union, I'd do it the same way as
`Action`:

```ts
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

The reason to prefer that shape over "return `T`, throw on failure" (what
`ApiClient.get` does now) is the same reason I used it for `Action`: a discriminated
union forces the caller to handle both cases explicitly — TypeScript won't let you
read `.data` without first checking `status === "success"`, and it narrows
automatically once you do. A thrown exception doesn't show up in the return type at
all, so nothing stops a caller from forgetting the `try/catch`.

## Q3: What does `strict: true` enable, and why does it make codebases safer?

`strict: true` in `tsconfig.json` is a single flag that turns on a whole family of
checks together, including:

- **`noImplicitAny`** — every variable/parameter must have a known type; no silent
  fallback to `any`.
- **`strictNullChecks`** — `null` and `undefined` are only assignable where a type
  explicitly allows them. This is the one that catches the most real bugs — e.g. it
  forces me to handle the case where `document.getElementById("nav")` might return
  `null` (see `renderNav()` in `app.ts`), instead of crashing at runtime with
  "cannot read property of null."
- **`strictFunctionTypes`**, **`strictBindCallApply`**, **`strictPropertyInitialization`**,
  **`noImplicitThis`**, **`alwaysStrict`**, **`useUnknownInCatchVariables`** — tighter
  checks on function assignability, class field initialization, `this` binding, and
  treating caught errors as `unknown` rather than `any` (so I have to narrow
  `err instanceof Error` before reading `err.message`, which I do in `async.ts`).

Why this makes the codebase safer: without `strict`, TypeScript is much closer to
"JavaScript with some optional annotations" — it'll happily let `any` leak in and
won't flag a possibly-missing value. With `strict` on, a whole category of the most
common JS runtime errors (`TypeError: cannot read property of undefined`, `undefined
is not a function`) gets caught at compile time instead of in production. It also
means every contributor is held to the same bar automatically — there's no way to
accidentally write a looser file, because the compiler rejects it project-wide.

## 30-day growth plan for Phase 2

**Node.js (3 topics)**
1. **Express fundamentals & middleware** — routing, request/response lifecycle,
   error-handling middleware, so I can build the backend for the APIs this SPA has
   so far only faked with `ApiClient`.
2. **Working with a real database (SQL or MongoDB) via an ORM/driver** — schema
   design, queries, and connecting that to TypeScript types (e.g. Prisma's generated
   types) so the "type flows from the database to the frontend" story is complete.
3. **Async patterns & error handling at scale** — structured logging, retries, and
   proper error boundaries in a Node service, going beyond the single `try/catch` in
   `runAsync()`.

**React (3 topics)**
1. **Components, props, and state with TypeScript** — translating what I already know
   from the plain-DOM `PageComponent` pattern into `FC<Props>` components and
   `useState`.
2. **`useEffect` and data fetching** — replacing my hand-rolled router/store with
   React's lifecycle model, and typing fetch results the way `ApiClient.get<T>` does
   now.
3. **Context + a lightweight state manager (e.g. Zustand or Redux Toolkit)** — since
   I already built a store/reducer/middleware by hand here, learning how a real
   library packages the same ideas (and what it adds, like selectors and devtools).

**TypeScript (1 topic)**
1. **Conditional and mapped types** (e.g. `T extends U ? X : Y`, `{ [K in keyof T]: ... }`) —
   I used built-in utility types (`Partial`, `Pick`) this phase but haven't written my
   own from scratch. This is the natural next step before Phase 2's bigger codebases.
