---
name: migrate-legacy-component
description: Migrate a React component or page from apps/legacy to apps/app. Use for legacy React/UI migrations that need the Streamwave route, module, and ui-kit boundaries.
---

# Migrate a legacy component

Rebuild the legacy experience in the target architecture. The legacy code specifies
behaviour and content; the target application specifies the implementation shape.

## Map before coding

Inspect the legacy component, its parent page, styles, assets, data dependencies,
interactive states, URLs, and error/empty/loading states that actually exist. Inspect
the closest target-domain module and existing ui-kit components before designing new
ones.

Write a short migration map in the work log that accounts for every visible region,
state, interaction, data dependency, and existing component to reuse. Identify the
legacy consumers before planning any deletion. This map is complete when every legacy
behaviour has a target owner or an explicit, user-approved exclusion.

## Choose the owner

Keep each concern in its target layer:

| Concern | Owner |
| --- | --- |
| File-based route, URL parameters, redirects, authentication guards | `apps/app/src/routes` |
| Data access, state, hooks, mutations, mapping legacy data to display data, navigation, and application event handlers | `apps/app/src/modules/<domain>` |
| Pure presentation, visual composition, responsive layout, Chakra UI primitives, and visual slots | `packages/ui/kit/src/components` |

A route is a thin adapter: resolve route inputs and guards, then render a module
integrator. Keep the screen's behaviour out of the route.

The module prepares a small display model and owns side effects, router links,
callbacks, and state. It instantiates the view from the kit and injects application
content. Put domain-specific hooks, utilities, and adapters beside that integrator.

The kit owns the complete pure view, rather than a collection of atom-sized pieces
that forces the module to rebuild a large React tree. It has no application routing,
data access, auth client, or business side effects.

## Compose a small view API

Start from the fixed visual structure and expose its variable regions as semantic
slots. Pass props for data displayed by the view and for
interactions the view itself owns.

Use the narrowest current contract. A prop, variant, callback, responsive option, or
state exists only when the migrated screen needs it now. Prepare incompatible legacy
records in a module adapter; the kit receives display-ready data rather than legacy
shapes.

Use Chakra UI v3 primitives and compound components. Prefer semantic Chakra tokens,
responsive props, `Stack`/`Flex`/`Grid` layout primitives, and `Field.Root` for
forms. Keep Tailwind limited to simple layout utilities when it is already enabled;
do not recreate Chakra component styling with utility classes.

Respect the application's Chakra provider, color-mode behaviour, and theme. Use
default semantic tokens unless the migration has an explicit design requirement.
Use recipes only for a repeated component variant or coordinated multi-slot view.
Keep the visual structure and behaviour identified in the migration map; simplify
only when the legacy detail has no user-visible purpose.

## Implement in migration-sized steps

1. Reuse an existing component when it fits. Extend it only for a concrete need of
   this migration; otherwise create the focused pure view in the kit.
2. Build the kit view and its small display contract first.
3. Add the module integrator, hooks, utilities, and data adapter.
4. Wire the thin route and guards.
5. Retain legacy code while it has consumers. Keep unrelated architectural debt out
   of the change; report it separately when relevant.

Keep the interaction and content fidelity from the migration map. Add neither product
capabilities nor generic configuration that the map does not call for. Preserve the
project's French `react-intl` conventions for user-visible UI.

For accessibility, use Chakra's semantic components and preserve native landmarks,
heading order, labels, errors, and keyboard interactions. Give every icon-only action
a translated `aria-label`; use `Field.Label` and `Field.ErrorText` for form controls.

## Prove the migration

Add a co-located React Cosmos `.fixture.tsx` for each new composed kit view. Cover the
normal state plus only the empty, loading, error, or data variants the real screen
supports.

Run the repository quality gates for the changed files as required by `AGENTS.md` and
`.cursor/skills/quality-gates/SKILL.md`, including formatting before a commit. Run
co-located tests when they exist or are added.

Finish by reporting:

- the route, module, and ui-kit files created or changed;
- the legacy behaviours and states preserved;
- the checks performed;
- any check that could not run and the concrete reason; and
- legacy code retained because it still has consumers, or removed after confirming it
  has none.
