"""Build cloudburst features for both modes.

LIVE and SIMULATED converge on the same `HorizonFeatures` structure before the
rule engine sees anything, so the engine cannot tell them apart and cannot
score them differently.

Window convention, identical to the rest of RAKSHA:

    antecedent  [now - N h, now)   what has already fallen
    forecast    [now, now + N h)   what is expected

Nothing after `now` leaks into antecedent rainfall, and nothing before it leaks
into a forecast window.

Missing values stay None the whole way through. 0 mm of rain is an observation;
a gap in a provider's series is not, and conflating them would invent a dry sky.
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from raksha_cloudburst.engine.rules import HORIZONS, HorizonFeatures

logger = logging.getLogger(__name__)

# Open-Meteo WMO weather codes that indicate thunderstorm / deep convection.
THUNDERSTORM_CODES = {95, 96, 99}


# --------------------------------------------------------------- LIVE MODE


def build_live_features(bundle, weather_codes: dict | None = None, now: datetime | None = None) -> dict:
    """Features per horizon from a normalised forecast bundle.

    `bundle` is a raksha_landslide.data.forecast_providers.ForecastBundle — the
    same provider chain (Open-Meteo, falling back to MET Norway) already proven
    in the landslide engine, reused rather than duplicated.
    """
    now = (now or datetime.now(timezone.utc)).replace(minute=0, second=0, microsecond=0)
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)

    steps = getattr(bundle, "hourly", []) or []

    def window(start: datetime, end: datetime):
        return [s for s in steps if start <= s.time < end]

    def total(sel) -> float | None:
        vals = [s.precip_mm for s in sel if s.precip_mm is not None]
        return round(float(sum(vals)), 2) if vals else None

    def peak(sel) -> float | None:
        vals = [s.precip_mm for s in sel if s.precip_mm is not None]
        return round(float(max(vals)), 2) if vals else None

    def mean_prob(sel) -> float | None:
        vals = [s.precip_probability for s in sel if s.precip_probability is not None]
        return round(float(sum(vals) / len(vals)), 1) if vals else None

    # Antecedent rainfall. Only some providers publish past hours; when they do
    # not, this stays None rather than being read as a dry 24 hours.
    recent_24h = (
        total(window(now - timedelta(hours=24), now))
        if getattr(bundle, "supports_past_hours", False)
        else None
    )

    recent = {
        "recent_1h_mm": total(window(now - timedelta(hours=1), now))
        if getattr(bundle, "supports_past_hours", False)
        else None,
        "recent_3h_mm": total(window(now - timedelta(hours=3), now))
        if getattr(bundle, "supports_past_hours", False)
        else None,
        "recent_6h_mm": total(window(now - timedelta(hours=6), now))
        if getattr(bundle, "supports_past_hours", False)
        else None,
        "recent_24h_mm": recent_24h,
    }

    features: dict[str, HorizonFeatures] = {}
    forecast_summary: dict = {}

    for horizon, hours, _ in HORIZONS:
        sel = window(now, now + timedelta(hours=hours))
        accum = total(sel)
        pk = peak(sel)
        prob = mean_prob(sel) if getattr(bundle, "supports_precip_probability", False) else None

        thunder = None
        if weather_codes:
            codes = [
                c
                for t, c in weather_codes.items()
                if now <= t < now + timedelta(hours=hours) and c is not None
            ]
            if codes:
                thunder = any(int(c) in THUNDERSTORM_CODES for c in codes)

        features[horizon] = HorizonFeatures(
            peak_hourly_mm=pk,
            accumulation_mm=accum,
            precipitation_probability=prob,
            thunderstorm=thunder,
            recent_24h_mm=recent_24h,
        )
        forecast_summary[f"forecast_{horizon}_mm"] = accum
        forecast_summary[f"forecast_peak_hourly_{horizon}_mm"] = pk

    return {
        "features": features,
        "recent": recent,
        "forecast": forecast_summary,
        "assessment_time": now.isoformat(),
    }


# ---------------------------------------------------------- SIMULATION MODE


def build_simulated_features(scenario: dict) -> dict:
    """Features per horizon from operator-supplied rainfall numbers.

    The scenario supplies RAINFALL, never a severity. The same rule engine then
    decides what those numbers mean, so a simulation genuinely exercises the
    engine instead of asserting a conclusion.

    Accumulations are treated as cumulative totals for each window. The NOW
    window uses the peak hourly value, since a one-hour window is exactly what
    peak intensity describes.
    """
    peak = scenario.get("peak_hourly_rainfall")
    prob = scenario.get("precipitation_probability")
    thunder = scenario.get("thunderstorm")
    recent_24h = scenario.get("recent_24h_rainfall")

    accum_by_horizon = {
        "now": peak,  # a 1-hour window IS the peak hour
        "3h": scenario.get("rainfall_3h"),
        "6h": scenario.get("rainfall_6h"),
        "12h": scenario.get("rainfall_12h"),
        "24h": scenario.get("rainfall_24h"),
    }

    features: dict[str, HorizonFeatures] = {}
    for horizon, _, _ in HORIZONS:
        features[horizon] = HorizonFeatures(
            peak_hourly_mm=peak,
            accumulation_mm=accum_by_horizon.get(horizon),
            precipitation_probability=prob,
            thunderstorm=thunder,
            recent_24h_mm=recent_24h,
        )

    return {
        "features": features,
        "recent": {"recent_24h_mm": recent_24h},
        "forecast": {
            f"forecast_{h}_mm": accum_by_horizon.get(h) for h, _, _ in HORIZONS
        }
        | {"forecast_peak_hourly_mm": peak},
        "assessment_time": datetime.now(timezone.utc)
        .replace(minute=0, second=0, microsecond=0)
        .isoformat(),
    }
