# Prompt: Run Reviewer Agent

Acting as: Reviewer Agent

Review the current changes against:

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`
- `specs/tasks.md`
- `specs/validation-report.md`

Evaluate:

1. Business alignment.
2. Architecture alignment.
3. Test coverage.
4. Security.
5. Operational readiness.
6. Drift between spec and code.

If there are issues, create a fix loop and assign each correction to the correct Builder Agent.

If everything is correct, mark the feature as ready for PR/demo.
