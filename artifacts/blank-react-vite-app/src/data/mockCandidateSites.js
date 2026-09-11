/**
 * PROTOTYPE CANDIDATE RELOCATION SITES — DEMO DATA ONLY.
 *
 * Capacity, suitability scores and factor ratings below are illustrative
 * placeholders. No carrying-capacity study has been performed and no weighting
 * scheme has been agreed. Treat every score as a prototype assumption.
 */

export const SITE_STATUS = {
  RECOMMENDED: "Recommended",
  ALTERNATIVE: "Alternative",
  NOT_SUITABLE: "Not Suitable",
  PENDING: "Pending Assessment",
};

/**
 * Suitability tier for map colouring and the Candidate Sites catalogue.
 * Distinct from SITE_STATUS above (which tracks a site's role in one
 * habitation's relocation plan) - a tier is the site's standalone screening
 * outcome, independent of any specific relocation case.
 */
export const SITE_TIER = {
  HIGH: "high",
  SUITABLE: "suitable",
  NEEDS_ASSESSMENT: "needs-assessment",
  LIMITED: "limited",
  REJECTED: "rejected",
};

export const SITE_TIER_LABEL = {
  [SITE_TIER.HIGH]: "High Suitability",
  [SITE_TIER.SUITABLE]: "Suitable",
  [SITE_TIER.NEEDS_ASSESSMENT]: "Needs Assessment",
  [SITE_TIER.LIMITED]: "Limited Suitability",
  [SITE_TIER.REJECTED]: "Rejected / Unsuitable",
};

export const SITE_TIER_COLOUR = {
  [SITE_TIER.HIGH]: "#22c55e",
  [SITE_TIER.SUITABLE]: "#4ade80",
  [SITE_TIER.NEEDS_ASSESSMENT]: "#facc15",
  [SITE_TIER.LIMITED]: "#f97316",
  [SITE_TIER.REJECTED]: "#ef4444",
};

export const VERIFICATION_STATUS = {
  VERIFIED: "Verified",
  PARTIAL: "Partially Verified",
  PENDING: "Pending",
  FIELD_VISIT_REQUIRED: "Field Visit Required",
  NOT_VISITED: "Not Visited",
};

