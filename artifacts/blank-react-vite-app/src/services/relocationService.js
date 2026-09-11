/**
 * Relocation planning data access.
 *
 * Replace these bodies with calls to /api/relocation/* when the backend lands.
 * Nothing returned here is an approved plan — every recommendation carries a
 * status requiring commander review.
 */

import { candidateSites, siteById } from "../data/mockCandidateSites";
import {
  demoRoutes,
  relocationCaseByHabitation,
  relocationCases,
} from "../data/mockRelocation";
import { mockHabitations } from "../data/mockHabitations";

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

export function listRelocationCases() {
  const rows = relocationCases.map((item) => ({
    ...item,
    habitation: mockHabitations.find((h) => h.id === item.habitationId) ?? null,
  }));

  return settle(rows);
}

export function getRelocationCase(habitationId) {
  const item = relocationCaseByHabitation(habitationId);

  if (!item) {
    return settle(null);
  }

  return settle({
    ...item,
    habitation: mockHabitations.find((h) => h.id === habitationId) ?? null,
  });
}

export function listCandidateSites(habitationId) {
  if (!habitationId) {
    return settle([...candidateSites]);
  }

  const rows = candidateSites.filter(
    (site) => site.forHabitation === habitationId,
  );

  // Fall back to the full catalogue so the comparison table is never empty.
  return settle(rows.length > 0 ? rows : [...candidateSites]);
}

export function getCandidateSite(id) {
  return settle(siteById(id));
}

export function getRoutesFor(habitationId) {
  return settle(demoRoutes.filter((route) => route.from === habitationId));
}

/**
 * KPI roll-up for the Relocation Planning view.
 *
 * Population figures are derived from the habitation dataset; capacity is
 * summed from the prototype candidate sites. Capacity deficit is the honest
 * arithmetic difference, which can legitimately be zero.
 */
export function getRelocationSummary() {
  const requiring = mockHabitations.filter(
    (item) => item.relocationPriority !== "Low",
  );

  const immediate = mockHabitations.filter(
    (item) => item.relocationPriority === "Immediate",
  );

  const populationToRelocate = immediate.reduce(
    (sum, item) => sum + item.exposedPopulation,
    0,
  );

  const capacityAvailable = candidateSites
    .filter((site) => site.status !== "Not Suitable")
    .reduce((sum, site) => sum + site.capacity, 0);

  return settle({
    habitationsRequiring: requiring.length,
    immediateCases: immediate.length,
    populationToRelocate,
    sitesAvailable: candidateSites.length,
    capacityAvailable,
    capacityDeficit: Math.max(0, populationToRelocate - capacityAvailable),
  });
}
