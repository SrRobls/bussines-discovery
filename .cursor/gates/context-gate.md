# Context Gate

## Purpose

Validate that the technical context is sufficient for Builder Agents to implement without improvising.

## Input

- `specs/context-manifest.yaml`
- `specs/business-ast.yaml`

## Result Options

- PASS
- PASS_WITH_WARNINGS
- BLOCKED

## Required Checks

### 1. Project Identification

- [ ] Project name exists.
- [ ] Primary language is defined.
- [ ] Framework is defined or marked as not applicable.
- [ ] Runtime is defined if applicable.
- [ ] Package manager is defined if applicable.

### 2. Repository Understanding

- [ ] Important folders are listed.
- [ ] Important files are listed.
- [ ] Impacted modules are identified.

### 3. Architecture

- [ ] Architecture style is described.
- [ ] Layers are defined.
- [ ] Layer responsibilities are clear.
- [ ] Existing patterns are respected.

### 4. Domain Context

- [ ] Relevant entities are identified.
- [ ] Relevant use cases are identified.
- [ ] Domain boundaries are clear.

### 5. Integration Points

- [ ] Inbound interfaces are listed.
- [ ] Outbound dependencies are listed.
- [ ] Failure behavior is described for outbound calls.

### 6. Data

- [ ] Persistence need is explicit.
- [ ] Migrations need is explicit.
- [ ] Data sensitivity is described.

### 7. API Contracts

- [ ] Endpoint changes are described if applicable.
- [ ] Request/response expectations are clear.
- [ ] Auth requirements are explicit.

### 8. Commands

- [ ] Install command is known or marked not applicable.
- [ ] Build command is known or marked not applicable.
- [ ] Lint command is known or marked not applicable.
- [ ] Test command is known or marked not applicable.

### 9. Testing

- [ ] Testing framework is identified.
- [ ] Required test types are listed.
- [ ] Minimum test cases are specified.

### 10. Security

- [ ] Auth requirements are explicit.
- [ ] Authorization requirements are explicit.
- [ ] Input validation requirements are explicit.
- [ ] Logging rules are defined.
- [ ] Forbidden security behaviors are listed.

### 11. Constraints

- [ ] Constraints are explicit.
- [ ] Forbidden changes are listed.
- [ ] Dependency policy is clear.

## Blocking Conditions

Block implementation if:

- The project structure is unknown.
- The impacted modules are unknown.
- Test/build commands are unknown and cannot be safely skipped.
- Security requirements are missing for auth/data-sensitive features.
- The Context Manifest allows architecture drift.
- The implementation would require unapproved dependencies.

## Output

Write findings into:

- `specs/validation-report.md`
