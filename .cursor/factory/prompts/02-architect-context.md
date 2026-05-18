# Prompt: Architect Context

Acting as: Architect Agent

I want you to read the Business AST and convert it into a technical Context Manifest and Implementation Plan.

Do not implement code yet.

## Required Inputs

Read:

- `specs/business-ast.yaml`

Also inspect the repository structure, existing source code, tests, config files, package files, README, and any architecture-related files.

## Instructions

1. Understand the business requirement.
2. Inspect the repository.
3. Identify the current architecture.
4. Identify impacted modules.
5. Identify integration points.
6. Identify commands for install, build, lint, and test.
7. Identify security constraints.
8. Identify testing strategy.
9. Create/update `specs/context-manifest.yaml`.
10. Create/update `specs/implementation-plan.md`.
11. Optionally create/update `specs/tasks.md`.

## Output Requirements

Update:

- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`
- `specs/tasks.md` if useful

Then respond with:

```md
## Architect Agent Summary

### Technical Context

### Architecture Decisions

### Impacted Modules

### Commands Found

### Risks

### Next Step

Run Gate Agent.
```

## Quality Bar

The Context Manifest must be specific enough that Builder Agents can implement without guessing architecture.