export const candidateSites = [
  {
    id: "SITE-001",
    name: "Phata",
    district: "Rudraprayag",
    state: "Uttarakhand",
    coordinates: [30.5167, 79.0167],
    distanceKm: 18,
    travelTimeMin: 45,
    hazardSafety: "High",
    capacity: 3250,
    infrastructure: "Good",
    suitability: 85,
    status: SITE_STATUS.RECOMMENDED,
    forHabitation: "HAB-001",
    factors: {
      terrainStability: "Good",
      roadAccessibility: "Good",
      waterAvailability: "Good",
      healthcareAccess: "Good",
      schoolAccess: "Moderate",
      residualHazardRisk: "Low",
    },
    suitabilityBreakdown: [
      { label: "Hazard Safety", value: 90 },
      { label: "Accessibility", value: 80 },
      { label: "Infrastructure", value: 78 },
      { label: "Essential Services", value: 82 },
      { label: "Land Availability", value: 88 },
      { label: "Environmental Impact", value: 76 },
    ],
  },
  {
    id: "SITE-002",
    name: "Guptkashi",
    district: "Rudraprayag",
    state: "Uttarakhand",
    coordinates: [30.5333, 79.0833],
    distanceKm: 12,
    travelTimeMin: 30,
    hazardSafety: "High",
    capacity: 2050,
    infrastructure: "Good",
    suitability: 78,
    status: SITE_STATUS.RECOMMENDED,
    forHabitation: "HAB-001",
    factors: {
      terrainStability: "Good",
      roadAccessibility: "Good",
      waterAvailability: "Moderate",
      healthcareAccess: "Good",
      schoolAccess: "Good",
      residualHazardRisk: "Low",
    },
    suitabilityBreakdown: [
      { label: "Hazard Safety", value: 84 },
      { label: "Accessibility", value: 86 },
      { label: "Infrastructure", value: 74 },
      { label: "Essential Services", value: 80 },
      { label: "Land Availability", value: 66 },
      { label: "Environmental Impact", value: 72 },
    ],
  },
  {
    id: "SITE-003",
    name: "Sersi",
    district: "Rudraprayag",
    state: "Uttarakhand",
    coordinates: [30.4667, 79.05],
    distanceKm: 28,
    travelTimeMin: 65,
    hazardSafety: "Moderate",
    capacity: 1800,
    infrastructure: "Moderate",
    suitability: 62,
    status: SITE_STATUS.ALTERNATIVE,
    forHabitation: "HAB-001",
    factors: {
      terrainStability: "Moderate",
      roadAccessibility: "Moderate",
      waterAvailability: "Good",
      healthcareAccess: "Moderate",
      schoolAccess: "Moderate",
      residualHazardRisk: "Moderate",
    },
    suitabilityBreakdown: [
      { label: "Hazard Safety", value: 64 },
      { label: "Accessibility", value: 58 },
      { label: "Infrastructure", value: 60 },
      { label: "Essential Services", value: 62 },
      { label: "Land Availability", value: 70 },
      { label: "Environmental Impact", value: 66 },
    ],
  },
  {
    id: "SITE-004",
    name: "Agastyamuni",
    district: "Rudraprayag",
    state: "Uttarakhand",
    coordinates: [30.3922, 78.9997],
    distanceKm: 32,
    travelTimeMin: 75,
    hazardSafety: "Low",
    capacity: 4120,
    infrastructure: "Good",
    suitability: 58,
    status: SITE_STATUS.ALTERNATIVE,
    forHabitation: "HAB-001",
    factors: {
      terrainStability: "Moderate",
      roadAccessibility: "Good",
      waterAvailability: "Good",
      healthcareAccess: "Good",
      schoolAccess: "Good",
      residualHazardRisk: "Moderate",
    },
    suitabilityBreakdown: [
      { label: "Hazard Safety", value: 48 },
      { label: "Accessibility", value: 54 },
      { label: "Infrastructure", value: 72 },
      { label: "Essential Services", value: 70 },
      { label: "Land Availability", value: 80 },
      { label: "Environmental Impact", value: 58 },
    ],
  },
  {
    id: "SITE-005",
    name: "Ukhimath",
    district: "Rudraprayag",
    state: "Uttarakhand",
    coordinates: [30.5167, 79.1],
    distanceKm: 16,
    travelTimeMin: 40,
    hazardSafety: "Moderate",
    capacity: 950,
    infrastructure: "Limited",
    suitability: 48,
    status: SITE_STATUS.NOT_SUITABLE,
    forHabitation: "HAB-001",
    factors: {
      terrainStability: "Moderate",
      roadAccessibility: "Moderate",
      waterAvailability: "Limited",
      healthcareAccess: "Limited",
      schoolAccess: "Limited",
      residualHazardRisk: "Moderate",
    },
    suitabilityBreakdown: [
      { label: "Hazard Safety", value: 56 },
      { label: "Accessibility", value: 52 },
      { label: "Infrastructure", value: 40 },
      { label: "Essential Services", value: 38 },
      { label: "Land Availability", value: 44 },
      { label: "Environmental Impact", value: 60 },
    ],
  },
];

/**
 * Factory for the India-wide catalogue below (SITE-006 onward). SITE-001..005
 * above are the original per-habitation shortlist already relied on by
 * relocationService.js and are left untouched.
 *
 * Fills in the richer Candidate Sites catalogue shape from a compact input so
 * twenty records do not turn into seven hundred lines of repetition. `tier`
 * is the single source of truth; status, factors and the validation workflow
 * are all derived from it plus a handful of per-site overrides.
 */
