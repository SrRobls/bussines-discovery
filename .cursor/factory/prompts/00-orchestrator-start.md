# Prompt: Orchestrator Start

Acting as: Orchestrator Agent

Review the Local Dark Factory configuration.

Read:

- `AGENTS.md`
- `.cursor/rules/`
- `specs/`
- `gates/`
- `factory/`

Do not implement code.

Tell me:

1. If the structure is correctly configured.
2. Which files are missing or incomplete.
3. Which agent should run first.
4. Which prompt I should use to start the feature flow.

Expected flow:

```text
Intent → PO Agent → Business AST → Architect Agent → Context Manifest → Gates → Plan → Tasks → Builder Agents → Reviewer Loop
```
