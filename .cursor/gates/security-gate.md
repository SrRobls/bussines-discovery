# Security Gate

## Purpose

Validate that implementation does not introduce unsafe behavior.

## Inputs

- `specs/business-ast.yaml`
- `specs/context-manifest.yaml`
- Changed source files after implementation
- Changed config files after implementation

## Result Options

- PASS
- PASS_WITH_WARNINGS
- BLOCKED

## Required Checks

### 1. Secrets

- [ ] No API keys committed.
- [ ] No passwords committed.
- [ ] No tokens committed.
- [ ] No private certificates committed.
- [ ] Environment variables are documented safely.

### 2. Authentication

- [ ] Auth requirements are respected.
- [ ] No auth bypass introduced.
- [ ] Anonymous access is intentional if present.

### 3. Authorization

- [ ] Role/permission checks are preserved.
- [ ] Privilege escalation is not possible.
- [ ] Business actor permissions match Business AST.

### 4. Input Validation

- [ ] External input is validated.
- [ ] Invalid input has safe failure behavior.
- [ ] Error messages do not leak internals.

### 5. Data Protection

- [ ] Sensitive data is not logged.
- [ ] PII handling is documented if applicable.
- [ ] Data exposure is minimized.

### 6. Dependencies

- [ ] No suspicious dependency added.
- [ ] New dependencies are justified.
- [ ] Existing dependency policy is respected.

### 7. Logging

- [ ] Logs are useful.
- [ ] Logs do not contain secrets.
- [ ] Logs do not contain unnecessary sensitive business data.

### 8. Error Handling

- [ ] Errors fail safely.
- [ ] Exceptions are not swallowed silently.
- [ ] User-facing messages are safe.

## Blocking Conditions

Block implementation if:

- Secrets are committed.
- Auth/authorization is bypassed.
- Sensitive data is exposed.
- Dangerous dependency is added.
- Input validation is missing for external input.
- Security constraints from Context Manifest are violated.

## Output

Write findings into:

- `specs/validation-report.md`
