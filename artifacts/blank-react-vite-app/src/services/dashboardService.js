/**
 * Command-centre overview data access.
 *
 * Future endpoint: /api/analytics/overview.
 *
 * Every KPI here is derived from the prototype datasets rather than
 * hard-coded, so the headline numbers always agree with the tables and charts
 * that sit below them.
 */

import { mockHabitations } from "../data/mockHabitations";
import { candidateSites } from "../data/mockCandidateSites";
import { earlyWarningAlerts, incidentReports } from "../data/mockIncidents";

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

export function getDashboardStats() {
  const critical = mockHabitations.filter(
    (item) => item.overallRisk === "Very High" || item.overallRisk === "High",
  );

  return settle({
    criticalHabitations: critical.length,
    populationAtRisk: mockHabitations.reduce(
      (sum, item) => sum + item.exposedPopulation,
      0,
    ),
    immediateRelocation: mockHabitations.filter(
      (item) => item.relocationPriority === "Immediate",
    ).length,
    candidateSites: candidateSites.length,
    activeIncidents: incidentReports.length,
    alerts: earlyWarningAlerts.length,
  });
}

/** Exposure severity split across the habitation dataset. */
export function getExposureBreakdown() {
  const bands = [
    { name: "Very High", color: "#ef4444" },
    { name: "High", color: "#f97316" },
    { name: "Moderate", color: "#facc15" },
    { name: "Low", color: "#4ade80" },
  ];

  return settle(
    bands.map((band) => ({
      ...band,
      value: mockHabitations
        .filter((item) => item.exposure === band.name)
        .reduce((sum, item) => sum + item.exposedPopulation, 0),
    })),
  );
}

/** Districts ranked by demo exposed population. */
export function getCriticalDistricts(limit = 5) {
  const totals = new Map();

  for (const item of mockHabitations) {
    const key = `${item.district}|${item.state}`;
    totals.set(key, (totals.get(key) ?? 0) + item.exposedPopulation);
  }

  const rows = [...totals.entries()]
    .map(([key, value]) => {
      const [district, state] = key.split("|");
      return { district, state, value };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return settle(rows);
}

export function getRecentIncidents(limit = 5) {
  return settle(incidentReports.slice(0, limit));
}

export function getAlerts() {
  return settle([...earlyWarningAlerts]);
}

/**
 * Region presets for the map location selector.
 *
 * The platform is India-wide. The states below are demo focus areas only and
 * carry no special status in the product.
 */
export const regionOptions = [
  { id: "india", label: "India", center: [22.9734, 78.6569], zoom: 5 },
  { id: "uttarakhand", label: "Uttarakhand", center: [30.1, 79.2], zoom: 7 },
  { id: "assam", label: "Assam", center: [26.2, 92.9], zoom: 7 },
  { id: "bihar", label: "Bihar", center: [25.9, 85.3], zoom: 7 },
  { id: "kerala", label: "Kerala", center: [10.3, 76.3], zoom: 7 },
  { id: "odisha", label: "Odisha", center: [20.5, 84.4], zoom: 7 },
  { id: "sikkim", label: "Sikkim", center: [27.55, 88.5], zoom: 8 },
  { id: "west-bengal", label: "West Bengal", center: [24.5, 87.8], zoom: 7 },
  { id: "himachal", label: "Himachal Pradesh", center: [31.9, 77.2], zoom: 7 },
  { id: "maharashtra", label: "Maharashtra", center: [19.5, 75.5], zoom: 6 },
];

export function getRegion(id) {
  return regionOptions.find((item) => item.id === id) ?? regionOptions[0];
}
