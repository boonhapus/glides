# MCP

### Tools and data from outside flow back **into** the window

MCP connects other systems so the agent can **call out** and read results into the Agent loop.

- **Enables**: live data without manual copy-paste; fewer giant static dumps in rules
- **Risk**: one huge JSON or error blob can chew a big slice of context in a single turn
- **Best practice**: narrow queries, cap rows, prefer summaries; remember **localhost** servers behave differently in cloud agents

[MCP](https://cursor.com/docs/context/mcp) →