function buildSite({
  id,
  name,
  district,
  state,
  coordinates,
  tier,
  suitability,
  capacity,
  plannedAllocation = 0,
  distanceKm,
  travelTimeMin,
  roadAccess,
  hazardSafety,
  servicesLevel,
  verification,
  whySuitable,
  constraints,
  nearestMajorRoad,
  distanceToHabitationKm,
}) {
  const statusByTier = {
    [SITE_TIER.HIGH]: SITE_STATUS.RECOMMENDED,
    [SITE_TIER.SUITABLE]: SITE_STATUS.RECOMMENDED,
    [SITE_TIER.NEEDS_ASSESSMENT]: SITE_STATUS.PENDING,
    [SITE_TIER.LIMITED]: SITE_STATUS.ALTERNATIVE,
    [SITE_TIER.REJECTED]: SITE_STATUS.NOT_SUITABLE,
  };

  const residualHazardByTier = {
    [SITE_TIER.HIGH]: "Low",
    [SITE_TIER.SUITABLE]: "Low",
    [SITE_TIER.NEEDS_ASSESSMENT]: "Moderate",
    [SITE_TIER.LIMITED]: "Moderate",
    [SITE_TIER.REJECTED]: "High",
  };

  const infrastructureByLevel = {
    Available: "Good",
    Moderate: "Moderate",
    Limited: "Limited",
  };

  const validationSteps = [
    "GIS Screening",
    "Hazard Check",
    "Capacity Assessment",
    "Infrastructure Assessment",
    "Field Verification",
    "Administrative Review",
  ];

  // How far the workflow has progressed is derived from the verification
  // status, so the two can never disagree in the UI.
  const progressByVerification = {
    [VERIFICATION_STATUS.VERIFIED]: 6,
    [VERIFICATION_STATUS.PARTIAL]: 4,
    [VERIFICATION_STATUS.FIELD_VISIT_REQUIRED]: 3,
    [VERIFICATION_STATUS.PENDING]: 2,
    [VERIFICATION_STATUS.NOT_VISITED]: 1,
  };

  const completedSteps = progressByVerification[verification] ?? 2;

  const validation = validationSteps.map((step, index) => ({
    step,
    state:
      index < completedSteps
        ? "Completed"
        : index === completedSteps
          ? "In Progress"
          : "Pending",
  }));

  const residualHazard = residualHazardByTier[tier];

  return {
    id,
    name,
    district,
    state,
    coordinates,
    tier,
    suitability,
    capacity,
    plannedAllocation,
    residualCapacity: Math.max(0, capacity - plannedAllocation),
    residualHazard,
    hazardSafety,
    distanceKm,
    travelTimeMin,
    roadAccess,
    infrastructure: infrastructureByLevel[servicesLevel] ?? "Moderate",
    servicesLevel,
    verification,
    status: statusByTier[tier],

    factors: {
      terrainStability:
        tier === SITE_TIER.REJECTED
          ? "Poor"
          : residualHazard === "Low"
            ? "Good"
            : "Moderate",
      roadAccessibility: roadAccess,
      waterAvailability: servicesLevel,
      healthcareAccess: servicesLevel,
      schoolAccess: servicesLevel,
      residualHazardRisk: residualHazard,
    },

    suitabilityBreakdown: [
      { label: "Hazard Safety", value: Math.max(5, suitability + 4) },
      { label: "Accessibility", value: Math.max(5, suitability - 6) },
      { label: "Infrastructure", value: Math.max(5, suitability - 2) },
      { label: "Essential Services", value: Math.max(5, suitability - 8) },
      { label: "Land Availability", value: Math.min(96, suitability + 8) },
      { label: "Environmental Impact", value: Math.max(5, suitability - 4) },
    ],

    accessibility: {
      nearestMajorRoad,
      roadConnectivity: roadAccess,
      emergencyVehicleAccess:
        roadAccess === "Good"
          ? "Available"
          : roadAccess === "Moderate"
            ? "Available with delay"
            : "Limited",
      alternateAccess:
        roadAccess === "Poor" || roadAccess === "Limited"
          ? "Not available"
          : "Available",
      distanceToHabitationKm,
    },

    services: {
      health: servicesLevel,
      school: servicesLevel,
      water: servicesLevel === "Available" ? "Available" : "Pending Assessment",
      electricity: servicesLevel === "Limited" ? "Pending Assessment" : "Available",
      sanitation: servicesLevel === "Available" ? "Available" : "Moderate",
      emergency: tier === SITE_TIER.REJECTED ? "Pending Assessment" : servicesLevel,
    },

    validation,
    whySuitable,
    constraints,
    recommendedUse:
      tier === SITE_TIER.REJECTED
        ? "Not recommended for relocation planning"
        : tier === SITE_TIER.HIGH || tier === SITE_TIER.SUITABLE
          ? "Potential relocation candidate"
          : "Requires further assessment before use",
  };
}

