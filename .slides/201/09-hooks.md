# Hooks

### Run commands or prompts during the Agent loop

Observe, control, and extend the agent loop using custom scripts.

- Guardrail taste and accuracy by calling linters, formatters, and tests on `stop`.
- Reject tool use by blocking shell commands like `rm -rf`,  `chown`, or `chmod`.
- Detect directly access to secrets like `cat .env` and prompt to use secret store.

`.cursor/hooks`, `.git/hooks`

[Hooks](https://cursor.com/docs/agent/hooks) →
