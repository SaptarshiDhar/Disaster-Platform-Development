/**
 * PROTOTYPE INCIDENT AND ALERT DATA — DEMO DATA ONLY.
 *
 * These are not live field reports and not official alerts. They exist to
 * demonstrate the reporting surface of the command centre.
 */

export const INCIDENT_SOURCE = {
  CITIZEN: "Citizen Report",
  FIELD: "NDRF Field Report",
};

export const incidentReports = [
  {
    id: "INC-001",
    place: "Langting",
    district: "Dima Hasao",
    state: "Assam",
    type: "Landslide",
    severity: "High",
    source: INCIDENT_SOURCE.FIELD,
    time: "10:35",
    coordinates: [25.5167, 93.1833],
  },
  {
    id: "INC-002",
    place: "Umrangso",
    district: "Dima Hasao",
    state: "Assam",
    type: "Road Blockage",
    severity: "Moderate",
    source: INCIDENT_SOURCE.CITIZEN,
    time: "09:15",
    coordinates: [25.55, 92.72],
  },
  {
    id: "INC-003",
    place: "Haflong",
    district: "Dima Hasao",
    state: "Assam",
    type: "Building Damage",
    severity: "High",
    source: INCIDENT_SOURCE.FIELD,
    time: "Yesterday",
    coordinates: [25.1667, 93.0167],
  },
  {
    id: "INC-004",
    place: "Silchar",
    district: "Cachar",
    state: "Assam",
    type: "Waterlogging",
    severity: "Moderate",
    source: INCIDENT_SOURCE.CITIZEN,
    time: "Yesterday",
    coordinates: [24.8333, 92.7789],
  },
  {
    id: "INC-005",
    place: "Bhyunder Gaon",
    district: "Chamoli",
    state: "Uttarakhand",
    type: "Slope Failure",
    severity: "Very High",
    source: INCIDENT_SOURCE.FIELD,
    time: "08:42",
    coordinates: [30.3856, 79.3197],
  },
  {
    id: "INC-006",
    place: "Mundakkai",
    district: "Wayanad",
    state: "Kerala",
    type: "Debris Flow",
    severity: "High",
    source: INCIDENT_SOURCE.CITIZEN,
    time: "Yesterday",
    coordinates: [11.4667, 76.1333],
  },
  {
    id: "INC-007",
    place: "Kholapani",
    district: "Darbhanga",
    state: "Bihar",
    type: "Embankment Breach",
    severity: "High",
    source: INCIDENT_SOURCE.FIELD,
    time: "2 days ago",
    coordinates: [26.1542, 85.8918],
  },
];

export const earlyWarningAlerts = [
  {
    id: "ALT-001",
    title: "Heavy rainfall advisory",
    area: "Chamoli, Uttarakhand",
    level: "Very High",
    issued: "Today 06:00",
    note: "Prototype advisory. Future source: IMD rainfall warnings.",
  },
  {
    id: "ALT-002",
    title: "River level rising",
    area: "Darbhanga, Bihar",
    level: "High",
    issued: "Today 05:30",
    note: "Prototype advisory. Future source: CWC river gauge feeds.",
  },
  {
    id: "ALT-003",
    title: "Slope instability watch",
    area: "Dima Hasao, Assam",
    level: "High",
    issued: "Yesterday 18:40",
    note: "Prototype advisory. Future source: GSI landslide bulletins.",
  },
  {
    id: "ALT-004",
    title: "Cyclone formation watch",
    area: "Kendrapara, Odisha",
    level: "Moderate",
    issued: "Yesterday 12:10",
    note: "Prototype advisory. Future source: IMD cyclone bulletins.",
  },
  {
    id: "ALT-005",
    title: "Snow accumulation advisory",
    area: "Kargil, Ladakh",
    level: "Moderate",
    issued: "2 days ago",
    note: "Prototype advisory.",
  },
  {
    id: "ALT-006",
    title: "Glacial lake monitoring",
    area: "Mangan, Sikkim",
    level: "High",
    issued: "2 days ago",
    note: "Prototype advisory.",
  },
];
