/**
 * PROTOTYPE POPULATION EXPOSURE DATA — DEMO DATA ONLY.
 *
 * Population figures here are invented for demonstration. They are NOT
 * WorldPop output and must never be labelled as such. The UI labels these as
 * "Prototype data — future WorldPop integration".
 */

/**
 * Illustrative population-density markers. In the real system these become a
 * gridded raster; here they are a handful of points so the map can demonstrate
 * a density visual language distinct from hazard severity.
 */
export const populationDensityPoints = [
  { id: "PD-01", name: "Delhi NCR", coordinates: [28.6139, 77.209], density: 1200 },
  { id: "PD-02", name: "Mumbai", coordinates: [19.076, 72.8777], density: 1150 },
  { id: "PD-03", name: "Kolkata", coordinates: [22.5726, 88.3639], density: 1100 },
  { id: "PD-04", name: "Chennai", coordinates: [13.0827, 80.2707], density: 900 },
  { id: "PD-05", name: "Bengaluru", coordinates: [12.9716, 77.5946], density: 880 },
  { id: "PD-06", name: "Hyderabad", coordinates: [17.385, 78.4867], density: 760 },
  { id: "PD-07", name: "Patna", coordinates: [25.5941, 85.1376], density: 720 },
  { id: "PD-08", name: "Lucknow", coordinates: [26.8467, 80.9462], density: 690 },
  { id: "PD-09", name: "Guwahati", coordinates: [26.1445, 91.7362], density: 520 },
  { id: "PD-10", name: "Ahmedabad", coordinates: [23.0225, 72.5714], density: 640 },
  { id: "PD-11", name: "Bhopal", coordinates: [23.2599, 77.4126], density: 450 },
  { id: "PD-12", name: "Visakhapatnam", coordinates: [17.6868, 83.2185], density: 480 },
  { id: "PD-13", name: "Srinagar", coordinates: [34.0837, 74.7973], density: 300 },
  { id: "PD-14", name: "Jaipur", coordinates: [26.9124, 75.7873], density: 560 },
];

/** Exposure severity bands used by the donut chart. */
export const exposureByCategory = [
  { name: "Very High", value: 37912120, color: "#ef4444" },
  { name: "High", value: 62418430, color: "#f97316" },
  { name: "Moderate", value: 68140290, color: "#facc15" },
  { name: "Low", value: 39821140, color: "#4ade80" },
];

/** Districts ranked by demo exposed population. */
export const topExposedDistricts = [
  { district: "Kamrup", state: "Assam", exposed: 2842310 },
  { district: "Morigaon", state: "Assam", exposed: 2165420 },
  { district: "Darjeeling", state: "West Bengal", exposed: 1982760 },
  { district: "Nagaon", state: "Assam", exposed: 1976320 },
  { district: "Chamoli", state: "Uttarakhand", exposed: 1642580 },
  { district: "Darbhanga", state: "Bihar", exposed: 1508940 },
  { district: "Wayanad", state: "Kerala", exposed: 1322870 },
  { district: "Kendrapara", state: "Odisha", exposed: 1194360 },
];

/** Exposed population split by hazard type. */
export const exposureByHazard = [
  { hazard: "Flood", exposed: 96381220, color: "#3b82f6" },
  { hazard: "Landslide", exposed: 72412360, color: "#ef4444" },
  { hazard: "Cyclone", exposed: 28546110, color: "#22d3ee" },
  { hazard: "Multi-Hazard", exposed: 17998430, color: "#a855f7" },
];

/**
 * Headline national figures for the Population & Exposure view.
 * Prototype values, deliberately rounded and clearly badged in the UI.
 */
export const nationalExposureSummary = {
  populationInView: 1428627663,
  populationExposed: 215346780,
  veryHighExposure: 37912120,
  criticalHabitations: 12460,
  infrastructureExposed: 98721,
  immediatePriorityPopulation: 56320410,
};

/** Demo infrastructure markers for the exposure map. */
export const infrastructurePoints = [
  { id: "INF-01", type: "hospital", name: "District Hospital, Chamoli", coordinates: [30.4, 79.32] },
  { id: "INF-02", type: "hospital", name: "Civil Hospital, Darbhanga", coordinates: [26.16, 85.9] },
  { id: "INF-03", type: "hospital", name: "Medical College, Silchar", coordinates: [24.84, 92.78] },
  { id: "INF-04", type: "school", name: "Govt. School, Wayanad", coordinates: [11.6, 76.13] },
  { id: "INF-05", type: "school", name: "Higher Secondary, Majuli", coordinates: [26.95, 94.18] },
  { id: "INF-06", type: "school", name: "Govt. School, Dima Hasao", coordinates: [25.5, 93.18] },
];
