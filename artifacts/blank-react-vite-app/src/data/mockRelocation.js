/**
 * PROTOTYPE RELOCATION PLANNING DATA — DEMO DATA ONLY.
 *
 * Nothing here is an official relocation order or an approved plan. Every plan
 * is labelled as a prototype decision-support recommendation that requires
 * commander review and field validation before it means anything at all.
 */

export const WORKFLOW_STATE = {
  COMPLETE: "Completed",
  PROTOTYPE: "Prototype Complete",
  PENDING: "Pending",
};

/**
 * A relocation case pairs a vulnerable habitation with a proposed plan.
 * `habitationId` links back into mockHabitations.
 */
export const relocationCases = [
  {
    id: "REL-001",
    habitationId: "HAB-001",
    whyRelocation: [
      "Located within a high landslide susceptibility zone",
      "Repeated slope failures recorded in the demo history",
      "Limited level ground for safe in-situ expansion",
      "Access frequently cut during heavy rainfall",
      "High risk to life and to critical local infrastructure",
    ],
    plan: {
      type: "Multi-Site Relocation",
      summary:
        "Split the affected population across two sites based on demo carrying capacity and residual risk profile.",
      status: "Requires Commander Review",
      allocations: [
        {
          siteId: "SITE-001",
          siteName: "Phata",
          people: 2100,
          sharePct: 64,
          distanceKm: 18,
          travelTimeMin: 45,
          utilisationPct: 72,
          residualCapacity: 1150,
        },
        {
          siteId: "SITE-002",
          siteName: "Guptkashi",
          people: 1165,
          sharePct: 36,
          distanceKm: 12,
          travelTimeMin: 30,
          utilisationPct: 58,
          residualCapacity: 885,
        },
      ],
      rationale: [
        "Both sites sit outside the demo high-hazard zone",
        "Combined prototype capacity covers the full affected population",
        "Road connectivity available to both sites",
        "Essential services (health, education, markets) within reach",
        "Keeps the community within the same district, limiting social disruption",
      ],
    },
    workflow: [
      { step: "Hazard Assessment", state: WORKFLOW_STATE.COMPLETE },
      { step: "Population Assessment", state: WORKFLOW_STATE.COMPLETE },
      { step: "Candidate Sites Identified", state: WORKFLOW_STATE.COMPLETE },
      { step: "Capacity Assessment", state: WORKFLOW_STATE.PROTOTYPE },
      { step: "Field Validation", state: WORKFLOW_STATE.PENDING },
      { step: "Commander Review", state: WORKFLOW_STATE.PENDING },
    ],
    carryingCapacity: {
      siteId: "SITE-001",
      siteName: "Phata",
      safeCapacity: 3250,
      demandAllocated: 2100,
      utilisationPct: 65,
      residualCapacity: 1150,
    },
  },
  {
    id: "REL-002",
    habitationId: "HAB-011",
    whyRelocation: [
      "Settlement built on historically unstable slope material",
      "Structural distress recorded across the demo ward",
      "Limited alternative land available within the same block",
    ],
    plan: {
      type: "Single-Site Relocation",
      summary:
        "Prototype plan proposes a single receiving site pending field validation of available land.",
      status: "Requires Commander Review",
      allocations: [
        {
          siteId: "SITE-002",
          siteName: "Guptkashi",
          people: 2205,
          sharePct: 100,
          distanceKm: 26,
          travelTimeMin: 60,
          utilisationPct: 88,
          residualCapacity: 245,
        },
      ],
      rationale: [
        "Receiving site lies outside the demo susceptibility zone",
        "Existing road corridor already connects the two locations",
        "Capacity headroom is narrow and requires field confirmation",
      ],
    },
    workflow: [
      { step: "Hazard Assessment", state: WORKFLOW_STATE.COMPLETE },
      { step: "Population Assessment", state: WORKFLOW_STATE.COMPLETE },
      { step: "Candidate Sites Identified", state: WORKFLOW_STATE.COMPLETE },
      { step: "Capacity Assessment", state: WORKFLOW_STATE.PROTOTYPE },
      { step: "Field Validation", state: WORKFLOW_STATE.PENDING },
      { step: "Commander Review", state: WORKFLOW_STATE.PENDING },
    ],
    carryingCapacity: {
      siteId: "SITE-002",
      siteName: "Guptkashi",
      safeCapacity: 2050,
      demandAllocated: 2205,
      utilisationPct: 108,
      residualCapacity: 0,
    },
  },
  {
    id: "REL-003",
    habitationId: "HAB-017",
    whyRelocation: [
      "Progressive bank erosion is reducing available safe ground",
      "Ferry-dependent access restricts emergency response",
      "Seasonal inundation affects the majority of households",
    ],
    plan: null,
    workflow: [
      { step: "Hazard Assessment", state: WORKFLOW_STATE.COMPLETE },
      { step: "Population Assessment", state: WORKFLOW_STATE.COMPLETE },
      { step: "Candidate Sites Identified", state: WORKFLOW_STATE.PENDING },
      { step: "Capacity Assessment", state: WORKFLOW_STATE.PENDING },
      { step: "Field Validation", state: WORKFLOW_STATE.PENDING },
      { step: "Commander Review", state: WORKFLOW_STATE.PENDING },
    ],
    carryingCapacity: null,
  },
];

export const relocationCaseByHabitation = (habitationId) =>
  relocationCases.find((item) => item.habitationId === habitationId) ?? null;

/**
 * Illustrative route geometry between an origin habitation and a site.
 * Straight-line demo paths, not routed against a real road network.
 */
export const demoRoutes = [
  {
    from: "HAB-001",
    to: "SITE-001",
    path: [
      [30.3856, 79.3197],
      [30.4400, 79.2000],
      [30.5167, 79.0167],
    ],
  },
  {
    from: "HAB-001",
    to: "SITE-002",
    path: [
      [30.3856, 79.3197],
      [30.4600, 79.2100],
      [30.5333, 79.0833],
    ],
  },
];
