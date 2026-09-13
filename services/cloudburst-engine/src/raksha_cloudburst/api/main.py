"""RAKSHA Cloudburst Alert Engine — FastAPI service.

  GET  /health
  GET  /engine/info
  POST /alert

Run locally (shares the flood engine venv, which already has FastAPI):

  ..\\flood-forecast-engine\\.venv\\Scripts\\python.exe -m uvicorn \\
      raksha_cloudburst.api.main:app --host 127.0.0.1 --port 8030

This service is a RULE ENGINE, not a model. It loads no artefact and requires
no training data.
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from raksha_cloudburst.api.schemas import CloudburstAlertRequest
from raksha_cloudburst.core.config import thresholds_config
from raksha_cloudburst.engine import rules
from raksha_cloudburst.features import builder

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAKSHA Cloudburst Alert Engine",
    description=(
        "Rule-based cloudburst alerting from live weather or an operator-supplied "
        "scenario. Not a machine-learning model and not an IMD product."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

DISCLAIMER = (
    "RAKSHA cloudburst alert levels are experimental operational thresholds applied to "
    "forecast rainfall. They are not IMD cloudburst classifications, not an official "
    "warning, and not an evacuation order."
)


@app.get("/health")
async def health():
    cfg = thresholds_config()
    return {
        "status": "ok",
        "engine": "rule_based",
        "engine_version": cfg["version"],
        "thresholds_status": cfg["status"],
        "horizons": [h for h, _, _ in rules.HORIZONS],
        "levels": rules.LEVELS,
        "requires_model_artifact": False,
    }


@app.get("/engine/info")
async def engine_info():
    cfg = thresholds_config()
    return {
        "engine": "RAKSHA Cloudburst Alert Engine",
        "kind": "rule_based_threshold_engine",
        "is_ml_model": False,
        "engine_version": cfg["version"],
        "thresholds_status": cfg["status"],
        "peak_hourly_mm": cfg["peak_hourly_mm"],
        "accumulation_mm": cfg["accumulation_mm"],
        "modifiers": cfg["modifiers"],
        "note": (
            "Thresholds are operational alerting cutoffs, deliberately lower than the "
            "IMD ~100 mm/h cloudburst definition, and not calibrated against "
            "observations."
        ),
    }


@app.post("/alert")
async def alert(req: CloudburstAlertRequest):
    cfg = thresholds_config()
    generated_at = datetime.now(timezone.utc)

    base = {
        "alert_id": str(uuid.uuid4()),
        "hazard_type": "CLOUDBURST",
        "source_mode": req.source_mode,
        "location": {
            "name": req.location_name,
            "latitude": req.latitude,
            "longitude": req.longitude,
        },
        "generated_at": generated_at.isoformat(),
        "valid_until": (
            generated_at + timedelta(minutes=cfg["validity_minutes"])
        ).isoformat(),
        "disclaimer": DISCLAIMER,
        "is_ml_model": False,
    }

    try:
        if req.source_mode == "SIMULATED":
            built = builder.build_simulated_features(req.scenario.model_dump())
            provider = {
                "name": "operator_supplied_scenario",
                "available": True,
                "note": (
                    "SIMULATED SCENARIO. Rainfall values were entered by an operator and "
                    "do not represent observed or forecast weather."
                ),
            }
            data_quality = "SIMULATED"
        else:
            from raksha_cloudburst.data import weather

            bundle = weather.get_forecast_bundle(req.latitude, req.longitude)
            if not getattr(bundle, "available", False):
                base["status"] = "data_unavailable"
                base["status_detail"] = (
                    f"No live weather available: {getattr(bundle, 'reason', 'unknown')}. "
                    "No alert is produced, because an unknown sky is not a calm one."
                )
                base["horizons"] = {
                    h: {"level": rules.DATA_UNAVAILABLE, "available": False}
                    for h, _, _ in rules.HORIZONS
                }
                base["provider"] = {"name": None, "available": False}
                base["data_quality"] = "UNAVAILABLE"
                return base

            codes = weather.get_weather_codes(req.latitude, req.longitude)
            built = builder.build_live_features(bundle, weather_codes=codes)
            provider = {
                "name": bundle.provider,
                "dataset": bundle.dataset,
                "available": True,
                "issued_at": bundle.issued_at,
                "fetched_at": bundle.fetched_at,
                "resolution_note": bundle.resolution_note,
                "supports_precipitation_probability": bundle.supports_precip_probability,
                "supports_past_hours": bundle.supports_past_hours,
                "thunderstorm_signal_available": bool(codes),
            }
            resolved = sum(
                1 for f in built["features"].values() if f.accumulation_mm is not None
            )
            data_quality = (
                "HIGH"
                if resolved == len(rules.HORIZONS) and bundle.supports_past_hours
                else "MEDIUM"
                if resolved > 0
                else "LOW"
            )

        evaluated = rules.evaluate_all(built["features"])

    except Exception as exc:  # noqa: BLE001
        logger.exception("Cloudburst alert failed")
        raise HTTPException(
            status_code=500,
            detail={"error_code": "ALERT_FAILED", "message": str(exc)},
        ) from exc

    base.update(
        {
            "status": "ready",
            "status_detail": None,
            "kind": "warning_level",
            "assessment_time": built["assessment_time"],
            "recent_conditions": built["recent"],
            "forecast_conditions": built["forecast"],
            "horizons": evaluated["horizons"],
            "highest_alert_next_24h": evaluated["highest_alert_next_24h"],
            "peak_window": evaluated["peak_window"],
            "partial": evaluated["partial"],
            "engine_version": evaluated["engine_version"],
            "thresholds_status": evaluated["thresholds_status"],
            "engine_note": evaluated["note"],
            "provider": provider,
            "data_quality": data_quality,
        }
    )
    return base
