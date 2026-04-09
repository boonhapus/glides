# Rules — Always-On Context

Rules (`.cursor/rules`, `.agents/AGENTS.md`) are injected at the **top of every request**.

- Great for: coding standards, tone, project conventions, things the AI must always know
- **Danger**: every word costs tokens on *every single call* — bloated rules silently eat your budget
- **Best practice**: keep rules short and high-signal; move verbose reference material into Skills

> If you're pasting the same instruction into every chat, it belongs in a rule.