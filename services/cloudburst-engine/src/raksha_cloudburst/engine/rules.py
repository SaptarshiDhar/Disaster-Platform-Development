"""The Cloudburst alert rule engine.

ONE evaluator, used identically by LIVE and SIMULATED modes. The mode decides
only where the feature numbers come from; it never touches how they are scored.
That is what makes a simulation a real test of the engine rather than a way to
paint a chosen answer on the screen.

This is NOT a machine-learning model and does not pretend to be one. It is a
transparent threshold system whose every number lives in
configs/alert-thresholds.yaml, so a meteorologist can argue with it and
recalibrate it without reading Python.

Severity is never asserted directly by a caller. A simulation supplies rainfall
numbers; the engine decides what those numbers mean.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field

from raksha_cloudburst.core.config import thresholds_config

logger = logging.getLogger(__name__)

LEVELS = ["LOW", "MODERATE", "HIGH", "VERY_HIGH"]

# Horizon key -> (window hours, human label). NOW is the immediate hour.
HORIZONS: list[tuple[str, int, str]] = [
    ("now", 1, "Now"),
    ("3h", 3, "Next 3 hours"),
    ("6h", 6, "Next 6 hours"),
    ("12h", 12, "Next 12 hours"),
    ("24h", 24, "Next 24 hours"),
]

DATA_UNAVAILABLE = "DATA_UNAVAILABLE"


@dataclass
class HorizonFeatures:
    """Inputs for one horizon. None means genuinely unknown, never zero."""

    peak_hourly_mm: float | None = None
    accumulation_mm: float | None = None
    precipitation_probability: float | None = None
    thunderstorm: bool | None = None
    recent_24h_mm: float | None = None


@dataclass
class HorizonAlert:
    horizon: str
    label: str
    window_hours: int
    level: str | None          # one of LEVELS, or None when unavailable
    available: bool
    reasons: list[str] = field(default_factory=list)
    inputs: dict = field(default_factory=dict)
    unavailable_reason: str | None = None


def _band(value: float | None, bands: dict) -> int:
    """Map a value onto a level index using ascending thresholds."""
    if value is None:
        return -1
    level = 0
    if value >= bands["moderate"]:
        level = 1
    if value >= bands["high"]:
        level = 2
    if value >= bands["very_high"]:
        level = 3
    return level


def _clamp(index: int) -> int:
    return max(0, min(len(LEVELS) - 1, index))


def evaluate_horizon(horizon: str, features: HorizonFeatures) -> HorizonAlert:
    """Score one horizon. The only place a cloudburst level is ever decided."""
    cfg = thresholds_config()
    window = next((h for h in HORIZONS if h[0] == horizon), None)
    if window is None:
        raise ValueError(f"Unknown horizon {horizon!r}")
    _, window_hours, label = window

    accum_bands = cfg["accumulation_mm"].get(horizon)
    peak_bands = cfg["peak_hourly_mm"]

    peak_idx = _band(features.peak_hourly_mm, peak_bands)
    accum_idx = _band(features.accumulation_mm, accum_bands) if accum_bands else -1

    # Neither signal available -> the horizon is unknown. It is NOT LOW.
    if peak_idx < 0 and accum_idx < 0:
        return HorizonAlert(
            horizon=horizon,
            label=label,
            window_hours=window_hours,
            level=None,
            available=False,
            unavailable_reason=(
                "No rainfall intensity or accumulation available for this window. "
                "Absence of data is not an absence of hazard."
            ),
            inputs=_inputs_dict(features),
        )

    base_idx = max(peak_idx, accum_idx)
    reasons: list[str] = []

    if peak_idx >= accum_idx and peak_idx > 0:
        reasons.append(
            f"Peak forecast intensity {features.peak_hourly_mm} mm/h reaches the "
            f"{LEVELS[peak_idx].lower()} band"
        )
    if accum_idx > 0:
        reasons.append(
            f"{features.accumulation_mm} mm accumulating over {window_hours}h reaches the "
            f"{LEVELS[accum_idx].lower()} band"
        )
    if base_idx == 0:
        reasons.append("Rainfall intensity and accumulation are both below alert thresholds")

    # ---- modifiers, each at most one step ------------------------------
    mods = cfg["modifiers"]
    idx = base_idx

    low_prob = mods.get("low_probability", {})
    if (
        low_prob.get("enabled")
        and features.precipitation_probability is not None
        and features.precipitation_probability < low_prob["below_percent"]
        and base_idx > 0
    ):
        idx += low_prob["steps"]
        reasons.append(
            f"Downgraded: precipitation probability is only "
            f"{features.precipitation_probability:.0f}%"
        )

    storm = mods.get("thunderstorm", {})
    if storm.get("enabled") and features.thunderstorm is True:
        idx += storm["steps"]
        reasons.append("Raised: thunderstorm/convective conditions indicated")

    wet = mods.get("wet_antecedent", {})
    if (
        wet.get("enabled")
        and features.recent_24h_mm is not None
        and features.recent_24h_mm > wet["recent_24h_mm_above"]
    ):
        idx += wet["steps"]
        reasons.append(
            f"Raised: {features.recent_24h_mm} mm already fell in the previous 24h, so "
            "the ground is primed"
        )

    idx = _clamp(idx)

    if features.precipitation_probability is None:
        reasons.append("Precipitation probability unavailable from this provider")
    if features.thunderstorm is None:
        reasons.append("No thunderstorm indicator available from this provider")

    return HorizonAlert(
        horizon=horizon,
        label=label,
        window_hours=window_hours,
        level=LEVELS[idx],
        available=True,
        reasons=reasons,
        inputs=_inputs_dict(features),
    )


def _inputs_dict(f: HorizonFeatures) -> dict:
    return {
        "peak_hourly_mm": f.peak_hourly_mm,
        "accumulation_mm": f.accumulation_mm,
        "precipitation_probability": f.precipitation_probability,
        "thunderstorm": f.thunderstorm,
        "recent_24h_mm": f.recent_24h_mm,
    }


def evaluate_all(features_by_horizon: dict[str, HorizonFeatures]) -> dict:
    """Score every horizon and summarise the worst of the next 24 hours."""
    cfg = thresholds_config()
    alerts: dict[str, HorizonAlert] = {}

    for horizon, _, _ in HORIZONS:
        feats = features_by_horizon.get(horizon)
        if feats is None:
            _, window_hours, label = next(h for h in HORIZONS if h[0] == horizon)
            alerts[horizon] = HorizonAlert(
                horizon=horizon,
                label=label,
                window_hours=window_hours,
                level=None,
                available=False,
                unavailable_reason="No features supplied for this horizon.",
            )
            continue
        alerts[horizon] = evaluate_horizon(horizon, feats)

    scored = [a for a in alerts.values() if a.available and a.level]
    if scored:
        peak = max(scored, key=lambda a: LEVELS.index(a.level))
        highest = peak.level
        peak_window = peak.horizon
    else:
        highest = None
        peak_window = None

    return {
        "engine_version": cfg["version"],
        "thresholds_status": cfg["status"],
        "horizons": {
            k: {
                "horizon": a.horizon,
                "label": a.label,
                "window_hours": a.window_hours,
                "level": a.level if a.available else DATA_UNAVAILABLE,
                "available": a.available,
                "color": cfg["colors"].get(a.level) if a.available and a.level else None,
                "reasons": a.reasons,
                "inputs": a.inputs,
                "unavailable_reason": a.unavailable_reason,
            }
            for k, a in alerts.items()
        },
        "highest_alert_next_24h": highest,
        "peak_window": peak_window,
        "partial": any(not a.available for a in alerts.values()),
        "validity_minutes": cfg["validity_minutes"],
        "note": (
            "Operational RAKSHA cloudburst alert levels derived from rainfall intensity, "
            "accumulation and available convective signals. These are configurable "
            "alerting thresholds, not the IMD cloudburst definition, and they are not "
            "calibrated against observations."
        ),
    }
