"""Live weather for the cloudburst engine.

Reuses the landslide engine's forecast provider chain rather than introducing a
third weather stack. That chain is already proven in RAKSHA and gives us, for
free: Open-Meteo primary, MET Norway fallback, disk caching, and the quota
cooldown that stops a rate-limited host being hammered.

Imports are read-only. The cloudburst engine never mutates landslide state, so
it cannot regress the landslide module.

One thing the shared chain does not carry is the WMO weather code, which is how
Open-Meteo signals thunderstorms. That is fetched separately here, and its
absence degrades the thunderstorm modifier to "unknown" rather than to "false".
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

import requests

# Read-only reuse of the landslide provider chain.
from raksha_landslide.data.forecast_providers import (  # noqa: E402
    USER_AGENT,
    get_forecast as shared_get_forecast,
)
from raksha_landslide.data.elevation_providers import _cooling_down, _note_failure  # noqa: E402

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 30
WEATHERCODE_PROVIDER = "open_meteo_weathercode"


def get_forecast_bundle(lat: float, lon: float):
    """Normalised hourly forecast, or an unavailable bundle. Never raises."""
    return shared_get_forecast(lat, lon)


def get_weather_codes(lat: float, lon: float) -> dict:
    """Hourly WMO weather codes, for the thunderstorm signal.

    Returns {} when unavailable. An empty result means "unknown", and the
    feature builder leaves `thunderstorm` as None rather than claiming there is
    no thunderstorm.
    """
    remaining = _cooling_down(WEATHERCODE_PROVIDER)
    if remaining > 0:
        logger.debug("weathercode provider cooling down for %ss", int(remaining))
        return {}

    try:
        resp = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat,
                "longitude": lon,
                "hourly": "weathercode",
                "forecast_days": 2,
                "timezone": "UTC",
            },
            timeout=TIMEOUT_SECONDS,
            headers={"User-Agent": USER_AGENT},
        )
        if resp.status_code != 200:
            message = f"HTTP {resp.status_code}: {resp.text[:160]}"
            _note_failure(WEATHERCODE_PROVIDER, message)
            logger.warning("weathercode fetch failed: %s", message)
            return {}

        hourly = (resp.json() or {}).get("hourly") or {}
        times = hourly.get("time") or []
        codes = hourly.get("weathercode") or []
        out = {}
        for t, c in zip(times, codes):
            dt = datetime.fromisoformat(str(t).replace("Z", "+00:00"))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            out[dt] = c
        return out
    except Exception as exc:  # noqa: BLE001
        message = str(exc)[:160]
        _note_failure(WEATHERCODE_PROVIDER, message)
        logger.warning("weathercode fetch failed: %s", message)
        return {}
