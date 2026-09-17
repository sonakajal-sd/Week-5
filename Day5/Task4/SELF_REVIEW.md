# Self-review notes

Drafted ahead of opening the PR, to paste as inline comments once it's live on
GitHub (per Task 4: review your own diff and comment on uncertain lines).

## `Day-4/spajs-ts/src/apiClient.ts` — the `as T` cast in `get<T>()`

> Comment: "This assumes the caller passes the right `<T>` — `response.json()` is
> really `unknown` at runtime. Should we add a lightweight runtime check (e.g.
> confirming `response.headers.get('content-type')` is JSON, or a shape guard) before
> trusting the cast, or is that overkill for this project's scope?"

## `Day-4/spajs-ts/src/store.ts` — `createStorageMiddleware`'s `select` default

> Comment: "`select: (state) => state` defaults to persisting the *entire* state if
> no selector is passed. Right now `app.ts` always passes an explicit selector
> (`{ items, theme }`), so this default path is never hit in practice — should this
> default be removed, or is it worth keeping as a documented fallback for future
> callers?"

## `Day-4/spajs-ts/eslint.config.js` — newly added, not yet exercised on CI

> Comment: "This is the first ESLint config in the project. I set
> `no-unused-vars` to `warn` rather than `error` to keep the initial adoption
> low-friction — worth tightening to `error` once the team is used to it?"

## `.github/workflows/ci.yml` — coverage threshold isn't enforced

> Comment: "The workflow runs `jest --coverage` but doesn't fail the build if
> coverage drops below 70% — it only reports the number. Do we want a
> `coverageThreshold` in `jest.config.cjs` so CI actually fails on a regression,
> instead of relying on someone reading the report?"

## `Day5/Task2/README.md` — live demo

> Comment: "No live demo is deployed yet — I left this as a known gap rather than
> guessing a URL. Worth adding a GitHub Pages deploy step to `ci.yml` (or a
> separate workflow) as a follow-up?"
