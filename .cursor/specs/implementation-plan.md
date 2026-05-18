# Implementation Plan

## Status

Draft

## Summary

Describe the technical strategy for implementing the feature.

This plan must be derived from:

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`

## Business Requirement Reference

Feature:

- ID:
- Name:

Acceptance Criteria:

- AC-001:
- AC-002:

Business Rules:

- BR-001:
- BR-002:

## Technical Strategy

Explain the implementation approach.

Include:

- Which modules will change
- Which layers are involved
- Whether new files are required
- Whether data persistence is required
- Whether API contracts change
- Whether tests are required

## Architecture Decisions

| Decision | Rationale | Alternatives Considered | Risk |
|---|---|---|---|
|  |  |  |  |

## Files Likely to Change

| File/Path | Change Type | Reason |
|---|---|---|
|  | create/update/delete |  |

## New Files

| File/Path | Purpose |
|---|---|
|  |  |

## Testing Strategy

Required tests:

- Unit:
- Integration:
- Contract:
- E2E:

Minimum scenarios:

1. Happy path:
2. Main failure path:
3. Edge case:

## Validation Commands

```bash
# install
# build
# lint
# test
```

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
|  |  |  |

## Rollback Strategy

Describe how to revert safely.

Example:

1. Revert changed files.
2. Revert migration if applicable.
3. Disable feature flag if applicable.
4. Run validation commands.

## Builder Handoff

Builder Agents must:

1. Read Business AST.
2. Read Context Manifest.
3. Follow this plan.
4. Implement only approved tasks.
5. Add or update tests.
6. Update validation report.
7. Hand off to Reviewer Agent.
