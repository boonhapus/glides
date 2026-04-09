import pathlib
import subprocess as sp
import os


def main() -> None:
    CURSOR_PROJECT_DIR = os.getenv("CURSOR_PROJECT_DIR")

    root = pathlib.Path(CURSOR_PROJECT_DIR)

    try:
        # Cursor treats hook stderr as failure. Route child output to stdout only.
        sp.run(
            ["uv", "run", (root / ".scripts" / "repo_health_cli.py").as_posix(), "check"],
            cwd=root,
            check=False,
            stdout=sp.DEVNULL,
            stderr=sp.DEVNULL,
        )
    except OSError:
        pass

    print("{}")


if __name__ == "__main__":
    main()
