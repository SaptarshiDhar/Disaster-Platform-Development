/**
 * PROTOTYPE FIELD SITREPS — DEMO DATA ONLY.
 *
 * Official NDRF / SDRF field-team situation reports. These are demonstration
 * entries written to exercise the reporting surface, not a live feed. Several
 * link to a full incident record in mockIncidents.js via `linkedIncidentId`.
 */

export const fieldReports = [
  {
    id: "FLD-001",
    team: "NDRF Team BR-04",
    place: "Kankarbagh, Patna, Bihar",
    coordinates: [25.6127, 85.1444],
    time: "6 min ago",
    severity: "Critical",
    situation:
      "Severe urban flooding. Multiple people stranded in low-lying areas. Boats deployed for rescue.",
    progressPct: 70,
    obstacle: "Water level continues to rise in several pockets",
    nextRequirement: "Additional boats required",
    linkedIncidentId: "OP-2026-0147",
  },
  {
    id: "FLD-002",
    team: "NDRF Team UK-02",
    place: "Bhyunder Gaon, Chamoli, Uttarakhand",
    coordinates: [30.3856, 79.3197],
    time: "35 min ago",
    severity: "High",
    situation:
      "Slope failure near a residential cluster. Households within 200 m evacuated as a precaution.",
    progressPct: 60,
    obstacle: "Continued slope movement, ground still unstable",
    nextRequirement: "Geotechnical survey team",
    linkedIncidentId: "OP-2026-0140",
  },
  {
    id: "FLD-003",
    team: "NDRF Team AS-01",
    place: "Langting, Dima Hasao, Assam",
    coordinates: [25.5167, 93.1833],
    time: "12 min ago",
    severity: "Moderate",
    situation: "Road blockage due to landslide on NH-10. Clearing in progress. No casualties reported.",
    progressPct: 40,
    obstacle: "Excavator not yet on site",
    nextRequirement: "Excavator required",
    linkedIncidentId: "OP-2026-0141",
  },
  {
    id: "FLD-004",
    team: "NDRF Team KL-03",
    place: "Mundakkai, Wayanad, Kerala",
    coordinates: [11.4667, 76.1333],
    time: "6 hr ago",
    severity: "Moderate",
    situation: "Field verification of civilian debris-flow report completed. Area now stable.",
    progressPct: 100,
    obstacle: null,
    nextRequirement: "None — stand down, monitoring only",
    linkedIncidentId: "OP-2026-0143",
  },
  {
    id: "FLD-005",
    team: "SDRF Bihar",
    place: "Kholapani, Darbhanga, Bihar",
    coordinates: [26.1542, 85.8918],
    time: "3 hr ago",
    severity: "High",
    situation: "Sandbagging in progress at the embankment breach point. Water level under watch.",
    progressPct: 55,
    obstacle: "Relief material stock running low",
    nextRequirement: "Relief material resupply within 24 hours",
    linkedIncidentId: "OP-2026-0142",
  },
  {
    id: "FLD-006",
    team: "NDRF Team AS-02",
    place: "Haflong, Dima Hasao, Assam",
    coordinates: [25.1667, 93.0167],
    time: "4 hr ago",
    severity: "Moderate",
    situation: "Structural assessment of buildings affected by heavy rainfall in progress.",
    progressPct: 45,
    obstacle: "Awaiting structural engineer",
    nextRequirement: "Structural engineer assessment",
    linkedIncidentId: "OP-2026-0144",
  },
];

export const fieldReportById = (id) =>
  fieldReports.find((item) => item.id === id) ?? null;
