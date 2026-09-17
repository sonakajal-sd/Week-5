# Task 6 — Phase 1 Reflection

> Draft journal entry — read through it and adjust anything that doesn't match how you
> actually experienced these five weeks before sharing it with the pod.

## Five most important things I learned across five weeks

1. **Static typing catches bugs before they ship.** Working through `strict: true`
   on the Day 4/5 SPA showed me concretely how many runtime crashes
   (`cannot read property of undefined`, wrong argument shapes) TypeScript turns into
   compile errors instead.
2. **State should flow one way.** Building a store/reducer/dispatch system by hand
   (rather than starting with a framework) made the "action in, new state out,
   re-render" cycle click in a way that just using a library up front wouldn't have.
3. **Types are a design tool, not just a safety net.** Modeling `Action` as a
   discriminated union, or deriving `PersistedState` from `AppState` with `Pick`/
   `Partial`, forced me to think about the actual shape of my data up front instead of
   discovering it by trial and error.
4. **Tests give permission to refactor.** Once the reducer, router, and components had
   real test coverage, I could change internals (like adding middleware) without
   being afraid of silently breaking something.
5. **Tooling (ESLint, CI, type-checking) is part of the deliverable, not an
   afterthought.** Doing the clean-up pass in Week 5 — setting up ESLint from
   scratch, wiring a CI workflow — made obvious how much of "finishing" a project is
   process, not new features.

## A moment where something clicked

The discriminated union `Action` type was confusing at first — it looked like just a
big union of object literals. It clicked once I saw what happens *inside* the
reducer's `switch (action.type)`: TypeScript automatically narrows `action.payload`
to the right shape in each `case`, with no manual casting. Before that it felt like
extra ceremony; after that it felt like the compiler was reading the `switch`
statement the same way I was.

## Three areas I feel least confident going into Phase 2

1. **Real backend work in Node** — everything so far has been the frontend/SPA side;
   `ApiClient` fakes network calls but I haven't built or connected to a real
   Express/Node API yet.
2. **React's mental model** — I understand my own hand-rolled store/router, but I
   haven't yet mapped that onto how React's rendering, hooks, and reconciliation
   actually work under the hood.
3. **Writing my own conditional/mapped types** — I've used built-in utility types
   (`Partial`, `Pick`, `Record`) confidently, but haven't had to design a custom
   conditional or mapped type from scratch yet, so I'm not sure how that reasoning
   holds up on a harder problem.

## Phase 1 self-assessment (rate 1–5 per week's checklist objectives)

| Week | Focus | Self-rating | Notes |
|---|---|---|---|
| Week 1 | JS/DOM fundamentals | 4/5 | Comfortable with the basics; would want more practice with edge cases. |
| Week 2 | Intermediate JS | 4/5 | Solid, though async/error-handling patterns took the most repetition. |
| Week 3 | Advanced JS / tooling | 3/5 | Understood the concepts but slower to apply them without reference. |
| Week 4 | TypeScript migration (SPA) | 4/5 | Migrating real vanilla-JS code to TS made the value of types concrete. |
| Week 5 | TypeScript depth + project finalization | 4/5 | Comfortable with generics/unions/utility types; clean-up & docs took longer than expected. |

_(Fill in your own numbers here if these don't match your actual experience —
this is meant as a starting draft, not the final word.)_

## Sharing with the pod

This file is ready to paste into Slack. Once shared, remember to also leave one
supportive, specific comment on a partner's reflection — that part has to happen in
Slack directly, I can't do it on your behalf.
