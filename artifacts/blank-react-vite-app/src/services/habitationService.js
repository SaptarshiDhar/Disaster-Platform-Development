/**
 * Habitation data access.
 *
 * Every component reads habitation data through this module, never from the
 * mock files directly. When the backend lands, the bodies below become fetch
 * calls to /api/habitations and the component layer does not change.
 *
 * The functions are async on purpose so callers already handle the pending
 * case that a real network request will introduce.
 */

import {
  ASSESSMENT_STATUS,
  RELOCATION_PRIORITY,
  mockHabitations,
} from "../data/mockHabitations";

/** Simulates network latency so loading states are exercised in development. */
const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

export function listHabitations({ state, priority, hazard, query } = {}) {
  let rows = [...mockHabitations];

  if (state && state !== "all") {
    rows = rows.filter((item) => item.state === state);
  }

  if (priority && priority !== "all") {
    rows = rows.filter((item) => item.relocationPriority === priority);
  }

  if (hazard && hazard !== "all") {
    rows = rows.filter(
      (item) => item.primaryHazard.toLowerCase() === hazard.toLowerCase(),
    );
  }

  if (query) {
    const q = query.trim().toLowerCase();
    rows = rows.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q),
    );
  }

  // Highest exposure first — the ordering an operator actually wants.
  rows.sort((a, b) => b.exposurePct - a.exposurePct);

  return settle(rows);
}

export function getHabitation(id) {
  return settle(mockHabitations.find((item) => item.id === id) ?? null);
}

/**
 * KPI roll-up for the Vulnerable Habitations view.
 * Derived from the dataset so the cards can never contradict the table.
 */
export function getHabitationSummary() {
  const countBy = (priority) =>
    mockHabitations.filter((item) => item.relocationPriority === priority)
      .length;

  return settle({
    total: mockHabitations.length,
    immediate: countBy(RELOCATION_PRIORITY.IMMEDIATE),
    shortTerm: countBy(RELOCATION_PRIORITY.SHORT_TERM),
    mediumTerm: countBy(RELOCATION_PRIORITY.MEDIUM_TERM),
    populationExposed: mockHabitations.reduce(
      (sum, item) => sum + item.exposedPopulation,
      0,
    ),
    multiHazard: mockHabitations.filter((item) => item.isMultiHazard).length,
  });
}

/** Distribution of relocation priority, for the donut chart. */
export function getPriorityDistribution() {
  const buckets = [
    { name: RELOCATION_PRIORITY.IMMEDIATE, color: "#ef4444" },
    { name: RELOCATION_PRIORITY.SHORT_TERM, color: "#f97316" },
    { name: RELOCATION_PRIORITY.MEDIUM_TERM, color: "#facc15" },
  ];

  return settle(
    buckets.map((bucket) => ({
      ...bucket,
      value: mockHabitations.filter(
        (item) => item.relocationPriority === bucket.name,
      ).length,
    })),
  );
}

/** Assessment-status distribution, for the status donut. */
export function getAssessmentStatusDistribution() {
  const palette = {
    [ASSESSMENT_STATUS.VERIFIED]: "#4ade80",
    [ASSESSMENT_STATUS.GIS_ASSESSED]: "#3b82f6",
    [ASSESSMENT_STATUS.FIELD_REQUIRED]: "#f97316",
    [ASSESSMENT_STATUS.RELOCATION_PENDING]: "#facc15",
    [ASSESSMENT_STATUS.SITE_IDENTIFIED]: "#a855f7",
    [ASSESSMENT_STATUS.NOT_REVIEWED]: "#64748b",
  };

  const counts = new Map();
  for (const item of mockHabitations) {
    counts.set(item.assessmentStatus, (counts.get(item.assessmentStatus) ?? 0) + 1);
  }

  return settle(
    [...counts.entries()].map(([name, value]) => ({
      name,
      value,
      color: palette[name] ?? "#64748b",
    })),
  );
}

/** Districts ranked by number of vulnerable habitations. */
export function getTopAffectedDistricts(limit = 5) {
  const counts = new Map();

  for (const item of mockHabitations) {
    const key = `${item.district}|${item.state}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const rows = [...counts.entries()]
    .map(([key, count]) => {
      const [district, state] = key.split("|");
      return { district, state, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return settle(rows);
}

/** Habitations grouped by primary hazard, for the exposure-by-hazard bars. */
export function getHabitationsByHazard() {
  const counts = new Map();

  for (const item of mockHabitations) {
    counts.set(item.primaryHazard, (counts.get(item.primaryHazard) ?? 0) + 1);
  }

  const palette = {
    Landslide: "#ef4444",
    Flood: "#3b82f6",
    "Multi-Hazard": "#a855f7",
    Avalanche: "#22d3ee",
  };

  return settle(
    [...counts.entries()]
      .map(([hazard, count]) => ({
        hazard,
        count,
        color: palette[hazard] ?? "#64748b",
      }))
      .sort((a, b) => b.count - a.count),
  );
}

/** Distinct states present in the dataset, for filter dropdowns. */
export function getStates() {
  return settle(
    [...new Set(mockHabitations.map((item) => item.state))].sort(),
  );
}
