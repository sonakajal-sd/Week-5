# Task 3 — Polish & Final Commit

## Commit message review

Current history on `week5-day2` ahead of `main`:

```
6420a63 Day2, Task1 typescript
1a7b129 Complete Week5 Day2 tasks
bcef35e Merge pull request #2 from sonakajal-sd/week5-day2
ffe60a9 Typescript Day3 Tasks Completed
90fe527 Typescript updated Day3
e17078c Day-4 spa js-ts completed
```

These are already understandable, but inconsistent in style (mixed capitalization,
not imperative mood). Suggested rewordings if you want a cleaner history:

| Current | Suggested |
|---|---|
| `Day2, Task1 typescript` | `Add TypeScript setup for Week 5 Day 2 Task 1` |
| `Complete Week5 Day2 tasks` | `Complete Week 5 Day 2 TypeScript tasks` |
| `Typescript Day3 Tasks Completed` | `Complete Week 5 Day 3 TypeScript tasks` |
| `Typescript updated Day3` | `Refine Week 5 Day 3 TypeScript exercises` |
| `Day-4 spa js-ts completed` | `Migrate Day 4 vanilla JS SPA to TypeScript` |

**Why I didn't run this automatically:** these commits are already pushed to
`origin/week5-day2`. Rewording them requires an interactive rebase
(`git rebase -i main`) followed by a **force push**, which rewrites shared history.
That's a deliberate, hands-on step I'm leaving to you rather than doing silently —
run:

```bash
git rebase -i main
# mark each commit "reword", save, edit each message using the table above
git push --force-with-lease
```

## GitHub Actions CI

Added `.github/workflows/ci.yml` at the repo root (required location for GitHub
Actions to discover it). On every push/PR to `main` it runs, inside
`Day-4/spajs-ts`:

1. `npm ci`
2. `npm run typecheck` (`tsc --noEmit`)
3. `npm run lint` (`eslint .`)
4. `npm run test:coverage` (`jest --coverage`)

All three commands were verified locally and pass (see
[Day5/Task1/CLEANUP_REPORT.md](../Task1/CLEANUP_REPORT.md)). The workflow itself
can only be confirmed as "green" once it actually runs on GitHub, i.e. after this
branch is pushed and a PR is opened (Task 4).

## Tag

Once the final commit is made, tag it:

```bash
git tag v1.0.0
git push --tags
```

## Final commit

Per the task spec, the final commit message is:

```
release: Phase 1 Checkpoint 1 - TypeScript SPA
```
