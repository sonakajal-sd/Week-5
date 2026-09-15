# Task 7 — Coverage on the TypeScript Project

## Running coverage

```
npx jest --coverage
```

`jest.config.cjs` already tells `ts-jest` which files count towards
coverage (`collectCoverageFrom`), skipping `src/tests/**` (the tests
themselves), `src/app.ts` (just wires everything together on page load,
nothing to unit test) and `src/types.ts` (only type declarations, no
runtime code).

## Does coverage map back to the original .ts files?

Yes. The report below lists `.ts` filenames (`store.ts`, `router.ts`,
etc.), not compiled `.js` output — because `ts-jest` compiles each file in
memory and hands Jest a source map, coverage lines up with the real
TypeScript source, not some generated file we'd have to translate back.

## Before adding more tests

```
File            | % Stmts | % Branch | % Funcs | % Lines
----------------|---------|----------|---------|--------
async.ts        |     100 |       50 |     100 |     100
card.ts         |   88.88 |       20 |   66.66 |   88.88
modal.ts        |   93.02 |    52.94 |    87.5 |      95
settings.ts     |     100 |       50 |     100 |     100
detail.ts       |   96.55 |    66.66 |   88.88 |     100
button.ts       |     100 |    71.42 |     100 |     100
```

Everything was already comfortably over 70% on statements and lines, but
several files were below 70% on **branches** — meaning the tests only ever
exercised one side of an `if`/ternary, never both.

## Files that needed more tests, and what was added

- **`async.ts`** — only ever threw a real `Error` in tests, so the
  `err instanceof Error ? ... : "Something went wrong"` fallback branch
  was untested. Added a test that throws a plain string.
- **`components/card.ts`** — had no dedicated test file at all (it was
  only exercised indirectly through page tests). Added
  `tests/components/card.test.ts` covering: default props, the clickable
  title, Enter-key vs. other-key on the title, and rendering action
  buttons.
- **`components/button.ts`** — same story, no direct test file. Added
  `tests/components/button.test.ts` covering defaults, a fully custom
  button, and the click handler.
- **`components/modal.ts`** — only Escape/Enter via `document` keydown
  were tested. Added tests for: clicking Cancel/Confirm directly, clicking
  the overlay vs. inside the modal box, passing a DOM node as `content`,
  pressing an unrelated key, closing/confirming with no callback given,
  and calling `Modal()` with no props at all.
- **`pages/settings.ts`** — only tested going light → dark. Added a test
  starting from `theme: "dark"` to cover the dark → light branch.
- **`pages/home.ts`** — only tested the "View Tasks" button. Added a test
  for the "Settings" button.
- **`pages/list.ts` and `pages/detail.ts`** — only tested submitting the
  form with a real title. Added a test submitting a blank/whitespace title
  to cover the `if (!title) return;` guard clause. `detail.ts` also got
  tests for a completed task (`Status: Done` / "Mark Pending") and for the
  loading state (`Saving...` + disabled button).
- **`reducer.ts`** — `UPDATE_ITEM` was only tested with a single matching
  item, so the "leave it alone" branch of the `.map()` ternary was never
  hit. Added a test with two items where only one gets updated.
- **`utils.ts`** — `generateId()`'s fallback (when `crypto.randomUUID`
  isn't available) was never tested. Added a test that temporarily
  removes `crypto.randomUUID` with `Object.defineProperty`, then restores
  it.
- **`store.ts`** — `createStorageMiddleware`'s default `select` function,
  and both `catch` blocks (`localStorage.setItem` throwing,
  `JSON.parse` throwing on bad data) were untested. Added tests for all
  three, using `jest.spyOn` to force `setItem` to throw and a broken JSON
  string to force `JSON.parse` to throw.
- **`router.ts`** — the "root element missing" guard clause, the
  `popstate` browser back/forward listener, and the `... || "/"` fallback
  for a query-string-only path were all untested. Added one test for each.

## After adding tests

```
File            | % Stmts | % Branch | % Funcs | % Lines
----------------|---------|----------|---------|--------
All files       |   99.71 |      100 |   98.66 |     100
```

Every file is now at 100% branches and 100% lines, except `detail.ts`
(98.27% statements / 88.88% functions — still far above the 70% target).
97 tests, all passing.
