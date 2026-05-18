# Build Gate

## Purpose

Validate that implementation can proceed safely and that the feature can be verified after code changes.

## Inputs

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`
- `specs/tasks.md`

## Result Options

- PASS
- PASS_WITH_WARNINGS
- BLOCKED

## Required Checks

### 1. Plan Completeness

- [ ] Implementation summary exists.
- [ ] Business requirement reference exists.
- [ ] Technical strategy is clear.
- [ ] Files likely to change are listed.
- [ ] New files are listed if applicable.
- [ ] Risks are documented.
- [ ] Rollback strategy exists.

### 2. Task Quality

- [ ] Tasks are small.
- [ ] Tasks are linked to business rules or acceptance criteria.
- [ ] Each task has an assigned Builder Agent.
- [ ] Each task has a clear Done When section.
- [ ] Tasks are ordered logically.

### 3. Validation Commands

- [ ] Build command exists or absence is justified.
- [ ] Lint command exists or absence is justified.
- [ ] Test command exists or absence is justified.
- [ ] Any manual validation is documented.

### 4. Scope Control

- [ ] No unrelated modules are planned for modification.
- [ ] No rewrite is planned unless explicitly approved.
- [ ] No unapproved dependency is planned.
- [ ] Public contract changes are intentional.

### 5. Test Readiness

- [ ] Test cases map to acceptance criteria.
- [ ] Happy path is covered.
- [ ] Failure path is covered.
- [ ] At least one edge case is considered.

## Blocking Conditions

Block implementation if:

- No implementation plan exists.
- Tasks are too broad.
- Tasks are not linked to business value.
- No validation commands are known.
- Planned changes are larger than necessary.
- Rollback is impossible or undefined for risky changes.

## Output

Write findings into:

- `specs/validation-report.md`
