import {
  type HazardAssessment,
  type HazardBundle,
  type SeverityBand,
  SEVERITY_COLOR,
  severityRank,
} from "./contract";

/**
 * Zone Engine.
 *
 * Turns a set of per-hazard assessments at one coordinate into a single zone
 * classification for the India map.
 *
 * Method: WORST-BAND-WINS across the hazards that actually produced a result.
 *
 * Why not a weighted score? Because the hazards report incommensurable
 * quantities — a calibrated flood probability, a relative landslide
 * susceptibility, a rule-based warning level. Multiplying or averaging those
 * would invent a composite number with no defensible meaning and would let a
 * low value in one hazard mathematically cancel a severe value in another.
 * For an evacuation-adjacent decision support tool, the governing hazard is the
 * worst one, not the average one.
 *
 * What this deliberately does NOT do:
 *
 * - It does not fill in missing hazards as LOW. A hazard that was not modelled
 *   is reported as a coverage gap, and the zone is marked partial.
 * - It does not emit a numeric "zone score".
 * - It does not decide relocation, shelter or evacuation. It classifies the
 *   hazard picture at a point; acting on that is a separate, human decision.
 */

export type ZoneClass = "GREEN" | "YELLOW" | "ORANGE" | "RED" | "UNCLASSIFIED";

const BAND_TO_ZONE: Record<SeverityBand, ZoneClass> = {
  LOW: "GREEN",
  MODERATE: "YELLOW",
  HIGH: "ORANGE",
  "VERY HIGH": "RED",
};

export const ZONE_COLOR: Record<ZoneClass, string> = {
  GREEN: SEVERITY_COLOR.LOW,
  YELLOW: SEVERITY_COLOR.MODERATE,
  ORANGE: SEVERITY_COLOR.HIGH,
  RED: SEVERITY_COLOR["VERY HIGH"],
  UNCLASSIFIED: "#6b7280",
};

export interface ZoneResult {
  zone: ZoneClass;
  color: string;
  /** The hazard that set the zone. null when nothing could be classified. */
  governingHazard: HazardAssessment["hazardType"] | null;
  governingBand: SeverityBand | null;
  governingMeasureKind: string | null;

  /** Hazards that produced a usable result. */
  contributing: Array<{
    hazardType: HazardAssessment["hazardType"];
    band: SeverityBand | null;
    kind: string;
    horizon: string | null;
  }>;

  /** Hazards that could not contribute, and why. */
  gaps: Array<{
    hazardType: HazardAssessment["hazardType"];
    status: string;
    reason: string | null;
  }>;

  /** True when at least one hazard could not be assessed. */
  partial: boolean;
  /** Lowest data quality among contributing hazards. */
  dataQuality: "HIGH" | "MEDIUM" | "LOW" | null;
  /** Weakest domain status among contributing hazards. */
  weakestDomain: string | null;
  note: string;
}

const DOMAIN_RANK: Record<string, number> = {
  VALIDATED: 4,
  SUPPORTED: 3,
  EXPERIMENTAL: 2,
  OUTSIDE_VALIDATED_DOMAIN: 1,
  UNKNOWN: 0,
};

const QUALITY_RANK: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export function computeZone(bundle: HazardBundle): ZoneResult {
  const contributing: ZoneResult["contributing"] = [];
  const gaps: ZoneResult["gaps"] = [];

  let governing: HazardAssessment | null = null;
  let governingBand: SeverityBand | null = null;

  for (const hazard of bundle.hazards) {
    if (hazard.status !== "ready" || !hazard.primary || !hazard.primary.band) {
      gaps.push({
        hazardType: hazard.hazardType,
        status: hazard.status,
        reason: hazard.statusDetail,
      });
      continue;
    }

    const band = hazard.primary.band;
    contributing.push({
      hazardType: hazard.hazardType,
      band,
      kind: hazard.primary.kind,
      horizon: hazard.primary.horizon,
    });

    if (severityRank(band) > severityRank(governingBand)) {
      governingBand = band;
      governing = hazard;
    }
  }

  if (!governingBand || !governing) {
    return {
      zone: "UNCLASSIFIED",
      color: ZONE_COLOR.UNCLASSIFIED,
      governingHazard: null,
      governingBand: null,
      governingMeasureKind: null,
      contributing,
      gaps,
      partial: true,
      dataQuality: null,
      weakestDomain: null,
      note:
        "No hazard produced a usable assessment here, so no zone is assigned. " +
        "This is a coverage gap, not a safe area.",
    };
  }

  const qualities = bundle.hazards
    .filter((h) => h.status === "ready" && h.dataQuality)
    .map((h) => h.dataQuality as string);
  const dataQuality =
    qualities.length > 0
      ? (qualities.reduce((a, b) => (QUALITY_RANK[a] <= QUALITY_RANK[b] ? a : b)) as
          | "HIGH"
          | "MEDIUM"
          | "LOW")
      : null;

  const domains = bundle.hazards
    .filter((h) => h.status === "ready")
    .map((h) => h.domainStatus as string);
  const weakestDomain =
    domains.length > 0
      ? domains.reduce((a, b) => (DOMAIN_RANK[a] <= DOMAIN_RANK[b] ? a : b))
      : null;

  const partial = gaps.length > 0;

  const notes: string[] = [
    `Zone set by ${governing.hazardType.replace(/_/g, " ").toLowerCase()} at ${governingBand}.`,
  ];
  if (partial) {
    notes.push(
      `${gaps.length} hazard(s) could not be assessed here and are not reflected in this zone.`
    );
  }
  if (weakestDomain && DOMAIN_RANK[weakestDomain] <= 2) {
    notes.push(
      "At least one contributing model is outside or at the edge of its validated domain."
    );
  }

  return {
    zone: BAND_TO_ZONE[governingBand],
    color: ZONE_COLOR[BAND_TO_ZONE[governingBand]],
    governingHazard: governing.hazardType,
    governingBand,
    governingMeasureKind: governing.primary?.kind ?? null,
    contributing,
    gaps,
    partial,
    dataQuality,
    weakestDomain,
    note: notes.join(" "),
  };
}
