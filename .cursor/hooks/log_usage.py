import json
import pathlib
import datetime as dt
import os
import sys

PROJECT_ROOT = os.getenv("CURSOR_PROJECT_DIR")
TODAY = dt.date.today().isoformat()


def main() -> None:
    """Dump the hook payload to a log file."""
    hook_event = json.loads(sys.stdin.buffer.read().decode("utf-8-sig"))

    log_directory = pathlib.Path(PROJECT_ROOT) / ".data" / "agent_logs"
    log_directory.mkdir(parents=True, exist_ok=True)

    with open(log_directory / f"{TODAY}-hooks.jsonl", "a") as f:
        json.dump(hook_event, f)
        f.write("\n")

    print("{}")


if __name__ == "__main__":
    raise SystemExit(main())
