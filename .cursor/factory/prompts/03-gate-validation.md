# Prompt: Gate Validation

Acting as: Gate Agent

I want you to validate whether this feature is ready for implementation.

Do not implement code.

## Required Inputs

Read:

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`
- `specs/tasks.md`
- `gates/ast-gate.md`
- `gates/context-gate.md`
- `gates/build-gate.md`
- `gates/security-gate.md`

## Instructions

1. Run the AST Gate.
2. Run the Context Gate.
3. Run the Build Gate.
4. Run the Security Gate.
5. Decide if Builder Agents can proceed.
6. Update `specs/validation-report.md`.

## Result Options

Use one of:

- PASS
- PASS_WITH_WARNINGS
- BLOCKED

## Output Requirements

Update:

- `specs/validation-report.md`

Then respond with:

```md
## Gate Agent Summary

### Overall Status

### AST Gate

### Context Gate

### Build Gate

### Security Gate

### Can Builder Agents Proceed?

### Required Fixes

### Next Step
```

## Quality Bar

If anything is ambiguous but non-blocking, mark it as warning.
If anything creates unsafe implementation risk, block.
