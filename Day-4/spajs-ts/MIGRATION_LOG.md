# Migration Log — JS to TS

This file tracks the errors I actually hit while turning the Week 4 Day 5
task-manager SPA into TypeScript, and how I fixed each one. The idea is:
next time I see the same error message somewhere else, I already know what
it usually means and how to fix it.

## Step 0 — allowJs + checkJs, before converting anything

Before renaming a single file, I added a `tsconfig.json` with `allowJs: true`
and `checkJs: true`. This makes TypeScript check the plain `.js` files
without needing to convert them yet, so I could fix easy problems first.

### Error 1 — "Property does not exist on type"

This showed up in `components/button.js`, `components/card.js` and
`components/modal.js`.

```
error TS2339: Property 'onClick' does not exist on type
'{ text?: string; variant?: string; type?: string; disabled?: boolean; }'
```

**Why it happened:** these functions destructure their options object, e.g.
`function Button({ text = "", onClick, variant = "primary" } = {}) {...}`.
Because `onClick` never has a default value, TypeScript could not tell it
was even supposed to exist on the props object — it only inferred the shape
from the properties that *do* have defaults.

**Fix:** I added a JSDoc `@param` comment above each function describing
the full shape of the props object, including `onClick`. That's enough for
`checkJs` to understand the real shape while the file is still `.js`:

```js
/**
 * @param {{ text?: string, onClick?: (event: MouseEvent) => void, ... }} [props]
 */
export function Button({ text = "", onClick, ... } = {}) { ... }
```

Once I converted the file to `.ts`, JSDoc types stop being read, so I
replaced them with a real TypeScript `interface` (see `ButtonProps`,
`CardProps`, `ModalProps` in `src/components/*.ts`). **Rule of thumb:** add
the missing property to the interface/type. Only reach for `as` (a type
assertion) when the type really can't be improved — I never needed it here.

## Step 1 — converting file by file

Order used: `utils.js` → components → `router.js` → `reducer.js` +
`store.js` (the "state manager") → pages → `app.js`.

### Error 2 — "Argument of type X is not assignable to Y" (missing property)

After converting `router.ts` to import a `Store` type from `src/types.ts`,
`app.js` (still untyped) failed with:

```
error TS2345: Argument of type '{ getState: () => any; subscribe: ... }'
is not assignable to parameter of type 'Store'.
  Property 'dispatch' is missing in type '...' but required in type 'Store'.
```

**Why it happened:** `createStore` (still plain JS at that point) built its
return object in two steps — first `{ getState, subscribe }`, then added
`dispatch` afterwards. TypeScript's `Store` interface requires `dispatch`
to be there from the start once the value is typed as `Store`.

**Fix — understand why the types differ, fix the root cause:** rather than
loosening the `Store` type, I changed `createStore` (in `store.ts`) to
build the object with a real `dispatch` from the very first line, using
`baseDispatch` as a temporary value, then overwriting it with the
middleware-wrapped version right after:

```ts
const store: Store = { getState, subscribe, dispatch: baseDispatch };
store.dispatch = middlewares.reduceRight(
  (next, middleware) => middleware(store)(next),
  baseDispatch
);
```

### Error 3 — "Property does not exist on type '{}'"

After typing `loadPersistedState`, `app.js`/`app.ts` failed with:

```
error TS2339: Property 'items' does not exist on type '{}'.
error TS2339: Property 'theme' does not exist on type '{}'.
```

**Why it happened:** `loadPersistedState(STORAGE_KEY, {})` was called with
an empty object as the fallback, and without a type hint TypeScript
inferred the return type as the empty object type `{}` — which has no
properties at all.

**Fix:** I made `loadPersistedState` generic (`function loadPersistedState<T>(key: string, fallback: T): T`)
and gave the call site an explicit type argument describing exactly what
shape is stored:

```ts
type PersistedState = Partial<Pick<AppState, "items" | "theme">>;
const persisted = loadPersistedState<PersistedState>(STORAGE_KEY, {});
```

This is the same category of error as "Argument of type X is not
assignable to Y" — the fix is always to ask *why* the inferred type is
wrong and give TypeScript enough information to infer the right one,
instead of casting it away.

### Error pattern we designed around — "Object is possibly null"

The original JS already guarded every `document.getElementById(...)` call
with an `if (!el) return;` before using the result (see `router.ts`'s
`render()` and `app.ts`'s `renderNav()`). Under `strict: true`,
`document.getElementById` returns `HTMLElement | null`, so skipping that
guard produces:

```
error TS18047: 'root' is possibly 'null'.
```

Because the guard clauses were already there, this error never actually
surfaced in the real files — but I reproduced it in a throwaway snippet to
confirm what the message looks like, since it's one of the most common
TypeScript errors when working with the DOM.

**Rule of thumb for this error:**
1. Prefer a guard clause (`if (!el) return;`) — clearest, and it's what
   this project already used everywhere.
2. Or optional chaining (`el?.replaceChildren(...)`) when "do nothing if
   missing" is fine inline.
3. Only use the non-null assertion (`el!`) when you are *certain* the
   element exists (e.g. it's hard-coded in `index.html` and the code only
   ever runs after the DOM is ready) — and leave a comment saying why.

## Step 2 — enabling `strict: true`

After every file was `.ts` and `checkJs` was clean, I flipped
`"strict": false` to `"strict": true` in `tsconfig.json` and reran
`tsc --noEmit`.

**Result: zero errors.** Because the interfaces in `src/types.ts`
(`AppState`, `Action`, `Store`, `PageProps`) were written up front and used
consistently while converting each file, the strict null-checking rules
didn't find anything new to complain about — the guard clauses and
optional fields were already correct. See `TASK4_STRICT_NULLS.md` for the
full pass over `strict: true` and the specific decisions made there.
