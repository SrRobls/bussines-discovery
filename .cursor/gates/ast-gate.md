# AST Gate

## Purpose

Validate that the Business AST is complete, structured, and safe enough to use as a source of truth for implementation.

## Input

- `specs/business-ast.yaml`

## Result Options

- PASS
- PASS_WITH_WARNINGS
- BLOCKED

## Required Checks

### 1. Metadata

- [ ] Artifact name exists.
- [ ] Version exists.
- [ ] Status exists.
- [ ] Owner exists.

### 2. Feature

- [ ] Feature ID exists.
- [ ] Feature name exists.
- [ ] Feature summary exists.
- [ ] Priority exists.

### 3. Intent

- [ ] Raw request is captured.
- [ ] Normalized intent is clear.
- [ ] Problem statement is explicit.
- [ ] Desired outcome is defined.

### 4. Business Goal

- [ ] Primary goal is defined.
- [ ] At least one success metric exists or absence is justified.

### 5. Actors

- [ ] At least one actor exists.
- [ ] Actor responsibilities are clear.
- [ ] Actor permissions are defined if relevant.

### 6. Business Rules

- [ ] At least one business rule exists.
- [ ] Rules are testable.
- [ ] Rules have priority.
- [ ] Rules include examples when useful.

### 7. Flows

- [ ] At least one flow exists.
- [ ] Flow trigger is defined.
- [ ] Preconditions are defined.
- [ ] Steps are ordered.
- [ ] Postconditions are defined.

### 8. Acceptance Criteria

- [ ] At least one acceptance criterion exists.
- [ ] Criteria use Given/When/Then or equivalent structure.
- [ ] Criteria link to business rules.

### 9. Edge Cases

- [ ] Edge cases are listed or absence is justified.
- [ ] Expected behavior is defined.

### 10. Out of Scope

- [ ] Out-of-scope items are explicit.

### 11. Assumptions

- [ ] Assumptions are listed.
- [ ] Impact if wrong is described.

### 12. Open Questions

- [ ] Open questions are listed.
- [ ] Blocking questions are marked.
- [ ] No blocking question prevents safe planning.

## Blocking Conditions

Block implementation if:

- No business goal exists.
- No acceptance criteria exist.
- Business rules are not testable.
- Actor permissions are unclear for security-sensitive features.
- A blocking open question affects implementation.
- Business AST contradicts itself.

## Output

Write findings into:

- `specs/validation-report.md`
