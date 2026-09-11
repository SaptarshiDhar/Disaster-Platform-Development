/**
 * Population and exposure data access.
 *
 * Future endpoint: /api/population/exposure.
 *
 * Note on provenance: the figures returned here are prototype values. They are
 * NOT WorldPop output. Callers must render them with the "Prototype data —
 * future WorldPop integration" label rather than crediting any agency.
 */

import {
  exposureByCategory,
  exposureByHazard,
  infrastructurePoints,
  nationalExposureSummary,
  populationDensityPoints,
  topExposedDistricts,
} from "../data/mockExposure";
import { mockHabitations } from "../data/mockHabitations";

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

export function getExposureSummary() {
  return settle({ ...nationalExposureSummary });
}

export function getExposureByCategory() {
  return settle([...exposureByCategory]);
}

export function getExposureByHazard() {
  return settle([...exposureByHazard]);
}

export function getTopExposedDistricts(limit = 5) {
  return settle(topExposedDistricts.slice(0, limit));
}

/** Habitations ranked by exposure percentage — derived, always consistent. */
export function getMostExposedHabitations(limit = 5) {
  const rows = [...mockHabitations]
    .sort((a, b) => b.exposurePct - a.exposurePct)
    .slice(0, limit);

  return settle(rows);
}

export function getPopulationDensityPoints() {
  return settle([...populationDensityPoints]);
}

export function getInfrastructurePoints() {
  return settle([...infrastructurePoints]);
}

/** Provenance note rendered alongside every population figure. */
export const POPULATION_PROVENANCE =
  "Prototype data — future WorldPop integration";
