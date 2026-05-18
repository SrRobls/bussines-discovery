# Local Dark Factory

This folder contains prompts and operational guidance for running a local Dark Factory workflow inside Cursor.

## Purpose

The goal is to make AI-assisted development more controlled, traceable, and reliable.

Instead of asking an AI to directly code a feature, the workflow forces the feature through:

```text
Intent
↓
Business AST
↓
Context Manifest
↓
Gates
↓
Plan
↓
Tasks
↓
Builder Agents
↓
Review Loop
```

## How to Use

### Step 1: PO Discovery

Use:

- `factory/prompts/01-po-discovery.md`

Expected output:

- `specs/business-ast.yaml`

### Step 2: Architect Context

Use:

- `factory/prompts/02-architect-context.md`

Expected output:

- `specs/context-manifest.yaml`
- `specs/implementation-plan.md`

### Step 3: Gate Validation

Use:

- `factory/prompts/03-gate-validation.md`

Expected output:

- `specs/validation-report.md`

### Step 4: Builder Implementation

Use:

- `factory/prompts/04-builder-implementation.md`

Expected output:

- Code changes
- Test changes
- Updated validation report

### Step 5: Reviewer Fix Loop

Use:

- `factory/prompts/05-reviewer-fix-loop.md`

Expected output:

- Review findings
- Fix loop
- Ready for PR or demo

## Important Principle

Agents communicate through artifacts, not just through chat.

Artifacts include:

- Business AST
- Context Manifest
- Implementation Plan
- Tasks
- Validation Report
- Test Results
- PR Summary

## Probabilistic vs Deterministic

### Probabilistic

Used for:

- Understanding intent
- Asking questions
- Proposing plans
- Reasoning about architecture

### Deterministic

Used for:

- Gates
- Tests
- Build
- Lint
- Security checks
- Deployment

The factory allows probabilistic reasoning, but forces deterministic validation.
