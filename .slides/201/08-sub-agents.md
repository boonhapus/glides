# Subagents

### Separate context that the main agent can delgate to

Subagents are **independent agent runs**, each with its **own** context budget.

- **Use for**: parallelization, context isolation, model flexibility, cost efficiency
- The parent context **only sees the return summary**, not the entire underylying context
- **Built-in Subagents**: codebase `explore`, terminal and `browser` usage

`.cursor/agents`

[Subagents](https://cursor.com/docs/context/subagents) →
