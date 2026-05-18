# Tasks

## Status

Draft

## Task Rules

Each task must be:

- Small
- Testable
- Linked to Business AST
- Linked to Context Manifest
- Assigned to a Builder Agent type

## Task Board

### Todo

#### TASK-001 - Prepare domain behavior

- Status: Todo
- Builder: Domain Builder
- Linked Business Rules:
  - BR-001
- Linked Acceptance Criteria:
  - AC-001
- Description:
  - Define or update the domain behavior required by the feature.
- Expected Output:
  - Minimal domain implementation.
  - Unit tests if applicable.
- Done When:
  - Behavior matches Business AST.
  - Tests cover happy path and failure path.

#### TASK-002 - Expose interface/API

- Status: Todo
- Builder: API Builder
- Linked Business Rules:
  - BR-001
- Linked Acceptance Criteria:
  - AC-001
- Description:
  - Add or update the interface required by the feature.
- Expected Output:
  - Route/controller/handler or equivalent.
  - Request/response validation.
- Done When:
  - API follows Context Manifest.
  - No business logic is placed in transport layer unless project pattern requires it.

#### TASK-003 - Add tests

- Status: Todo
- Builder: Test Builder
- Linked Acceptance Criteria:
  - AC-001
- Description:
  - Add tests for approved behavior.
- Expected Output:
  - Unit and/or integration tests.
- Done When:
  - Tests cover happy path, failure path, and edge case.

#### TASK-004 - Documentation and operational notes

- Status: Todo
- Builder: Documentation Builder
- Description:
  - Update README or docs if needed.
- Done When:
  - Local run/test steps are clear.

### In Progress

_No tasks yet._

### Review

_No tasks yet._

### Done

_No tasks yet._

## Builder Notes

Builders must not add new tasks unless they are required to satisfy an approved acceptance criterion.

If a new task is discovered, add it under Todo and explain why.
