// Mirrors services/cloudburst-engine's POST /alert response shape.
// Kept as plain types (not codegen), matching the flood/landslide convention
// on this branch — the Python side is the source of truth during this
// prototype phase.

export type CloudburstHorizonKey = "now" | "3h" | "6h" | "12h" | "24h";

export type CloudburstLevel = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH" | "DATA_UNAVAILABLE";

export interface CloudburstHorizonAlert {
  horizon: CloudburstHorizonKey;
  label: string;
  window_hours: number;
  level: CloudburstLevel;
  available: boolean;
  color: string | null;
  reasons: string[];
  inputs: {
    peak_hourly_mm: number | null;
    accumulation_mm: number | null;
    precipitation_probability: number | null;
    thunderstorm: boolean | null;
    recent_24h_mm: number | null;
  };
  unavailable_reason: string | null;
}

export interface CloudburstAlert {
  alert_id: string;
  hazard_type: "CLOUDBURST";
  source_mode: "LIVE" | "SIMULATED";
  status: "ready" | "data_unavailable" | "error";
  status_detail: string | null;
  location: { name: string | null; latitude: number; longitude: number };
  generated_at: string;
  valid_until: string;
  disclaimer: string;
  is_ml_model: false;

  kind?: "warning_level";
  assessment_time?: string;
  recent_conditions?: Record<string, number | null>;
  forecast_conditions?: Record<string, number | null>;
  horizons: Record<CloudburstHorizonKey, CloudburstHorizonAlert>;
  highest_alert_next_24h: CloudburstLevel | null;
  peak_window: CloudburstHorizonKey | null;
  partial: boolean;
  engine_version: string;
  thresholds_status: string;
  engine_note: string;
  provider: {
    name: string | null;
    dataset?: string;
    available: boolean;
    note?: string;
    issued_at?: string | null;
    fetched_at?: string | null;
    resolution_note?: string | null;
    supports_precipitation_probability?: boolean;
    supports_past_hours?: boolean;
    thunderstorm_signal_available?: boolean;
  } | null;
  data_quality: "HIGH" | "MEDIUM" | "LOW" | "SIMULATED" | "UNAVAILABLE";
}

export interface CloudburstScenarioInput {
  peak_hourly_rainfall?: number;
  rainfall_3h?: number;
  rainfall_6h?: number;
  rainfall_12h?: number;
  rainfall_24h?: number;
  recent_24h_rainfall?: number;
  precipitation_probability?: number;
  thunderstorm?: boolean;
}
