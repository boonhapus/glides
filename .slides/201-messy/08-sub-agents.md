# Sub Agents — Separate Context Windows

Sub agents are **parallel AI instances**, each with their own context window.

- Useful for: parallelizing work, or tasks too large for a single window
- The parent agent only sees **what the sub agent returns** — not its internal reasoning
- **Anti-pattern**: having a sub agent return raw dumps → bloats the parent's window

> Delegate work to sub agents like you'd delegate to a teammate.
> Give a clear task, get back a concise summary — not their entire thought process.