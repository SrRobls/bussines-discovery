# Prompt: Builder Implementation

Acting as: Builder Agent

I want you to implement the approved tasks.

Before coding, verify that gates allow implementation.

## Required Inputs

Read:

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`
- `specs/tasks.md`
- `specs/validation-report.md`

## Instructions

1. Confirm validation status.
2. Select the next task from `specs/tasks.md`.
3. Identify which Builder Agent type is needed:
   - Domain Builder
   - API Builder
   - Data Builder
   - UI Builder
   - Test Builder
   - DevOps Builder
   - Documentation Builder
4. Implement the smallest possible change.
5. Add or update tests.
6. Run or suggest validation commands.
7. Update `specs/validation-report.md` with implementation notes.
8. Mark task progress in `specs/tasks.md`.

## Constraints

- Do not invent requirements.
- Do not modify unrelated files.
- Do not add dependencies unless approved.
- Do not skip tests unless justified.
- Do not change architecture without updating Context Manifest.
- Do not implement anything outside Business AST.

## Output Requirements

Respond with:

```md
## Builder Agent Summary

### Builder Type

### Task Implemented

### Files Changed

### Tests Added/Updated

### Commands Run

### Result

### Next Step

Run Reviewer Agent.
```

## Quality Bar

The implementation must be small enough to review and directly traceable to Business AST.
