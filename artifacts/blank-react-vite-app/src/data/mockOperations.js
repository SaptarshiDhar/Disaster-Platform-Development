/**
 * PROTOTYPE OPERATIONAL QUEUES — DEMO DATA ONLY.
 *
 * Critical alerts, standing resource requests and active operations shown in
 * the Incident Reports command view. Demonstration entries, not a live feed.
 */

export const criticalAlerts = [
  {
    id: "CA-001",
    title: "Severe landslide, NH-10 blocked",
    place: "Gangtok, Sikkim",
    time: "8 min ago",
    severity: "Critical",
    kind: "Unstable Slope",
    linkedIncidentId: null,
  },
  {
    id: "CA-002",
    title: "Flash flood warning — river overflow",
    place: "Dibrugarh, Assam",
    time: "22 min ago",
    severity: "Critical",
    kind: "Flash Flood",
    linkedIncidentId: null,
  },
  {
    id: "CA-003",
    title: "Cloudburst reported",
    place: "Kishtwar, Jammu & Kashmir",
    time: "28 min ago",
    severity: "High",
    kind: "Cloudburst",
    linkedIncidentId: null,
  },
  {
    id: "CA-004",
    title: "Cyclone wind alert, 120 kmph",
    place: "Chennai, Tamil Nadu",
    time: "35 min ago",
    severity: "High",
    kind: "Cyclone",
    linkedIncidentId: null,
  },
  {
    id: "CA-005",
    title: "Dam water level above danger mark",
    place: "Kadampanzi, Kerala",
    time: "40 min ago",
    severity: "High",
    kind: "Flood",
    linkedIncidentId: null,
  },
  {
    id: "CA-006",
    title: "Blocked evacuation route",
    place: "Kankarbagh, Patna, Bihar",
    time: "50 min ago",
    severity: "Critical",
    kind: "Blocked Evacuation Route",
    linkedIncidentId: "OP-2026-0147",
  },
];

export const RESOURCE_STATUS = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  ASSIGNED: "Assigned",
  EN_ROUTE: "En Route",
  DELIVERED: "Delivered",
  CLOSED: "Closed",
  UNAVAILABLE: "Unavailable",
};

export const resourceRequests = [
  {
    id: "RR-001",
    item: "2 Rescue Boats",
    place: "Joshimath, Uttarakhand",
    time: "12 min ago",
    urgency: "High",
    status: RESOURCE_STATUS.REQUESTED,
    linkedIncidentId: "OP-2026-0140",
  },
  {
    id: "RR-002",
    item: "Medical Team",
    place: "Joshimath, Uttarakhand",
    time: "18 min ago",
    urgency: "High",
    status: RESOURCE_STATUS.REQUESTED,
    linkedIncidentId: "OP-2026-0140",
  },
  {
    id: "RR-003",
    item: "Excavator",
    place: "Raigad, Maharashtra",
    time: "25 min ago",
    urgency: "Moderate",
    status: RESOURCE_STATUS.EN_ROUTE,
    linkedIncidentId: "OP-2026-0141",
  },
  {
    id: "RR-004",
    item: "Drones (Aerial Survey)",
    place: "Wayanad, Kerala",
    time: "32 min ago",
    urgency: "Moderate",
    status: RESOURCE_STATUS.ASSIGNED,
    linkedIncidentId: "OP-2026-0143",
  },
  {
    id: "RR-005",
    item: "Relief Material (Food & Water)",
    place: "North 24 Parganas, West Bengal",
    time: "45 min ago",
    urgency: "Low",
    status: RESOURCE_STATUS.APPROVED,
    linkedIncidentId: null,
  },
];

export const activeOperations = [
  {
    id: "OPS-001",
    type: "Flood Rescue Operation",
    place: "Patna, Bihar",
    teams: 12,
    status: "Active",
    linkedIncidentId: "OP-2026-0147",
  },
  {
    id: "OPS-002",
    type: "Landslide Clearance",
    place: "Rudraprayag, Uttarakhand",
    teams: 8,
    status: "Active",
    linkedIncidentId: null,
  },
  {
    id: "OPS-003",
    type: "Evacuation Operation",
    place: "Chennai, Tamil Nadu",
    teams: 10,
    status: "Active",
    linkedIncidentId: null,
  },
  {
    id: "OPS-004",
    type: "Cyclone Preparedness",
    place: "Puducherry",
    teams: 6,
    status: "Active",
    linkedIncidentId: null,
  },
  {
    id: "OPS-005",
    type: "Relief Distribution",
    place: "North 24 Parganas, West Bengal",
    teams: 9,
    status: "Active",
    linkedIncidentId: null,
  },
];
