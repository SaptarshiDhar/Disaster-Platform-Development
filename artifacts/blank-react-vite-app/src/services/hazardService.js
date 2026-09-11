/**
 * Hazard layer data access.
 *
 * Future endpoints: /api/hazards, /api/red-zones.
 *
 * The polygons returned here are illustrative demo geometry drawn to show the
 * interface working. They are not GSI, IMD or Bhuvan output and must always be
 * rendered with a demo badge.
 */

import { RISK_COLORS, hazardPolygons } from "../data/mockHazards";
import { thematicLayers } from "../config/mapLayers";

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

/** The four analytical modes offered by the top tab bar. */
export const HAZARD_MODES = [
  { id: "landslide", label: "Landslide", colour: "#ef4444" },
  { id: "flood", label: "Flood", colour: "#3b82f6" },
  { id: "multiHazard", label: "Multi-Hazard", colour: "#a855f7" },
  { id: "exposure", label: "Exposure", colour: "#facc15" },
];

export function getHazardPolygons(mode) {
  // Exposure is a population view rather than a hazard extent, so it
  // deliberately returns no hazard polygons of its own.
  if (mode === "exposure") {
    return settle([]);
  }

  return settle(hazardPolygons[mode] ?? []);
}

export function getRiskColours() {
  return { ...RISK_COLORS };
}

/**
 * Provenance for the currently displayed hazard layer, so the legend can state
 * what the user is actually looking at.
 */
export function getLayerProvenance(mode) {
  const map = {
    landslide: thematicLayers.gsiLandslide,
    flood: thematicLayers.floodLayer,
    multiHazard: thematicLayers.multiHazardLayer,
    exposure: thematicLayers.populationExposure,
  };

  return map[mode] ?? null;
}
