"""Request models. Validation rejects impossible inputs rather than clamping."""
from __future__ import annotations

import math
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


def _finite(v: float | None, name: str) -> float | None:
    if v is None:
        return None
    if not math.isfinite(v):
        raise ValueError(f"{name} must be a finite number.")
    return v


class CloudburstScenario(BaseModel):
    """Operator-supplied rainfall for SIMULATED mode.

    Note what is absent: there is no severity field. A scenario supplies
    rainfall, and the rule engine decides what it means. Letting a caller
    assert VERY_HIGH directly would make simulation a display trick rather than
    a test of the engine.
    """

    peak_hourly_rainfall: float | None = Field(default=None, ge=0, le=1000)
    rainfall_3h: float | None = Field(default=None, ge=0, le=2000)
    rainfall_6h: float | None = Field(default=None, ge=0, le=3000)
    rainfall_12h: float | None = Field(default=None, ge=0, le=4000)
    rainfall_24h: float | None = Field(default=None, ge=0, le=5000)
    recent_24h_rainfall: float | None = Field(default=None, ge=0, le=5000)
    precipitation_probability: float | None = Field(default=None, ge=0, le=100)
    thunderstorm: bool | None = None

    @field_validator(
        "peak_hourly_rainfall",
        "rainfall_3h",
        "rainfall_6h",
        "rainfall_12h",
        "rainfall_24h",
        "recent_24h_rainfall",
        "precipitation_probability",
    )
    @classmethod
    def finite(cls, v, info):
        return _finite(v, info.field_name)

    @model_validator(mode="after")
    def at_least_one_rainfall(self):
        supplied = [
            self.peak_hourly_rainfall,
            self.rainfall_3h,
            self.rainfall_6h,
            self.rainfall_12h,
            self.rainfall_24h,
        ]
        if all(v is None for v in supplied):
            raise ValueError(
                "A scenario must supply at least one rainfall value; otherwise there is "
                "nothing for the engine to evaluate."
            )
        return self

    @model_validator(mode="after")
    def accumulations_must_not_decrease(self):
        """Longer windows cannot contain less rain than shorter ones."""
        ordered = [
            ("rainfall_3h", self.rainfall_3h),
            ("rainfall_6h", self.rainfall_6h),
            ("rainfall_12h", self.rainfall_12h),
            ("rainfall_24h", self.rainfall_24h),
        ]
        present = [(n, v) for n, v in ordered if v is not None]
        for (prev_name, prev), (name, cur) in zip(present, present[1:]):
            if cur < prev:
                raise ValueError(
                    f"{name} ({cur} mm) is less than {prev_name} ({prev} mm). "
                    "Cumulative rainfall cannot decrease as the window widens."
                )
        if self.peak_hourly_rainfall is not None and self.rainfall_3h is not None:
            if self.rainfall_3h < self.peak_hourly_rainfall:
                raise ValueError(
                    "rainfall_3h cannot be less than peak_hourly_rainfall: the peak hour "
                    "is inside the 3-hour window."
                )
        return self


class CloudburstAlertRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_name: str | None = None
    source_mode: Literal["LIVE", "SIMULATED"] = "LIVE"
    scenario: CloudburstScenario | None = None

    @field_validator("latitude", "longitude")
    @classmethod
    def finite_coords(cls, v, info):
        if not math.isfinite(v):
            raise ValueError(f"{info.field_name} must be a finite number.")
        return v

    @model_validator(mode="after")
    def scenario_required_for_simulation(self):
        if self.source_mode == "SIMULATED" and self.scenario is None:
            raise ValueError("SIMULATED mode requires a `scenario` object.")
        return self
