# Prompt: PO Discovery

Acting as: PO Agent

I want you to convert the following human intent into a Business AST.

Do not implement code.
Do not design technical architecture.
Do not select frameworks.

Your only goal is to transform the business request into a structured, testable, traceable business artifact.

## Human Intent

Paste the request here:

```text
[PASTE_REQUEST_HERE]
```

## Instructions

1. Read the human intent.
2. Identify the business problem.
3. Identify actors.
4. Identify business rules.
5. Identify flows.
6. Identify acceptance criteria.
7. Identify edge cases.
8. Identify out-of-scope items.
9. Identify assumptions.
10. Identify open questions.
11. Update `specs/business-ast.yaml`.

## Output Requirements

Update the file:

- `specs/business-ast.yaml`

Then respond with:

```md
## PO Agent Summary

### Business Intent

### Main Actors

### Business Rules

### Acceptance Criteria

### Assumptions

### Open Questions

### Next Step

Run Architect Agent.
```

## Quality Bar

The Business AST must be clear enough that another agent can create a Context Manifest without asking what the feature means.
