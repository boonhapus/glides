# Agent Mode Friction

### Autonomy fails when agents **drift from your intent**

A high-functioning agent can still lose the plot. You might see it..

- ..attempt to push code that bypasses local linting or security checks.
- ..modify a CSS file directly, unaware that the project uses a pre-processor.
- ..updates a value by assignment - it missed that state **must** go through dispatch.

Engineering the context tethers the agent to your project's DNA, not just its training.