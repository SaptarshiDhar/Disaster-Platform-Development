/**
 * PROTOTYPE CIVILIAN REPORTS — DEMO DATA ONLY.
 *
 * Crowd-sourced reports. Community support (votes) is a signal for sorting
 * and attention, never a substitute for verification — see VERIFICATION
 * below. A report with few votes but flagged Critical must still surface.
 */

export const CIVILIAN_REPORT_TYPE = {
  FLOOD: "Flooding",
  LANDSLIDE: "Landslide / Slope Movement",
  ROAD: "Road / Access",
  STRUCTURE: "Structural Damage",
  UTILITY: "Utility Hazard",
  OTHER: "Other",
};

export const VERIFICATION = {
  UNVERIFIED: "Unverified",
  CORROBORATED: "Corroborated",
  FIELD_REQUESTED: "Field Verification Requested",
  FIELD_VERIFIED: "Field Verified",
  DUPLICATE: "Duplicate",
  DISMISSED: "Dismissed",
};

const withSupport = (report) => ({
  ...report,
  netSupport: report.upvotes - report.downvotes,
});

export const civilianReports = [
  withSupport({
    id: "CIV-001",
    type: CIVILIAN_REPORT_TYPE.FLOOD,
    place: "Near BTM Layout, Bengaluru, Karnataka",
    coordinates: [12.9166, 77.61],
    time: "12 min ago",
    description:
      "Heavy waterlogging on the outer ring road. Many vehicles stranded.",
    mediaCount: 3,
    upvotes: 184,
    downvotes: 12,
    verification: VERIFICATION.UNVERIFIED,
    linkedIncidentId: null,
  }),
  withSupport({
    id: "CIV-002",
    type: CIVILIAN_REPORT_TYPE.FLOOD,
    place: "Near Alappuzha, Kerala",
    coordinates: [9.4981, 76.3388],
    time: "22 min ago",
    description: "Water level rising in a residential area. Elderly residents need assistance.",
    mediaCount: 2,
    upvotes: 96,
    downvotes: 8,
    verification: VERIFICATION.CORROBORATED,
    linkedIncidentId: null,
  }),
  withSupport({
    id: "CIV-003",
    type: CIVILIAN_REPORT_TYPE.LANDSLIDE,
    place: "Bhyunder Gaon outskirts, Chamoli, Uttarakhand",
    coordinates: [30.39, 79.33],
    time: "1 hr ago",
    description: "Cracks appearing on the slope above the settlement, small stones falling.",
    mediaCount: 1,
    upvotes: 34,
    downvotes: 2,
    verification: VERIFICATION.FIELD_VERIFIED,
    linkedIncidentId: "OP-2026-0140",
  }),
  withSupport({
    id: "CIV-004",
    type: CIVILIAN_REPORT_TYPE.FLOOD,
    place: "Near Kholapani, Darbhanga, Bihar",
    coordinates: [26.16, 85.89],
    time: "3 hr ago",
    description: "Embankment appears to be leaking near the village boundary.",
    mediaCount: 4,
    upvotes: 61,
    downvotes: 5,
    verification: VERIFICATION.FIELD_VERIFIED,
    linkedIncidentId: "OP-2026-0142",
  }),
  withSupport({
    id: "CIV-005",
    type: CIVILIAN_REPORT_TYPE.STRUCTURE,
    place: "Haflong Ward 2, Dima Hasao, Assam",
    coordinates: [25.17, 93.02],
    time: "Yesterday",
    description: "Visible cracks on the outer wall of a two-storey building after the rain.",
    mediaCount: 2,
    upvotes: 18,
    downvotes: 1,
    verification: VERIFICATION.FIELD_REQUESTED,
    linkedIncidentId: "OP-2026-0144",
  }),
  withSupport({
    id: "CIV-006",
    type: CIVILIAN_REPORT_TYPE.LANDSLIDE,
    place: "Near Mundakkai, Wayanad, Kerala",
    coordinates: [11.47, 76.13],
    time: "Yesterday",
    description: "Debris and mud flow observed near the residential cluster after heavy rain.",
    mediaCount: 5,
    upvotes: 142,
    downvotes: 6,
    verification: VERIFICATION.FIELD_VERIFIED,
    linkedIncidentId: "OP-2026-0143",
  }),
  withSupport({
    id: "CIV-007",
    type: CIVILIAN_REPORT_TYPE.ROAD,
    place: "Guwahati—Shillong Road, Meghalaya",
    coordinates: [25.7, 91.95],
    time: "2 hr ago",
    description: "Landslip has partially blocked one carriageway near the state border.",
    mediaCount: 1,
    upvotes: 27,
    downvotes: 3,
    verification: VERIFICATION.UNVERIFIED,
    linkedIncidentId: null,
  }),
  withSupport({
    id: "CIV-008",
    type: CIVILIAN_REPORT_TYPE.UTILITY,
    place: "Silchar, Cachar, Assam",
    coordinates: [24.83, 92.78],
    time: "5 hr ago",
    description: "Downed power line near a waterlogged street, reported as sparking earlier.",
    mediaCount: 1,
    upvotes: 9,
    downvotes: 0,
    verification: VERIFICATION.DISMISSED,
    linkedIncidentId: null,
  }),
  withSupport({
    id: "CIV-009",
    type: CIVILIAN_REPORT_TYPE.FLOOD,
    place: "Kankarbagh, Patna, Bihar",
    coordinates: [25.615, 85.147],
    time: "40 min ago",
    description: "Same flooding area as earlier reports, water still rising near the market.",
    mediaCount: 2,
    upvotes: 15,
    downvotes: 1,
    verification: VERIFICATION.DUPLICATE,
    linkedIncidentId: "OP-2026-0147",
  }),
];

export const civilianReportById = (id) =>
  civilianReports.find((item) => item.id === id) ?? null;
