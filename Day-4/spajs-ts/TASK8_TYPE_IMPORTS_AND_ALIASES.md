# Task 8 — Type-Only Imports, Path Aliases, Declaration Files

## Type-only imports

Checked every import in `src/` (excluding tests) for anything importing
*only* types, since those should use `import type` — zero runtime
overhead, and it makes intent obvious (a plain `import` might be used for
its side effects or a value; `import type` can't be).

Turns out this project already followed that rule everywhere types were
imported: `store.ts`, `reducer.ts`, `async.ts`, `router.ts`, `app.ts`, and
every page file import `AppState` / `Action` / `Store` / `PageProps` /
`PageComponent` from `./types.js` using `import type { ... }`, never a
plain `import`. Nothing needed to change here — just confirmed it with:

```
grep -rn "^import" src --include="*.ts" | grep -v "/tests/"
```

## Path aliases

Added to `tsconfig.json`:

```json
"baseUrl": ".",
"paths": {
  "@utils": ["src/utils.ts"],
  "@components/*": ["src/components/*"]
}
```

Then updated every *cross-directory* import of `utils.ts` or something
under `components/` to use the alias instead of a relative path, e.g. in
`src/pages/list.ts`:

```ts
// before
import { Button } from "../components/button.js";
import { Card } from "../components/card.js";
import { generateId } from "../utils.js";

// after
import { Button } from "@components/button.js";
import { Card } from "@components/card.js";
import { generateId } from "@utils";
```

(Files *inside* `src/components/` that import a sibling, like `card.ts`
importing `./button.js`, were left as relative imports — aliasing a file
next to you doesn't save anything and just adds noise.)

### The part that isn't obvious: `tsconfig.json` "paths" only affects the type checker

The first time `npx jest` ran after this change, every test that (even
indirectly) imported a page failed with:

```
Could not locate module @components/button.js mapped as: .../src/components/$1.
```

**Why:** `tsconfig.json`'s `paths` only tells *TypeScript's type checker*
how to resolve `@components/...` when it's checking types — it does
nothing at runtime. Jest resolves modules with its own resolver, which
has never heard of `tsconfig.json`. It needed the exact same mapping
taught to it separately, in `jest.config.cjs`:

```js
moduleNameMapper: {
  "^@utils$": "<rootDir>/src/utils.ts",
  "^@components/(.*)\\.js$": "<rootDir>/src/components/$1",
  "^(\\.{1,2}/.*)\\.js$": "$1"
}
```

And this project's third potential runtime — a real browser loading
`index.html` directly with no bundler — **still wouldn't understand
`@components/button.js` at all**. Bare specifiers like that only resolve
in a browser via an import map, or after a bundler (Vite, esbuild,
webpack) rewrites them at build time; this project has neither. So right
now the aliases only work for `tsc` and for `jest`. That's a real
limitation worth knowing, not something to hide: if this app ever gets a
real build step, the exact same alias config carries over to it with no
changes needed.

## `declaration: true` and exploring the output

Added `"declaration": true` to `tsconfig.json`. On its own this does
nothing visible, because the same config also has `"noEmit": true` for
day-to-day type-checking — and `noEmit` disables *all* emit, declarations
included.

To actually see declaration files, added a second config,
`tsconfig.declarations.json`, that extends the base config and overrides
just the emit-related options:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "emitDeclarationOnly": true,
    "declaration": true,
    "outDir": "./dist/types"
  }
}
```

and a script: `"build:types": "tsc -p tsconfig.declarations.json"`.

Running `npm run build:types` produces one `.d.ts` per `.ts` file under
`dist/types/` (gitignored — it's generated output, not something to
commit). A few interesting ones:

- **`queue.d.ts`** — the generated file for the generic `Queue<T>` is
  just its public shape, with the implementation completely stripped:

  ```ts
  export declare class Queue<T> {
      private items;
      enqueue(item: T): void;
      dequeue(): T | undefined;
      peek(): T | undefined;
      get size(): number;
      isEmpty(): boolean;
  }
  ```

- **`store.d.ts`** — shows that `loadPersistedState<T>`'s generic
  signature survives compilation untouched: `export declare function
  loadPersistedState<T>(key: string, fallback: T): T;`. Anyone who only
  has this `.d.ts` file (e.g. it's published as a package) still gets full
  autocomplete and type-checking for `loadPersistedState`, without ever
  seeing the actual implementation.

- **`types.d.ts`** — since `types.ts` only ever contained type
  declarations (no runtime code), its `.d.ts` output is nearly identical
  to the source — a good illustration of what "type-only file" really
  means.
