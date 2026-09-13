"""Cloudburst rule engine: severity, horizons, modifiers and missing data.

Simulation mode makes these deterministic: the inputs are exact rainfall
numbers, so the expected level follows from the published thresholds rather
than from whatever the code happens to return.
"""
from __future__ import annotations

import pytest

from raksha_cloudburst.engine.rules import (
    DATA_UNAVAILABLE,
    HORIZONS,
    LEVELS,
    HorizonFeatures,
    evaluate_all,
    evaluate_horizon,
)
from raksha_cloudburst.features.builder import build_simulated_features


def _levels(result: dict) -> dict:
    return {k: v["level"] for k, v in result["horizons"].items()}


def _run(scenario: dict) -> dict:
    return evaluate_all(build_simulated_features(scenario)["features"])


# ------------------------------------------------------- severity ladder

def test_light_rainfall_is_low():
    res = _run({"peak_hourly_rainfall": 2, "rainfall_3h": 5, "rainfall_6h": 8,
                "rainfall_12h": 10, "rainfall_24h": 12,
                "precipitation_probability": 60})
    assert _levels(res)["3h"] == "LOW"
    assert res["highest_alert_next_24h"] == "LOW"


def test_moderate_rainfall_is_moderate():
    res = _run({"peak_hourly_rainfall": 12, "rainfall_3h": 28, "rainfall_6h": 42,
                "rainfall_12h": 62, "rainfall_24h": 88,
                "precipitation_probability": 70})
    assert _levels(res)["3h"] == "MODERATE"


def test_strong_short_duration_rainfall_is_high():
    res = _run({"peak_hourly_rainfall": 28, "rainfall_3h": 60, "rainfall_6h": 70,
                "rainfall_12h": 75, "rainfall_24h": 80,
                "precipitation_probability": 80})
    assert _levels(res)["3h"] == "HIGH"


def test_extreme_short_duration_rainfall_is_very_high():
    res = _run({"peak_hourly_rainfall": 90, "rainfall_3h": 180, "rainfall_6h": 240,
                "rainfall_12h": 280, "rainfall_24h": 330,
                "recent_24h_rainfall": 100, "precipitation_probability": 95,
                "thunderstorm": True})
    assert _levels(res)["3h"] == "VERY_HIGH"
    assert res["highest_alert_next_24h"] == "VERY_HIGH"


def test_severity_is_monotonic_in_intensity():
    """More rain must never produce a lower alert."""
    order = []
    for peak, acc in [(2, 5), (12, 28), (28, 60), (90, 180)]:
        res = _run({"peak_hourly_rainfall": peak, "rainfall_3h": acc,
                    "precipitation_probability": 80})
        order.append(LEVELS.index(_levels(res)["3h"]))
    assert order == sorted(order), f"alert level fell as rainfall rose: {order}"


# ------------------------------------------------- short vs long duration

def test_same_total_is_worse_when_concentrated():
    """100 mm in 3h must outrank 100 mm spread over 24h."""
    burst = _run({"peak_hourly_rainfall": 45, "rainfall_3h": 100, "rainfall_6h": 100,
                  "rainfall_12h": 100, "rainfall_24h": 100,
                  "precipitation_probability": 85})
    spread = _run({"peak_hourly_rainfall": 6, "rainfall_3h": 14, "rainfall_6h": 28,
                   "rainfall_12h": 55, "rainfall_24h": 100,
                   "precipitation_probability": 85})
    assert LEVELS.index(_levels(burst)["3h"]) > LEVELS.index(_levels(spread)["3h"])


def test_horizons_are_evaluated_independently():
    """Each horizon is scored on its OWN window, as the live path supplies them.

    Built per-horizon rather than through a scenario, because a scenario's single
    peak-hourly value genuinely falls inside every window: a 50 mm/h burst in the
    next 3 hours is also a burst within the next 24. That shared peak is correct
    behaviour, so horizon independence has to be tested where the windows really
    do carry different data.
    """
    features = {
        "now": HorizonFeatures(peak_hourly_mm=2, accumulation_mm=2,
                               precipitation_probability=90),
        "3h": HorizonFeatures(peak_hourly_mm=12, accumulation_mm=28,
                              precipitation_probability=90),
        "6h": HorizonFeatures(peak_hourly_mm=30, accumulation_mm=90,
                              precipitation_probability=90),
        "12h": HorizonFeatures(peak_hourly_mm=30, accumulation_mm=125,
                               precipitation_probability=90),
        "24h": HorizonFeatures(peak_hourly_mm=30, accumulation_mm=130,
                               precipitation_probability=90),
    }
    levels = _levels(evaluate_all(features))
    assert len(set(levels.values())) > 1, f"all horizons identical: {levels}"
    assert levels["now"] == "LOW"
    assert LEVELS.index(levels["6h"]) > LEVELS.index(levels["3h"])


def test_scenario_peak_applies_to_every_window_by_design():
    """Documents the deliberate simulation semantics tested above."""
    res = _run({"peak_hourly_rainfall": 50, "rainfall_3h": 100, "rainfall_6h": 105,
                "rainfall_12h": 108, "rainfall_24h": 110,
                "precipitation_probability": 90})
    # The stated peak hour sits inside all five windows, so all five see it.
    assert all(v == "VERY_HIGH" for v in _levels(res).values())


def test_all_five_horizons_are_returned():
    res = _run({"peak_hourly_rainfall": 20, "rainfall_3h": 40,
                "precipitation_probability": 70})
    assert set(res["horizons"].keys()) == {h for h, _, _ in HORIZONS}
    assert set(res["horizons"].keys()) == {"now", "3h", "6h", "12h", "24h"}


