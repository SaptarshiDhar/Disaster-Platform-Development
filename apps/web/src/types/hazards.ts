/**
 * Hazard vocabulary.
 *
 * Phase 0 defines the type surface only. No severity thresholds, weights or
 * scoring formulas are defined here — those require evidence or stakeholder
 * agreement and arrive in Phase 5 onwards.
 */

export const HAZARD_TYPES = [
  'flood',
  'landslide',
  'cloudburst',
  'coastal_erosion',
  'earthquake',
] as const;

export type HazardType = (typeof HAZARD_TYPES)[number];

export const HAZARD_LABEL: Record<HazardType, string> = {
  flood: 'Flood',
  landslide: 'Landslide',
  cloudburst: 'Cloudburst',
  coastal_erosion: 'Coastal Erosion',
  earthquake: 'Earthquake',
};

/**
 * A hazard *event* is something that is recorded to have happened.
 * It is never, on its own, a prediction — keep the two separate.
 */
export type HazardEventKind = 'historical_event';

/**
 * A hazard *layer* is a modelled or mapped susceptibility/exposure surface.
 * Distinct from an event, and distinct again from a relocation requirement.
 */
export type HazardLayerKind = 'susceptibility' | 'exposure' | 'forecast';
