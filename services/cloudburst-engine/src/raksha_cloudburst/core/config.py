"""Paths and YAML config loading for the cloudburst engine."""
from __future__ import annotations

import functools
from pathlib import Path

import yaml

SERVICE_ROOT = Path(__file__).resolve().parents[3]
CONFIGS_DIR = SERVICE_ROOT / "configs"


def _load_yaml(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


@functools.lru_cache(maxsize=1)
def thresholds_config() -> dict:
    """Operational alert thresholds (configs/alert-thresholds.yaml)."""
    return _load_yaml(CONFIGS_DIR / "alert-thresholds.yaml")
