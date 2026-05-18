# Prompt: Run Builder Agent

Acting as: Builder Agent

Before implementing, read:

- `specs/validation-report.md`

If status is BLOCKED, do not implement.

If the feature can continue, take the first pending task from:

- `specs/tasks.md`

Implement the minimum necessary change according to:

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`

Rules:

- Add or update tests.
- Do not invent requirements.
- Do not modify unrelated files.
- Do not add dependencies without approval.

At the end, update:

- `specs/tasks.md`
- `specs/validation-report.md`
