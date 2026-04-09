# MCP — External Data Into the Window

MCP (Model Context Protocol) lets the AI **call external services** and receive results back into the context window.

- Enables: reading files, querying APIs, interacting with databases — from inside the agent
- **Risk**: a poorly designed MCP tool returning a 10,000-token JSON blob can crater your budget instantly
- **Best practice**: return minimal, targeted data — summaries over raw payloads

> Every MCP result lands on the whiteboard. Design your tools to write small.