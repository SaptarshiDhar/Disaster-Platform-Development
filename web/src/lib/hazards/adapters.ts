import type { LandslideAssessment } from "@/features/landslide/types";
import type { PredictionResponse } from "@/features/flood-prediction/types";
import {
  type DomainStatus,
  type HazardAssessment,
  type HazardMeasure,
  type SeverityBand,
  notImplemented,
} from "./contract";

/**
 * Engine-specific responses -> common hazard contract.
 *
 * Adapters live on the aggregation side rather than inside the engines, so
 * neither the Flood service nor the Landslide service has to change to join
 * the multi-hazard view. That keeps the working Flood module untouched.
 */

function asBand(value: string | null | undefined): SeverityBand | null {
  if (!value) return null;
  const v = value.toUpperCase().replace(/_/g, " ").trim();
  if (v === "LOW" || v === "MODERATE" || v === "HIGH" || v === "VERY HIGH") return v;
  return null;
}

// ----------------------------------------------------------------- FLOOD

export function adaptFlood(res: PredictionResponse): HazardAssessment {
  const measures: HazardMeasure[] = [];

  for (const horizon of ["24h", "48h"] as const) {
    const f = res.forecasts?.[horizon];
    if (!f) continue;
    measures.push({
      kind: "probability",
      value: f.probability,
      band: asBand(f.risk_level),
      horizon,
      label: horizon === "24h" ? "Flood probability, next 24h" : "Flood probability, 24-48h",
    });
  }

  const primary = measures.find((m) => m.horizon === "24h") ?? measures[0] ?? null;

  return {
    hazardType: "FLOOD",
    status: primary ? "ready" : "data_unavailable",
    statusDetail: primary ? null : "Flood engine returned no forecast.",
    primary,
    measures,
    // The flood model does not publish a validated-domain declaration, so its
    // domain is reported as UNKNOWN rather than assumed validated.
    domainStatus: "UNKNOWN",
    validatedRegion: null,
    dataQuality: (res.data_quality?.label as "HIGH" | "MEDIUM" | "LOW") ?? null,
    model: {
      name: (res.model as { name?: string } | undefined)?.name ?? "flood-model",
      version: (res.model as { version?: string } | undefined)?.version ?? null,
    },
    generatedAt: res.issued_at ?? null,
    raw: res,
  };
}

// ------------------------------------------------------------- LANDSLIDE

export function adaptLandslide(res: LandslideAssessment): HazardAssessment {
  const measures: HazardMeasure[] = [];

  // Base susceptibility: a relative score, explicitly NOT a probability.
  if (res.susceptibility_score !== null && res.susceptibility_score !== undefined) {
    measures.push({
      kind: "susceptibility_score",
      value: res.susceptibility_score,
      band: asBand(res.hazard_level),
      horizon: null,
      label: "Terrain susceptibility (static)",
    });
  }

  // Dynamic warning levels, which carry no numeric value by design.
  const levels = res.warnings?.levels ?? {};
  for (const [horizon, entry] of Object.entries(levels)) {
    if (!entry?.available || !entry.level) continue;
    measures.push({
      kind: "warning_level",
      value: null,
      band: asBand(entry.level),
      horizon,
      label: `Landslide warning, ${horizon}`,
    });
  }

  // The Zone Engine should act on the dynamic 24h warning when one exists,
  // because that reflects current and forecast triggers. Static susceptibility
  // is the fallback when no warning could be produced.
  const warning24 = measures.find((m) => m.kind === "warning_level" && m.horizon === "24h");
  const susceptibility = measures.find((m) => m.kind === "susceptibility_score");
  const primary = warning24 ?? susceptibility ?? null;

  const domainStatus = (res.domain?.model_domain_status as DomainStatus) ?? "UNKNOWN";

  let status: HazardAssessment["status"] = "ready";
  if (res.status === "model_unavailable") status = "model_unavailable";
  else if (res.status === "data_unavailable") status = "data_unavailable";
  else if (res.status === "outside_coverage") status = "outside_coverage";
  else if (!primary) status = "data_unavailable";

  return {
    hazardType: "LANDSLIDE",
    status,
    statusDetail: status === "ready" ? null : (res.status_detail ?? null),
    primary: status === "ready" ? primary : null,
    measures: status === "ready" ? measures : [],
    domainStatus,
    validatedRegion: res.domain?.validated_region ?? null,
    dataQuality: (res.data_quality?.label as "HIGH" | "MEDIUM" | "LOW") ?? null,
    model: { name: res.model?.name ?? null, version: res.model?.version ?? null },
    generatedAt: res.generated_at ?? null,
    raw: res,
  };
}

