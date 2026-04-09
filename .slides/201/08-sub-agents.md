# Subagents

### Separate windows for parallel or overflow work

Subagents are **independent agent runs**, each with its **own** context budget.

- **Use for**: exploration, refactors, or research that would crowd your main chat
- **Parent sees the return**: summaries are cheap; pasting raw logs back **inflates the parent window**
- **Anti-pattern**: treat them as dump trucks for huge files without summarizing first

[Subagents](https://cursor.com/docs/context/subagents) →
