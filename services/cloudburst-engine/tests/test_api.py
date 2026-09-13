"""Cloudburst API: validation, mode isolation, and live-provider failure."""
from __future__ import annotations

from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from raksha_cloudburst.api.main import app

client = TestClient(app)

EXTREME = {
    "peak_hourly_rainfall": 90,
    "rainfall_3h": 180,
    "rainfall_6h": 240,
    "rainfall_12h": 280,
    "rainfall_24h": 330,
    "recent_24h_rainfall": 100,
    "precipitation_probability": 95,
    "thunderstorm": True,
}


def _sim(scenario: dict, lat: float = 27.3, lon: float = 88.6):
    return client.post(
        "/alert",
        json={
            "latitude": lat,
            "longitude": lon,
            "source_mode": "SIMULATED",
            "scenario": scenario,
        },
    )


# ------------------------------------------------------------- simulation

def test_simulation_returns_ready_with_all_horizons():
    res = _sim(EXTREME)
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ready"
    assert body["source_mode"] == "SIMULATED"
    assert set(body["horizons"].keys()) == {"now", "3h", "6h", "12h", "24h"}
    assert body["highest_alert_next_24h"] == "VERY_HIGH"


def test_simulation_is_labelled_as_simulated_not_observed():
    body = _sim(EXTREME).json()
    assert body["data_quality"] == "SIMULATED"
    assert body["provider"]["name"] == "operator_supplied_scenario"
    assert "do not represent observed or forecast weather" in body["provider"]["note"]


def test_engine_is_declared_not_ml():
    body = _sim(EXTREME).json()
    assert body["is_ml_model"] is False
    assert body["engine_version"] == "cloudburst-thresholds-v1"


# ------------------------------------------------------------- validation

@pytest.mark.parametrize(
    "scenario",
    [
        {"peak_hourly_rainfall": -5},                        # negative rainfall
        {"rainfall_3h": -1},                                 # negative accumulation
        {"peak_hourly_rainfall": 10, "precipitation_probability": 150},   # prob > 100
        {"peak_hourly_rainfall": 10, "precipitation_probability": -10},   # prob < 0
        {},                                                  # no rainfall at all
        {"rainfall_3h": 100, "rainfall_6h": 40},             # accumulation decreases
        {"peak_hourly_rainfall": 80, "rainfall_3h": 20},     # 3h less than peak hour
    ],
)
def test_invalid_scenarios_are_rejected(scenario):
    assert _sim(scenario).status_code == 422


@pytest.mark.parametrize(
    "payload",
    [
        {"latitude": 999, "longitude": 88.6, "source_mode": "SIMULATED",
         "scenario": {"peak_hourly_rainfall": 10}},
        {"latitude": 27.3, "longitude": -400, "source_mode": "SIMULATED",
         "scenario": {"peak_hourly_rainfall": 10}},
        {"latitude": 27.3, "longitude": 88.6, "source_mode": "SIMULATED"},  # no scenario
        {"latitude": 27.3, "longitude": 88.6, "source_mode": "NONSENSE",
         "scenario": {"peak_hourly_rainfall": 10}},
    ],
)
def test_invalid_requests_are_rejected(payload):
    assert client.post("/alert", json=payload).status_code == 422


def test_severity_cannot_be_asserted_by_the_caller():
    """A scenario supplies rainfall; the engine decides severity.

    Passing a severity must not change the outcome, otherwise simulation would
    be a way to paint a chosen answer rather than exercise the rule engine.
    """
    res = _sim({"peak_hourly_rainfall": 1, "rainfall_3h": 2,
                "severity": "VERY_HIGH", "alert_level": "VERY_HIGH"})
    assert res.status_code == 200
    assert res.json()["horizons"]["3h"]["level"] == "LOW"


# ------------------------------------------------------- live mode failure

def test_live_provider_failure_returns_data_unavailable_not_low():
    class Unavailable:
        available = False
        reason = "all forecast providers failed"

    with patch("raksha_cloudburst.data.weather.get_forecast_bundle", return_value=Unavailable()):
        res = client.post(
            "/alert",
            json={"latitude": 27.3, "longitude": 88.6, "source_mode": "LIVE"},
        )

    body = res.json()
    assert res.status_code == 200
    assert body["status"] == "data_unavailable"
    assert body["data_quality"] == "UNAVAILABLE"
    for h in body["horizons"].values():
        assert h["level"] == "DATA_UNAVAILABLE"
    assert "not a calm one" in body["status_detail"]


def test_live_and_simulated_use_the_same_engine():
    """Identical features must score identically regardless of mode."""
    from raksha_cloudburst.engine.rules import HorizonFeatures, evaluate_horizon

    feats = HorizonFeatures(peak_hourly_mm=28, accumulation_mm=60,
                            precipitation_probability=80)
    direct = evaluate_horizon("3h", feats)

    sim = _sim({"peak_hourly_rainfall": 28, "rainfall_3h": 60,
                "precipitation_probability": 80}).json()
    assert sim["horizons"]["3h"]["level"] == direct.level


# ------------------------------------------------------------------ health

def test_health_declares_no_model_artifact_needed():
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert body["requires_model_artifact"] is False
    assert body["horizons"] == ["now", "3h", "6h", "12h", "24h"]


def test_engine_info_publishes_thresholds():
    body = client.get("/engine/info").json()
    assert body["is_ml_model"] is False
    assert "peak_hourly_mm" in body
    assert "NOT calibrated" in body["thresholds_status"]
