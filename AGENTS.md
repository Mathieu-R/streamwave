# AGENTS.md - Streamwave App Development Guide

Streamwave is a monorepo (pnpm workspaces + Turborepo) for music streaming with apps/, packages/ and tools/ directories.

## Package Manager

Always use `pnpm`. Never use npm or yarn.
For package type checks and local typecheck runs, use `tsc --noEmit`.

### pnpm-lock.yaml Integrity (CRITICAL)

After running `pnpm install` or `pnpm add`, **always check the lockfile diff** before committing. pnpm sometimes rewrites GitHub tarball URLs to SSH-based git clone URLs, which breaks CI (runners lack SSH keys).

- **NEVER** commit `pnpm-lock.yaml` changes containing `git+https://git@github.com:`, `git@github.com:`, or any `git+ssh:` protocol URLs.
- GitHub-hosted deps MUST use **tarball** URLs (`https://codeload.github.com/...`).
- If pnpm rewrites tarball resolutions to git-based format, **revert those lockfile lines** before committing.
- Never add new deps via `git:` or `git+ssh:` protocols. Use tarball URLs or published npm packages.

## Global Commands

```bash
pnpm run dev              # .env, Postgres (Docker), app :3000, API :4000, Cosmos :5001
pnpm run lint:format:fix  # oxlint --fix + oxfmt (root)
pnpm run lint:format:ci   # oxlint + oxfmt --check + turbo typecheck
pnpm run typecheck:changed  # Scoped typecheck vs origin/main
pnpm run typecheck        # Full monorepo typecheck
pnpm run build            # Vite build of @streamwave/app
pnpm run test             # Vitest workspace (watch)
pnpm run test:ci          # Vitest run (unit + *.db.test.ts)
```

## Running Tests

Tests use **Vitest**. `*.test.ts` are unit tests. `*.db.test.ts` use PGlite (no Docker).

```bash
pnpm run test:ci
pnpm run test:ci myFile.test
```

## Agent Completion Checklist

Before finishing a generated change set (and before opening/updating a PR), agents MUST:

1. Run formatting **before every commit** (not just at the end):
   - `pnpm run lint:format:fix` (oxlint + oxfmt)
   - Include any formatting changes **in the same commit** as the code change to avoid separate `style:` commits
2. Run [quality-gates](.cursor/skills/quality-gates/SKILL.md) per active profile and changed files; include any gate output in the same commit/PR.

## Detailed Guidelines

See `.cursor/rules/` for comprehensive guidelines on:

- Code style, TypeScript, imports
- Git workflow, naming conventions

Project-specific **Cursor skills** live in `.cursor/skills/` (quality gates, ship, docs, Inngest via `.agents/skills/`).
