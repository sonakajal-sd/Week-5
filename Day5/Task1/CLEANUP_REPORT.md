# Task 1 — Final Clean-up

Target project: `Day-4/spajs-ts` (the TypeScript SPA built in Week 5).

## 1. `tsc --noEmit`

```
cd Day-4/spajs-ts
npx tsc --noEmit
```

Result: **0 errors**.

## 2. ESLint

The project didn't have ESLint set up yet, so as part of this clean-up I added it:

- Installed `eslint`, `@eslint/js`, and `typescript-eslint` as dev dependencies.
- Added `eslint.config.js` (flat config) using `tseslint.configs.recommended` on top of
  `eslint.configs.recommended`.
- Added an `npm run lint` script (`eslint .`).
- Ignored `dist/`, `coverage/`, `node_modules/`, and `jest.config.cjs` (a CommonJS build
  file that isn't part of the app source).

```
npm run lint
```

Result: **0 warnings, 0 errors**.

## 3. `jest --coverage`

```
npm run test:coverage
```

Result:

- Test Suites: 15 passed, 15 total
- Tests: 97 passed, 97 total
- Coverage: 99.71% statements / 100% branches / 98.66% functions / 100% lines
  (every file is at or above the 70% bar — most are at 100%).

## 4. Dead code / debug logs / TODOs

Searched `src/` for:

- `console.log` / `console.debug` — **none found**.
- `TODO` / `FIXME` comments — **none found**.
- Commented-out code (lines starting with `//` that look like disabled statements) —
  none found. The handful of `//` lines that matched a first pass were explanatory
  comments (e.g. describing why `Action` is a union, or how `ApiClient.get<T>` works),
  not dead code, so they were left in place.

No files needed edits for this part — the codebase from Day 4 was already clean.

## 5. Verify zero `any`

```
npx tsc --strict --noEmit 2>&1 | grep -i any
```

Result: **empty output** — confirmed no usage of `any` anywhere in `src/`.

## Summary

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ 0 errors |
| ESLint | ✅ 0 warnings/errors (newly configured) |
| `jest --coverage` | ✅ 97/97 tests pass, ~99–100% coverage |
| Dead code / console.logs / TODOs | ✅ none found |
| `any` usage | ✅ none found |