// ------------------------------------------------- NOT YET IMPLEMENTED

// ------------------------------------------------------------ CLOUDBURST

/**
 * Shape returned by services/cloudburst-engine's POST /alert.
 * Kept local (not a shared types file) since only this adapter reads it.
 */
interface CloudburstAlertResponse {
  status: "ready" | "data_unavailable" | "error";
  status_detail?: string | null;
  source_mode: "LIVE" | "SIMULATED";
  highest_alert_next_24h: string | null;
  peak_window: string | null;
  horizons: Record<
    string,
    {
      level: string;
      available: boolean;
      reasons?: string[];
      unavailable_reason?: string | null;
    }
  >;
  data_quality: string;
  provider?: { name: string | null } | null;
  engine_version?: string;
  generated_at?: string;
  partial?: boolean;
}

function cloudburstBand(level: string | null | undefined): SeverityBand | null {
  if (!level) return null;
  return asBand(level.replace(/_/g, " "));
}

export function adaptCloudburst(res: CloudburstAlertResponse): HazardAssessment {
  if (res.status !== "ready") {
    return {
      hazardType: "CLOUDBURST",
      status: res.status === "data_unavailable" ? "data_unavailable" : "error",
      statusDetail: res.status_detail ?? "Cloudburst engine returned no alert.",
      primary: null,
      measures: [],
      domainStatus: "UNKNOWN",
      validatedRegion: null,
      dataQuality: null,
      model: { name: "cloudburst-rule-engine", version: res.engine_version ?? null },
      generatedAt: res.generated_at ?? null,
      raw: res,
    };
  }

  const measures: HazardMeasure[] = Object.entries(res.horizons)
    .filter(([, h]) => h.available)
    .map(([horizon, h]) => ({
      kind: "warning_level" as const,
      value: null,
      band: cloudburstBand(h.level),
      horizon,
      label: `Cloudburst alert, ${horizon}`,
    }));

  // The 24h horizon is the primary measure when available; otherwise fall
  // back to whatever the engine flagged as the peak window.
  const primary =
    measures.find((m) => m.horizon === "24h") ??
    measures.find((m) => m.horizon === res.peak_window) ??
    measures[0] ??
    null;

  return {
    hazardType: "CLOUDBURST",
    status: "ready",
    statusDetail: null,
    primary,
    measures,
    // The cloudburst engine is a rule system, not a trained model, so it
    // carries no train/test validated-domain claim.
    domainStatus: "UNKNOWN",
    validatedRegion: null,
    dataQuality: (res.data_quality as "HIGH" | "MEDIUM" | "LOW") ?? null,
    model: { name: "cloudburst-rule-engine", version: res.engine_version ?? null },
    generatedAt: res.generated_at ?? null,
    raw: res,
  };
}

export function cloudburstPlaceholder(reason: string): HazardAssessment {
  return notImplemented("CLOUDBURST", reason);
}

export function coastalErosionPlaceholder(): HazardAssessment {
  return notImplemented(
    "COASTAL_EROSION",
    "No coastal erosion model exists in this repository. Implementing one needs a " +
      "real shoreline-change dataset; none has been acquired, so no score is produced."
  );
}
