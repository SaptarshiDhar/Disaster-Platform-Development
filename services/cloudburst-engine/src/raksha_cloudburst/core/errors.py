"""Domain errors for the cloudburst engine."""
from __future__ import annotations


class CloudburstEngineError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


ERROR_STATUS: dict[str, int] = {
    "INVALID_COORDINATES": 400,
    "INVALID_SCENARIO": 400,
    "WEATHER_DATA_UNAVAILABLE": 502,
    "ALERT_FAILED": 500,
}
