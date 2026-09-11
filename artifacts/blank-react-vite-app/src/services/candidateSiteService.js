/**
 * Candidate Sites data access.
 *
 * Future endpoint: /api/relocation/sites. Replace these bodies with fetch
 * calls when the backend lands; the page layer does not change.
 */

import {
  SITE_TIER,
  SITE_TIER_COLOUR,
  SITE_TIER_LABEL,
  allCandidateSites,
  siteByIdAny,
} from "../data/mockCandidateSites";

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

export function listCandidateSites({ state, tier, query } = {}) {
  let rows = [...allCandidateSites];

  if (state && state !== "all") {
    rows = rows.filter((item) => item.state === state);
  }

  if (tier && tier !== "all") {
    rows = rows.filter((item) => item.tier === tier);
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

  rows.sort((a, b) => b.suitability - a.suitability);

  return settle(rows);
}

export function getCandidateSite(id) {
  return settle(siteByIdAny(id));
}

/** KPI roll-up for the Candidate Sites view, derived from the catalogue. */
export function getCandidateSiteSummary() {
  const countByTier = (tier) =>
    allCandidateSites.filter((item) => item.tier === tier).length;

  const legacyHigh = allCandidateSites.filter(
    (item) => item.tier === undefined && item.suitability >= 75,
  ).length;

  return settle({
    total: allCandidateSites.length,
    highSuitability: countByTier(SITE_TIER.HIGH) + legacyHigh,
    estimatedSafeCapacity: allCandidateSites.reduce(
      (sum, item) => sum + item.capacity,
      0,
    ),
    fieldVerified: allCandidateSites.filter(
      (item) => item.verification === "Verified",
    ).length,
    assessmentPending: allCandidateSites.filter(
      (item) =>
        item.verification === "Pending" ||
        item.verification === "Field Visit Required" ||
        item.status === "Pending Assessment",
    ).length,
    rejected: countByTier(SITE_TIER.REJECTED),
  });
}

/** Site count grouped by capacity band, for the Capacity Distribution chart. */
export function getCapacityDistribution() {
  const bands = [
    { label: "< 1K", min: 0, max: 999 },
    { label: "1K – 5K", min: 1000, max: 4999 },
    { label: "5K – 10K", min: 5000, max: 9999 },
    { label: "> 10K", min: 10000, max: Infinity },
  ];

  return settle(
    bands.map((band) => ({
      label: band.label,
      value: allCandidateSites.filter(
        (site) => site.capacity >= band.min && site.capacity <= band.max,
      ).length,
    })),
  );
}

/** Suitability tier breakdown, for the donut chart. */
export function getSuitabilityBreakdown() {
  const tiers = [
    SITE_TIER.HIGH,
    SITE_TIER.SUITABLE,
    SITE_TIER.NEEDS_ASSESSMENT,
    SITE_TIER.LIMITED,
    SITE_TIER.REJECTED,
  ];

  return settle(
    tiers.map((tier) => ({
      name: SITE_TIER_LABEL[tier],
      value: allCandidateSites.filter((site) => site.tier === tier).length,
      color: SITE_TIER_COLOUR[tier],
    })),
  );
}

/** Verification status breakdown, for the donut chart. */
export function getVerificationBreakdown() {
  const buckets = [
    { name: "Verified", match: (s) => s.verification === "Verified", color: "#4ade80" },
    {
      name: "Pending",
      match: (s) =>
        s.verification === "Pending" || s.verification === "Field Visit Required",
      color: "#facc15",
    },
    {
      name: "Not Visited",
      match: (s) => s.verification === "Not Visited",
      color: "#64748b",
    },
    {
      name: "Rejected",
      match: (s) => s.tier === SITE_TIER.REJECTED,
      color: "#ef4444",
    },
  ];

  return settle(
    buckets.map((bucket) => ({
      name: bucket.name,
      value: allCandidateSites.filter(bucket.match).length,
      color: bucket.color,
    })),
  );
}

export function getTopRankedSites(limit = 5) {
  return settle(
    [...allCandidateSites]
      .sort((a, b) => b.suitability - a.suitability)
      .slice(0, limit),
  );
}

export function getStates() {
  return settle(
    [...new Set(allCandidateSites.map((item) => item.state))].sort(),
  );
}