def test_peak_window_identifies_the_worst_horizon():
    res = _run({"peak_hourly_rainfall": 60, "rainfall_3h": 120, "rainfall_6h": 125,
                "rainfall_12h": 130, "rainfall_24h": 135,
                "precipitation_probability": 90})
    assert res["peak_window"] in res["horizons"]
    assert res["horizons"][res["peak_window"]]["level"] == res["highest_alert_next_24h"]


# --------------------------------------------------------------- modifiers

def test_low_probability_downgrades():
    confident = _run({"peak_hourly_rainfall": 28, "rainfall_3h": 60,
                      "precipitation_probability": 90})
    doubtful = _run({"peak_hourly_rainfall": 28, "rainfall_3h": 60,
                     "precipitation_probability": 10})
    assert LEVELS.index(_levels(doubtful)["3h"]) < LEVELS.index(_levels(confident)["3h"])
    assert any("probability" in r.lower() for r in res_reasons(doubtful, "3h"))


def test_thunderstorm_raises_one_step():
    calm = _run({"peak_hourly_rainfall": 12, "rainfall_3h": 28,
                 "precipitation_probability": 80})
    storm = _run({"peak_hourly_rainfall": 12, "rainfall_3h": 28,
                  "precipitation_probability": 80, "thunderstorm": True})
    delta = LEVELS.index(_levels(storm)["3h"]) - LEVELS.index(_levels(calm)["3h"])
    assert delta == 1


def test_wet_antecedent_raises_one_step():
    dry = _run({"peak_hourly_rainfall": 12, "rainfall_3h": 28,
                "recent_24h_rainfall": 5, "precipitation_probability": 80})
    wet = _run({"peak_hourly_rainfall": 12, "rainfall_3h": 28,
                "recent_24h_rainfall": 150, "precipitation_probability": 80})
    assert LEVELS.index(_levels(wet)["3h"]) > LEVELS.index(_levels(dry)["3h"])


def test_modifiers_cannot_leap_from_low_to_very_high():
    """Every modifier firing at once on trivial rain must not reach VERY_HIGH."""
    res = _run({"peak_hourly_rainfall": 1, "rainfall_3h": 2,
                "recent_24h_rainfall": 500, "precipitation_probability": 100,
                "thunderstorm": True})
    assert _levels(res)["3h"] != "VERY_HIGH"


def res_reasons(result: dict, horizon: str) -> list[str]:
    return result["horizons"][horizon]["reasons"]


def test_reasons_come_from_actual_conditions():
    res = _run({"peak_hourly_rainfall": 90, "rainfall_3h": 180,
                "recent_24h_rainfall": 100, "precipitation_probability": 95,
                "thunderstorm": True})
    reasons = " ".join(res_reasons(res, "3h")).lower()
    assert "90" in reasons or "intensity" in reasons
    assert "thunderstorm" in reasons
    assert "previous 24h" in reasons or "primed" in reasons


def test_low_alert_explains_why_it_is_low():
    res = _run({"peak_hourly_rainfall": 1, "rainfall_3h": 2,
                "precipitation_probability": 50})
    assert any("below alert thresholds" in r for r in res_reasons(res, "3h"))


# ------------------------------------------------------------ missing data

def test_missing_rainfall_is_unavailable_not_low():
    """The headline guarantee: no data must never read as a calm sky."""
    alert = evaluate_horizon("3h", HorizonFeatures(precipitation_probability=80))
    assert alert.available is False
    assert alert.level is None
    assert "not an absence of hazard" in (alert.unavailable_reason or "")


def test_partial_horizons_are_marked_unavailable_individually():
    features = {
        "now": HorizonFeatures(peak_hourly_mm=2, accumulation_mm=2),
        "3h": HorizonFeatures(peak_hourly_mm=12, accumulation_mm=28),
        "6h": HorizonFeatures(peak_hourly_mm=30, accumulation_mm=90),
        # 12h and 24h absent entirely
    }
    res = evaluate_all(features)
    levels = _levels(res)
    assert levels["now"] in LEVELS
    assert levels["6h"] in LEVELS
    assert levels["12h"] == DATA_UNAVAILABLE
    assert levels["24h"] == DATA_UNAVAILABLE
    assert res["partial"] is True


def test_highest_alert_ignores_unavailable_horizons():
    features = {
        "now": HorizonFeatures(peak_hourly_mm=50, accumulation_mm=50),
        "3h": HorizonFeatures(),
    }
    res = evaluate_all(features)
    assert res["highest_alert_next_24h"] == _levels(res)["now"]


def test_probability_alone_cannot_produce_an_alert():
    """A 100% chance of nothing is still nothing."""
    alert = evaluate_horizon(
        "3h", HorizonFeatures(precipitation_probability=100, thunderstorm=True)
    )
    assert alert.available is False


# ----------------------------------------------------------- engine config

def test_thresholds_are_declared_uncalibrated():
    res = _run({"peak_hourly_rainfall": 10, "rainfall_3h": 25})
    assert "NOT calibrated" in res["thresholds_status"]
    assert "not the IMD" in res["note"] or "IMD" in res["note"]


def test_engine_version_is_reported():
    res = _run({"peak_hourly_rainfall": 10, "rainfall_3h": 25})
    assert res["engine_version"] == "cloudburst-thresholds-v1"


def test_unknown_horizon_is_rejected():
    with pytest.raises(ValueError):
        evaluate_horizon("48h", HorizonFeatures(peak_hourly_mm=10))