export const catalogueSites = [
  buildSite({
    id: "SITE-006",
    name: "Munsiyari",
    district: "Pithoragarh",
    state: "Uttarakhand",
    coordinates: [30.0708, 80.2361],
    tier: SITE_TIER.HIGH,
    suitability: 88,
    capacity: 4800,
    distanceKm: 22,
    travelTimeMin: 50,
    roadAccess: "Good",
    hazardSafety: "High",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.VERIFIED,
    nearestMajorRoad: "NH 125",
    distanceToHabitationKm: 22,
    whySuitable: [
      "Located outside the selected high-risk zone",
      "Low residual multi-hazard exposure",
      "Adequate prototype carrying capacity",
      "Road access available in most weather conditions",
      "Essential services within acceptable range",
    ],
    constraints: ["Seasonal snow can restrict access for short periods"],
  }),
  buildSite({
    id: "SITE-007",
    name: "Sonitpur Extension",
    district: "Sonitpur",
    state: "Assam",
    coordinates: [26.6528, 92.7926],
    tier: SITE_TIER.HIGH,
    suitability: 89,
    capacity: 4800,
    distanceKm: 14,
    travelTimeMin: 32,
    roadAccess: "Good",
    hazardSafety: "High",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.VERIFIED,
    nearestMajorRoad: "NH 15",
    distanceToHabitationKm: 14,
    whySuitable: [
      "Outside the demo flood inundation extent",
      "Existing settlement infrastructure nearby",
      "Good road connectivity to the district headquarters",
    ],
    constraints: ["Land ownership records pending confirmation"],
  }),
  buildSite({
    id: "SITE-008",
    name: "Kendrapara Highland",
    district: "Kendrapara",
    state: "Odisha",
    coordinates: [20.6, 86.5],
    tier: SITE_TIER.SUITABLE,
    suitability: 76,
    capacity: 3600,
    distanceKm: 19,
    travelTimeMin: 42,
    roadAccess: "Good",
    hazardSafety: "Moderate",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.VERIFIED,
    nearestMajorRoad: "SH 9A",
    distanceToHabitationKm: 19,
    whySuitable: [
      "Elevated ground, outside the demo storm-surge extent",
      "Road access available",
      "Healthcare and schooling within reach",
    ],
    constraints: ["Cyclone-season access needs a seasonal review"],
  }),
  buildSite({
    id: "SITE-009",
    name: "Darbhanga North",
    district: "Darbhanga",
    state: "Bihar",
    coordinates: [26.2, 85.85],
    tier: SITE_TIER.NEEDS_ASSESSMENT,
    suitability: 58,
    capacity: 2800,
    distanceKm: 26,
    travelTimeMin: 58,
    roadAccess: "Moderate",
    hazardSafety: "Moderate",
    servicesLevel: "Moderate",
    verification: VERIFICATION_STATUS.PENDING,
    nearestMajorRoad: "NH 57",
    distanceToHabitationKm: 26,
    whySuitable: [
      "Marginally outside the demo flood extent",
      "Some existing infrastructure present",
    ],
    constraints: [
      "Water availability needs confirmation",
      "Geotechnical assessment pending",
    ],
  }),
  buildSite({
    id: "SITE-010",
    name: "Idukki Ridge",
    district: "Idukki",
    state: "Kerala",
    coordinates: [9.85, 76.97],
    tier: SITE_TIER.HIGH,
    suitability: 87,
    capacity: 5200,
    distanceKm: 15,
    travelTimeMin: 38,
    roadAccess: "Good",
    hazardSafety: "High",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.VERIFIED,
    nearestMajorRoad: "SH 32",
    distanceToHabitationKm: 15,
    whySuitable: [
      "Stable terrain outside the demo landslide extent",
      "Good all-weather road access",
      "Adequate prototype capacity for the affected population",
    ],
    constraints: ["Environmental clearance status not yet confirmed"],
  }),
  buildSite({
    id: "SITE-011",
    name: "Wayanad Fringe",
    district: "Wayanad",
    state: "Kerala",
    coordinates: [11.68, 76.13],
    tier: SITE_TIER.LIMITED,
    suitability: 44,
    capacity: 1400,
    distanceKm: 9,
    travelTimeMin: 24,
    roadAccess: "Limited",
    hazardSafety: "Moderate",
    servicesLevel: "Limited",
    verification: VERIFICATION_STATUS.FIELD_VISIT_REQUIRED,
    nearestMajorRoad: "District road",
    distanceToHabitationKm: 9,
    whySuitable: ["Close to the origin habitation, minimising disruption"],
    constraints: [
      "Still within the wider demo susceptibility zone",
      "Narrow access road unsuitable for heavy vehicles",
      "Field verification required before further consideration",
    ],
  }),
  buildSite({
    id: "SITE-012",
    name: "Nagaon Char",
    district: "Nagaon",
    state: "Assam",
    coordinates: [26.35, 92.69],
    tier: SITE_TIER.REJECTED,
    suitability: 28,
    capacity: 0,
    distanceKm: 6,
    travelTimeMin: 18,
    roadAccess: "Poor",
    hazardSafety: "Low",
    servicesLevel: "Limited",
    verification: VERIFICATION_STATUS.NOT_VISITED,
    nearestMajorRoad: "Unpaved village track",
    distanceToHabitationKm: 6,
    whySuitable: [],
    constraints: [
      "Site itself sits within an active erosion belt",
      "No usable safe land identified in the demo screening",
      "Not suitable for further relocation planning",
    ],
  }),
  buildSite({
    id: "SITE-013",
    name: "Mangan Terrace",
    district: "Mangan",
    state: "Sikkim",
    coordinates: [27.51, 88.53],
    tier: SITE_TIER.NEEDS_ASSESSMENT,
    suitability: 55,
    capacity: 1200,
    distanceKm: 11,
    travelTimeMin: 34,
    roadAccess: "Moderate",
    hazardSafety: "Moderate",
    servicesLevel: "Moderate",
    verification: VERIFICATION_STATUS.PENDING,
    nearestMajorRoad: "NH 310",
    distanceToHabitationKm: 11,
    whySuitable: ["Outside the immediate demo outburst-flow path"],
    constraints: [
      "Seismic assessment pending",
      "Limited existing infrastructure",
    ],
  }),
  buildSite({
    id: "SITE-014",
    name: "Chamba Valley",
    district: "Chamba",
    state: "Himachal Pradesh",
    coordinates: [32.56, 76.13],
    tier: SITE_TIER.SUITABLE,
    suitability: 70,
    capacity: 2200,
    distanceKm: 13,
    travelTimeMin: 33,
    roadAccess: "Moderate",
    hazardSafety: "Moderate",
    servicesLevel: "Moderate",
    verification: VERIFICATION_STATUS.PARTIAL,
    nearestMajorRoad: "NH 154",
    distanceToHabitationKm: 13,
    whySuitable: [
      "Lower slope exposure than the origin habitation",
      "Road access available, though seasonal",
    ],
    constraints: ["Winter access restricted by snowfall"],
  }),
  buildSite({
    id: "SITE-015",
    name: "Pune West Corridor",
    district: "Pune",
    state: "Maharashtra",
    coordinates: [18.6, 73.75],
    tier: SITE_TIER.SUITABLE,
    suitability: 74,
    capacity: 3000,
    distanceKm: 17,
    travelTimeMin: 40,
    roadAccess: "Good",
    hazardSafety: "Moderate",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.PARTIAL,
    nearestMajorRoad: "NH 60",
    distanceToHabitationKm: 17,
    whySuitable: [
      "Outside the modified upslope catchment",
      "Good connectivity to Pune district services",
    ],
    constraints: ["Land-use clearance pending"],
  }),
  buildSite({
    id: "SITE-016",
    name: "Darjeeling South Ridge",
    district: "Darjeeling",
    state: "West Bengal",
    coordinates: [26.95, 88.3],
    tier: SITE_TIER.SUITABLE,
    suitability: 68,
    capacity: 2600,
    distanceKm: 10,
    travelTimeMin: 28,
    roadAccess: "Good",
    hazardSafety: "Moderate",
    servicesLevel: "Moderate",
    verification: VERIFICATION_STATUS.PARTIAL,
    nearestMajorRoad: "NH 110",
    distanceToHabitationKm: 10,
    whySuitable: ["Lower terrace loading than the existing ward"],
    constraints: ["Drainage capacity needs confirmation"],
  }),
  buildSite({
    id: "SITE-017",
    name: "Kargil Plateau",
    district: "Kargil",
    state: "Ladakh",
    coordinates: [34.55, 76.13],
    tier: SITE_TIER.NEEDS_ASSESSMENT,
    suitability: 52,
    capacity: 900,
    distanceKm: 8,
    travelTimeMin: 22,
    roadAccess: "Moderate",
    hazardSafety: "Moderate",
    servicesLevel: "Limited",
    verification: VERIFICATION_STATUS.PENDING,
    nearestMajorRoad: "NH 301",
    distanceToHabitationKm: 8,
    whySuitable: ["Reduced avalanche-path exposure relative to the origin"],
    constraints: ["Seasonal isolation during winter months"],
  }),
  buildSite({
    id: "SITE-018",
    name: "Jorhat Mainland",
    district: "Jorhat",
    state: "Assam",
    coordinates: [26.75, 94.22],
    tier: SITE_TIER.HIGH,
    suitability: 82,
    capacity: 3400,
    distanceKm: 7,
    travelTimeMin: 20,
    roadAccess: "Good",
    hazardSafety: "High",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.VERIFIED,
    nearestMajorRoad: "NH 715",
    distanceToHabitationKm: 7,
    whySuitable: [
      "Mainland location, outside the island erosion belt",
      "Bridge-connected road access, not ferry-dependent",
    ],
    constraints: [
      "Resettlement land allocation pending administrative review",
    ],
  }),
  buildSite({
    id: "SITE-019",
    name: "Cachar Uplands",
    district: "Cachar",
    state: "Assam",
    coordinates: [24.73, 92.85],
    tier: SITE_TIER.SUITABLE,
    suitability: 71,
    capacity: 2900,
    distanceKm: 12,
    travelTimeMin: 30,
    roadAccess: "Good",
    hazardSafety: "Moderate",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.PARTIAL,
    nearestMajorRoad: "NH 6",
    distanceToHabitationKm: 12,
    whySuitable: ["Elevated relative to the river channel"],
    constraints: ["Drainage congestion during peak river stage"],
  }),
  buildSite({
    id: "SITE-020",
    name: "Rudraprayag Bypass",
    district: "Rudraprayag",
    state: "Uttarakhand",
    coordinates: [30.45, 78.95],
    tier: SITE_TIER.LIMITED,
    suitability: 46,
    capacity: 1100,
    distanceKm: 21,
    travelTimeMin: 48,
    roadAccess: "Limited",
    hazardSafety: "Moderate",
    servicesLevel: "Limited",
    verification: VERIFICATION_STATUS.FIELD_VISIT_REQUIRED,
    nearestMajorRoad: "NH 107",
    distanceToHabitationKm: 21,
    whySuitable: ["Lower slope angle than the source habitation"],
    constraints: [
      "Still within the wider demo multi-hazard composite",
      "Field verification required",
    ],
  }),
  buildSite({
    id: "SITE-021",
    name: "Dima Hasao Plateau",
    district: "Dima Hasao",
    state: "Assam",
    coordinates: [25.05, 93.05],
    tier: SITE_TIER.HIGH,
    suitability: 84,
    capacity: 3100,
    distanceKm: 16,
    travelTimeMin: 36,
    roadAccess: "Good",
    hazardSafety: "High",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.VERIFIED,
    nearestMajorRoad: "NH 27",
    distanceToHabitationKm: 16,
    whySuitable: [
      "Flatter plateau ground outside the demo landslide extent",
      "Rail and road access both available",
    ],
    constraints: ["Monsoon-season access review recommended"],
  }),
  buildSite({
    id: "SITE-022",
    name: "Kendrapara Coastal Buffer",
    district: "Kendrapara",
    state: "Odisha",
    coordinates: [20.35, 86.7],
    tier: SITE_TIER.SUITABLE,
    suitability: 66,
    capacity: 1900,
    distanceKm: 24,
    travelTimeMin: 52,
    roadAccess: "Moderate",
    hazardSafety: "Moderate",
    servicesLevel: "Moderate",
    verification: VERIFICATION_STATUS.PARTIAL,
    nearestMajorRoad: "SH 9A",
    distanceToHabitationKm: 24,
    whySuitable: ["Set back from the immediate demo surge extent"],
    constraints: ["Shallow water table limits drainage"],
  }),
  buildSite({
    id: "SITE-023",
    name: "Goalpara Terrace",
    district: "Goalpara",
    state: "Assam",
    coordinates: [26.15, 90.4],
    tier: SITE_TIER.SUITABLE,
    suitability: 69,
    capacity: 2500,
    distanceKm: 10,
    travelTimeMin: 26,
    roadAccess: "Good",
    hazardSafety: "Moderate",
    servicesLevel: "Available",
    verification: VERIFICATION_STATUS.PARTIAL,
    nearestMajorRoad: "NH 17",
    distanceToHabitationKm: 10,
    whySuitable: ["Above the demo floodplain boundary"],
    constraints: ["Annual monsoon access review recommended"],
  }),
];

/**
 * Full catalogue: the original per-habitation shortlist plus the India-wide
 * screening set used by the Candidate Sites page.
 */
export const allCandidateSites = [...candidateSites, ...catalogueSites];

export const siteByIdAny = (id) =>
  allCandidateSites.find((site) => site.id === id) ?? null;

export const siteById = (id) =>
  candidateSites.find((site) => site.id === id) ?? null;
