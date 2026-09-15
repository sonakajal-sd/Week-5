# Task 3 — Third-Party Types

## Step 1 — check what the SPA actually imports

```
grep -rn "from \"[a-zA-Z]" src --include="*.ts"
```

This searches for imports that don't start with `./` or `../` (i.e. a
package from `node_modules`, not one of our own files). It found nothing.

**Conclusion:** the app code in `src/` has zero third-party runtime
dependencies — it's plain DOM APIs (`document.createElement`,
`localStorage`, `crypto.randomUUID`, `history.pushState`, etc.), all of
which already have types built into TypeScript's `lib.dom.d.ts` (which we
included via `"lib": ["ES2020", "DOM"]` in `tsconfig.json`). So there was
nothing to install `@types/...` for on the app side.

## Step 2 — @types/node, and why we still want it

Even with no runtime dependency on Node, this project's *tooling* runs on
Node (npm scripts, and soon `jest.config.js` / test files). Without
`@types/node`, TypeScript has no idea what `process`, `__dirname`, or
`module` are.

**Before installing `@types/node`**, compiling a file that uses Node
globals fails:

```ts
console.log(process.env.NODE_ENV);
console.log(__dirname);
```

```
error TS2580: Cannot find name 'process'. Do you need to install type
definitions for node? Try `npm i --save-dev @types/node`.
error TS2304: Cannot find name '__dirname'.
```

Notice TypeScript's error message literally tells you the fix.

**After running:**

```
npm install --save-dev @types/node
```

The same snippet compiles with zero errors, and in an editor you now get
real autocomplete for Node globals — for example typing `process.` shows
`.env`, `.argv`, `.exit()`, etc. with their real types (`process.env` is
`NodeJS.ProcessEnv`, `process.argv` is `string[]`), instead of every
property being `any` or "not defined".

## Step 3 — re-ran the typecheck after installing

```
npx tsc --noEmit
```

Result: no new errors in `src/`. `@types/node` only adds *global* type
declarations (like `process`), it doesn't change how any existing DOM code
is checked, so the app code was unaffected.

## Step 4 — libraries with no `@types` package

None needed here — there are no untyped third-party libraries in this
project. If one showed up later (say, a small untyped npm utility), the
fix would be a minimal hand-written declaration file in `src/types/`, e.g.:

```ts
// src/types/some-untyped-lib.d.ts
declare module "some-untyped-lib" {
  export function doThing(input: string): number;
}
```

That's just enough to stop `import { doThing } from "some-untyped-lib"`
from being an implicit `any` — it doesn't need to describe the whole
library, only the parts this project actually calls.
