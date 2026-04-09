# Hooks

### Run commands or inject prompts during the Agent loop

Hooks (`.cursor/hooks` , `.git/hooks`) run on editor or agent lifecycle events you configure.

- **Upside**: enforce checks, attach snippets, or steer behavior **before** the model spends turns recovering
- **Risk**: chatty hooks prepend a wall of text **every** time; you pay before the first real answer
- **Design for budget**: small payloads, summarize diffs, avoid streaming megabytes on trivial events

[Hooks](https://cursor.com/docs/agent/hooks) →
