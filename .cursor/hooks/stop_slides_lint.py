import os
import pathlib
import subprocess as sp

CURSOR_PROJECT_DIR = os.getenv("CURSOR_PROJECT_DIR")


def _run_repo_health_check(base_dir: pathlib.Path) -> str:
    """Run the repo health check and return captured stdout."""
    try:
        # Cursor treats hook stderr as failure. Keep child output in-process.
        result = sp.run(
            ["uv", "run", (base_dir / ".scripts" / "repo_health_cli.py").as_posix(), "check"],
            cwd=base_dir,
            check=False,
            stdout=sp.PIPE,
            text=True,
            stderr=sp.DEVNULL,
        )
        return result.stdout or ""
    except OSError:
        return ""


def main() -> int:
    """Run slides lint check and persist its stdout to a state log."""
    assert CURSOR_PROJECT_DIR is not None, "env `CURSOR_PROJECT_DIR` was not inherited!"

    base_dir = pathlib.Path(CURSOR_PROJECT_DIR)

    log_directory = base_dir / ".data" / "hook_state"
    log_directory.mkdir(parents=True, exist_ok=True)

    log_file = log_directory / "stop_slides_lint.stdout.log"

    child_stdout = _run_repo_health_check(base_dir)
    log_file.write_text(child_stdout, encoding="utf-8")

    print("{}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
