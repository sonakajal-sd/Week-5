# Task 6 — Write New TypeScript Tests

The original Week 4 SPA doesn't have a generic `Queue<T>` or an
`ApiClient`, so two small files were added under `src/` to have something
worth writing generic/typed tests against:

- `src/queue.ts` — a minimal FIFO queue, generic over the item type.
- `src/apiClient.ts` — a tiny `fetch` wrapper whose `get<T>()` method
  returns whatever type you ask for.

## `src/tests/queue.test.ts` — generic `Queue<T>`

Three "happy path" tests create a `Queue<string>`, a `Queue<number>` and a
`Queue<Task>` (a small local interface) and check they store/retrieve the
right values in FIFO order.

The interesting one is the last test, which proves the generic type
actually constrains what you can put in:

```ts
const queue = new Queue<number>();
queue.enqueue(42);

// @ts-expect-error - queue is a Queue<number>, so enqueue() only takes
// numbers. Passing a string here must fail to compile.
queue.enqueue("not a number");
```

`@ts-expect-error` tells TypeScript "the next line is expected to have a
compile error." If it *doesn't* error, `@ts-expect-error` itself becomes an
error ("Unused '@ts-expect-error' directive"), so this test only passes if
the type system is genuinely doing its job. I proved this by temporarily
changing `enqueue(item: T)` to `enqueue(item: any)` — the whole test suite
immediately failed to even compile, with exactly that "unused directive"
error. That's the difference between a runtime test and a compile-time
guarantee: no assertion ever ran, the *type checker* caught it.

## `src/tests/apiClient.test.ts` — `ApiClient` with mocked `fetch`

```ts
const fakeUser: User = { id: 1, name: "Ada" };
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(fakeUser)
}) as unknown as typeof fetch;

const client = new ApiClient("https://example.test");
const user = await client.get<User>("/users/1");
```

Because `get<User>(...)` was called, `user` is typed as `User`, not `any`
— in the editor, typing `user.` autocompletes to `id` and `name` only, and
misspelling `user.naem` would be a compile error caught before the test
even runs. A second test mocks a `404` response and checks that `get()`
rejects with an error mentioning the status code.

(The `as unknown as typeof fetch` cast is needed because the real
`fetch` type is far more detailed than our fake response object — this is
a deliberate, narrow cast for a test mock, not something used anywhere in
the app's real code.)

## `src/tests/dispatch-types.test.ts` — typed actions on the state manager

One test dispatches a fully-formed `ADD_ITEM` action and checks the
resulting state shape (`items[0].title`, `.done`, `.createdAt`). Two more
prove that dispatching *badly-shaped* actions is a compile-time error, not
something you'd only discover by running the app:

```ts
// @ts-expect-error - ADD_ITEM's payload must be a full TaskItem
// (id, title, done, createdAt). This object is missing "done" and
// "createdAt", so it must fail to compile.
store.dispatch({ type: "ADD_ITEM", payload: { id: "1", title: "Oops" } });
```

```ts
// @ts-expect-error - "RENAME_ITEM" isn't part of the Action union in
// src/types.ts, so this must fail to compile.
store.dispatch({ type: "RENAME_ITEM", payload: { id: "1" } });
```

Both only pass because `Action` in `src/types.ts` is a closed discriminated
union — `dispatch` rejects both a mistyped action name and a payload
that's missing fields, entirely before any code runs.

## Result

```
npx tsc --noEmit   →  0 errors
npx jest           →  12 suites, 62 tests, all passing
```
