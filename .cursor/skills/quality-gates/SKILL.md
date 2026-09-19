---
name: quality-gates
description: >
  Source canonique pour typecheck, lint et tests agents — resolution par diff.
  Utiliser via AGENTS.md ou avant commit.
disable-model-invocation: true
---

# Quality gates

Resolution par fichiers modifies. **Defaut : scope minimal** ; monorepo complet ou suite `test:ci` entiere seulement en repli explicite.

## Developer — commandes de base

```bash
pnpm run format:fix
pnpm run typecheck:changed
pnpm run lint:format:check
```

## Typecheck

| Situation | Commande |
|-----------|----------|
| Defaut | `pnpm run typecheck:changed` |
| Un seul package | `turbo run typecheck --filter=<package>` |
| Package + dependants downstream | `turbo run typecheck --filter=...<package>` |
| Transversal (`tools/typescript/`, `turbo.json`, lockfile) | `pnpm run typecheck` |

`<package>` : depuis un fichier modifie, lire le champ `name` du `package.json` workspace le plus proche (`apps/`, `libs/`, `tools/`).

Plusieurs packages dans le diff → `typecheck:changed`.

## Tests — collecter les fichiers

```bash
git diff --name-status HEAD
git diff --cached --name-status
git ls-files --others --exclude-standard
```

Dedupliquer. Exclure statut `D`.

## Tests — resoudre

| Fichier modifie | Tests |
|-----------------|-------|
| `*.test.ts`, `*.db.test.ts`, `*.test.tsx` | Le fichier (s'il existe) |
| `foo.ts` / `foo.tsx` | Co-localises : `foo.test.ts`, `foo.db.test.ts`, `foo.test.tsx` |
| Config test autre package | Suite `test:ci` du package |


## Repli tests

1. Aucun test co-localise → lister les fichiers, **continuer** (pas de suite complete par defaut)
2. >15 fichiers ou >5 dossiers modules → AskQuestion : cibles (defaut) ou suite package
3. Echec → arreter, presenter l'erreur

Arreter au premier echec.