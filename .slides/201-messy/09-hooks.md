# Hooks — Automatic Context Injection

Hooks (`.cursor/hooks`, `.git/hooks`) fire **automatically at lifecycle events** — file save, commit, test run, etc.

- They can inject context or trigger actions without you asking
- **Risk**: aggressive hooks silently consume token budget before the AI starts its task
- A hook that loads a full file diff on every keystroke can blow the window fast

> Hooks are powerful — but invisible. Audit them like you'd audit always-on rules.