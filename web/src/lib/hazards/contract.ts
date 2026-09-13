/**
 * Common hazard contract.
 *
 * One shape every RAKSHA hazard reports in, so the Zone Engine and the India
 * map never need to know which engine produced a result.
 *
 * Deliberate design decisions:
 *
 * - `severity` is a BAND, not a number, because the underlying hazards do not
 *   share a numeric scale. Flood emits a calibrated 24h/48h probability;
 *   Landslide emits a relative susceptibility score plus a rule-based warning
 *   level. Averaging those numbers would be meaningless arithmetic on
 *   incommensurable quantities, so the engine combines bands instead.
 *
 * - `kind` records WHAT the number actually is. A probability and a
 *   susceptibility score must never be presented as the same thing.
 *
 * - A hazard with no model returns `not_implemented`. It is never silently
 *   treated as absent risk, because "we did not model this" and "this is safe"
 *   are different statements.
 */

export type HazardType = "FLOOD" | "LANDSLIDE" | "CLOUDBURST" | "COASTAL_EROSION";

export type HazardStatus =
  | "ready"
  | "not_implemented"
  | "model_unavailable"
  | "data_unavailable"
  | "outside_coverage"
  | "error";

export type SeverityBand = "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";

/** What the accompanying number actually means. These are not interchangeable. */
export type MeasureKind =
  /** Calibrated probability of occurrence in a stated window. */
  | "probability"
  /** Relative spatial susceptibility. NOT a probability of occurrence. */
  | "susceptibility_score"
  /** Rule-derived warning level from current + forecast triggers. */
  | "warning_level";

export type DomainStatus =
  | "VALIDATED"
  | "SUPPORTED"
  | "EXPERIMENTAL"
  | "OUTSIDE_VALIDATED_DOMAIN"
  | "UNKNOWN";

export interface HazardMeasure {
  kind: MeasureKind;
  /** null whenever the hazard is not `ready`. Never coerced to 0. */
  value: number | null;
  band: SeverityBand | null;
  /** Horizon this measure describes, e.g. "24h", or null for static measures. */
  horizon: string | null;
  label: string;
}

export interface HazardAssessment {
  hazardType: HazardType;
  status: HazardStatus;
  /** Why, when status is not `ready`. */
  statusDetail: string | null;

  /** Primary measure used by the Zone Engine. null when not ready. */
  primary: HazardMeasure | null;
  /** Any additional measures worth showing (other horizons, base scores). */
  measures: HazardMeasure[];

  domainStatus: DomainStatus;
  validatedRegion: string | null;

  dataQuality: "HIGH" | "MEDIUM" | "LOW" | null;
  model: { name: string | null; version: string | null } | null;
  generatedAt: string | null;

  /** Engine-specific payload, for panels that want the full detail. */
  raw?: unknown;
}

export interface HazardBundle {
  location: { latitude: number; longitude: number; name: string | null };
  hazards: HazardAssessment[];
  generatedAt: string;
}

export const SEVERITY_ORDER: SeverityBand[] = ["LOW", "MODERATE", "HIGH", "VERY HIGH"];

export function severityRank(band: SeverityBand | null): number {
  return band ? SEVERITY_ORDER.indexOf(band) : -1;
}

export const SEVERITY_COLOR: Record<SeverityBand, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  "VERY HIGH": "#ef4444",
};

/** A hazard that has no model yet. Declared, never faked as low risk. */
export function notImplemented(hazardType: HazardType, reason: string): HazardAssessment {
  return {
    hazardType,
    status: "not_implemented",
    statusDetail: reason,
    primary: null,
    measures: [],
    domainStatus: "UNKNOWN",
    validatedRegion: null,
    dataQuality: null,
    model: null,
    generatedAt: null,
  };
}
