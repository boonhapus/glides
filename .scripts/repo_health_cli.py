from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path
from typing import Any

import cyclopts  # type: ignore[import-not-found]
import structlog  # type: ignore[import-not-found]
import tomllib

LOGGER = structlog.get_logger("repo_health")
app = cyclopts.App(name="glides-health", help="Repository health CLI for lint/format checks.")


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _load_config() -> dict[str, Any]:
    pyproject = _repo_root() / "pyproject.toml"
    with pyproject.open("rb") as fp:
        data = tomllib.load(fp)
    return data.get("tool", {}).get("repo_health", {})


def _collect_files(targets: list[str]) -> list[str]:
    root = _repo_root()
    files: list[str] = []
    for target in targets:
        target_path = root / target
        if not target_path.exists():
            continue
        for path in target_path.rglob("*"):
            if path.is_file():
                files.append(str(path.relative_to(root)).replace("\\", "/"))
    return files


def _build_prek_toml(hooks: list[dict[str, Any]], default_rev: str) -> str:
    grouped: dict[tuple[str, str], list[dict[str, Any]]] = {}
    for hook in hooks:
        repo = hook["repo"]
        rev = hook.get("rev", default_rev)
        grouped.setdefault((repo, rev), []).append(hook)

    lines: list[str] = []
    for (repo, rev), group_hooks in grouped.items():
        lines.append("[[repos]]")
        lines.append(f'repo = "{repo}"')
        lines.append(f'rev = "{rev}"')
        lines.append("hooks = [")
        for hook in group_hooks:
            hook_parts = [f'id = "{hook["id"]}"']
            if "files" in hook:
                hook_parts.append(f'files = "{hook["files"]}"')
            if "exclude" in hook:
                hook_parts.append(f'exclude = "{hook["exclude"]}"')
            if "args" in hook:
                args = ", ".join(f'"{arg}"' for arg in hook["args"])
                hook_parts.append(f"args = [{args}]")
            lines.append("  { " + ", ".join(hook_parts) + " },")
        lines.append("]")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _run_prek(mode: str) -> int:
    config = _load_config()
    prek = config.get("prek", {})
    targets = config.get("targets", ["src", ".slides"])
    files = _collect_files(targets)
    if not files:
        LOGGER.info("no_files_found", targets=targets)
        return 0

    hook_key = "check_hooks" if mode == "check" else "fix_hooks"
    hooks = prek.get(hook_key, [])
    if not hooks:
        LOGGER.info("no_hooks_configured", mode=mode)
        return 0

    default_rev = prek.get("default_rev", "v6.0.0")
    prek_config = _build_prek_toml(hooks=hooks, default_rev=default_rev)

    with tempfile.TemporaryDirectory(prefix="glides-prek-") as tmp_dir:
        cfg_path = Path(tmp_dir) / "prek.toml"
        cfg_path.write_text(prek_config, encoding="utf-8")

        cmd = ["uv", "run", "prek", "run", "-c", str(cfg_path), "--files", *files]
        LOGGER.info("running", mode=mode, command=" ".join(cmd), files=len(files))
        result = subprocess.run(cmd, cwd=_repo_root(), check=False)
        return result.returncode


@app.command
def check() -> None:
    """Run non-mutating checks."""
    raise SystemExit(_run_prek("check"))


@app.command
def fix() -> None:
    """Run mutating fixes/formatting."""
    raise SystemExit(_run_prek("fix"))


@app.default
def default() -> None:
    """Run `check` by default."""
    raise SystemExit(_run_prek("check"))


if __name__ == "__main__":
    app()
