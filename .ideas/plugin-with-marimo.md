The current [**@.cursor/hooks/log_usage.py**](.cursor/hooks/log_usage.py) records all usage of cursor based on what hooks are tracked.

We can use Marimo to visualize this information after compaction / conversion to a better data format (.jsonl is fine for quick and dirty, but we want something analyzable).

We'd probably want to autocompact this to sqlite/duckdb/something every so often. This probably isn't useful to do as part of hooks, but as a cronjob or something similar as part of MDM deployments.