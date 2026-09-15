# Task 5 — ts-jest Setup & First Typed Tests

## What was installed

```
npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom
```

`@types/jest` gives TypeScript the types for `describe`, `it`, `expect`,
`beforeEach`, `jest.fn()`, etc. as globals, so test files don't need to
import them.

## Deviations from the plain "preset + testEnvironment: node" recipe

The task sheet's example config is `preset: 'ts-jest'` with
`testEnvironment: 'node'`. Two things had to change for *this* project:

1. **`testEnvironment` is `"jsdom"`, not `"node"`.** This app's code
   touches the DOM directly — `document.createElement`, `localStorage`,
   `history.pushState` — and the tests do too (e.g.
   `document.body.innerHTML = ...`). Plain Node has none of that. Running
   with `testEnvironment: "node"` would fail immediately with
   `ReferenceError: document is not defined`. `jest-environment-jsdom`
   (a separate package since Jest 28) provides a fake browser environment
   instead.

2. **The config file is `jest.config.cjs`, not `jest.config.js`.**
   `package.json` has `"type": "module"`, which makes plain `.js` files ES
   modules. Jest loads its config with `require()`, which can't read
   `module.exports = {...}` from an ES module — Node throws
   `exports is not defined in ES module scope`. Naming the file `.cjs`
   keeps it CommonJS regardless of the `"type"` field.

## Getting the file resolution to work: the `.js` import problem

The app's source files import each other like this:

```ts
import { createStore } from "./store.js";
```

That `.js` ending is required by real ES modules in the browser (you must
name the actual output file), even though the source file on disk is
`store.ts`. Running `npx jest` for the first time failed every suite with:

```
Cannot find module '../store.js' from 'src/tests/store.test.ts'
```

**Fix:** added a `moduleNameMapper` to `jest.config.cjs` that strips a
trailing `.js` off relative imports before Jest tries to resolve them, so
`../store.js` resolves to `../store.ts`:

```js
moduleNameMapper: {
  "^(\\.{1,2}/.*)\\.js$": "$1"
}
```

## Moving tests off vitest

The original Week 4 tests imported test helpers from `"vitest"`
(`describe`, `it`, `expect`, `vi`, ...). Since we're using Jest now:

- Removed every `import { ... } from "vitest";` line — Jest injects
  `describe`, `it`/`test`, `expect`, `beforeEach`, etc. as globals, and
  `@types/jest` makes TypeScript aware of them.
- Renamed `vi.fn()` → `jest.fn()` (Jest's own mocking namespace).
- Renamed every `*.test.js` file to `*.test.ts`.

## Result

```
npx tsc --noEmit   →  0 errors (whole project, including tests, under strict: true)
npx jest           →  9 suites, 53 tests, all passing
```
