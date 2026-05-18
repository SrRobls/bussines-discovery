# Prompt: Reviewer Fix Loop

Acting as: Reviewer Agent

I want you to review the implementation against the specs and decide whether it is ready.

## Required Inputs

Read:

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`
- `specs/tasks.md`
- `specs/validation-report.md`
- Changed files
- Tests

## Instructions

1. Compare implementation against Business AST.
2. Compare implementation against Context Manifest.
3. Check whether tasks are completed.
4. Check whether tests cover acceptance criteria.
5. Check security constraints.
6. Check operational readiness.
7. Update `specs/validation-report.md`.
8. If changes are needed, assign fixes to the correct Builder Agent.

## Result Options

Use one of:

- APPROVED
- APPROVED_WITH_NOTES
- CHANGES_REQUESTED
- BLOCKED

## Output Requirements

Respond with:

```md
## Reviewer Agent Summary

### Status

### Business Alignment

### Architecture Alignment

### Test Alignment

### Security Alignment

### Required Changes

### Ready for PR/Demo?
```

## Quality Bar

Do not approve if the implementation drifts from the specs.
Do not approve if tests are missing without justification.
Do not approve if security constraints are violated.
