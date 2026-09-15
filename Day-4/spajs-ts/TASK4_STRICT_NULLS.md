# Task 4 — Strict Null Checks, Full Pass

`tsconfig.json` now has `"strict": true` (which turns on `strictNullChecks`,
`noImplicitAny`, `strictFunctionTypes`, and a few others all at once).

```
npx tsc --noEmit
```

**Result: 0 errors.** Below is every spot in the code that deals with a
value that could be `null` / `undefined`, and which of the four techniques
was used there and why.

| File | What could be missing | Technique used | Why |
|---|---|---|---|
| `router.ts` `render()` | `document.getElementById(rootId)` → `HTMLElement \| null` | Guard clause: `if (!root) return;` | If the root element isn't in the page yet, there is nothing sensible to render into — just stop. |
| `router.ts` `render()` | `currentPath` starts as `null` until the first `navigate()` call | Guard clause: `if (currentPath === null) return;` | Same idea — render() can be called (via `store.subscribe`) before any route has been chosen. |
| `router.ts` `findMatch()` | no route matches the path → returns `null` | Guard clause + ternary: `if (!matched) {...}` and `matched ? matched.params : {}` | Two different call sites need two different fallbacks (render a "not found" page vs. an empty params object), so a plain guard clause plus a ternary was clearer than optional chaining. |
| `app.ts` `renderNav()` | `document.getElementById("nav")` → `HTMLElement \| null` | Guard clause: `if (!nav) return;` | Same reasoning as the router — no nav container, nothing to do. |
| `app.ts` initial state | `persisted.items` / `persisted.theme` are optional (`Partial<...>`) | Nullish coalescing: `persisted.items ?? seedItems()` | We want a real fallback value (seed data / `"light"`) when nothing was saved yet — `??` is exactly "use this value unless it's null/undefined". |
| `pages/detail.ts` | `state.items.find(...)` → `TaskItem \| undefined` | Guard clause: `if (!item) { ...render "not found"...; return section; }` | The rest of the function assumes a real item exists (reads `item.title`, `item.done`, etc.), so narrowing early with a guard clause is simplest. |
| `async.ts` `runAsync()` | `catch (err)` — under `strict`, `err` is typed `unknown`, not `any` | Type guard: `err instanceof Error ? err.message : "Something went wrong"` | You can't just read `.message` off an `unknown` value. `instanceof Error` narrows it safely without asserting anything we haven't checked. |
| `store.ts` `loadPersistedState()` | `JSON.parse(raw)` returns `any` | Assertion: `JSON.parse(raw) as T` | This is the *one* assertion in the codebase. Justified because `JSON.parse` can never statically know what shape came out of `localStorage` — we already trust that shape at the call site (`PersistedState` in `app.ts`), and if it's ever wrong that's a runtime data problem, not something the type system could have caught anyway. |

## Where optional chaining (`?.`) wasn't needed, but could be

None of the null-prone spots above needed `?.` — every one of them either
needed to *stop* (guard clause) or needed a *real fallback value* (`??`),
and `?.` is best when you just want to skip an operation silently. For
example, `router.ts` could have been written as:

```ts
document.getElementById(rootId)?.replaceChildren(renderNotFound(currentPath));
```

instead of the guard clause. We kept the guard clause because the function
has more to do after that check (it also needs `root` again a few lines
later), so checking once up top and reusing the narrowed variable reads
better than repeating `?.` on every line.

## Non-null assertions (`!`)

**Zero uses of `!` in this codebase.** Every "possibly null/undefined"
case had a real guard clause or fallback available, so there was never a
case where we needed to tell TypeScript "trust me" without also being able
to prove it with a check.
