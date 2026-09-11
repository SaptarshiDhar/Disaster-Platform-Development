/**
 * Incident Reports data access.
 *
 * Combines official field SITREPs, civilian crowd-sourced reports, critical
 * alerts and resource requests into one feed and one detail view. Future
 * endpoints: /api/incidents, /api/incidents/:id. Replace these bodies with
 * fetch calls when the backend lands; the page layer does not change.
 */

import { fieldReports, fieldReportById } from "../data/mockFieldReports";
import {
  VERIFICATION,
  civilianReportById,
  civilianReports,
} from "../data/mockCivilianReports";
import {
  INCIDENT_STATUS,
  incidentRecordById,
  incidentRecords,
} from "../data/mockIncidents";
import {
  activeOperations,
  criticalAlerts,
  resourceRequests,
} from "../data/mockOperations";

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 120));

export const FEED_CATEGORY = {
  ALL: "all",
  FIELD: "field",
  CIVILIAN: "civilian",
  CRITICAL: "critical",
  RESOURCE: "resource",
};

const OPEN_RESOURCE_STATUSES = new Set([
  "Requested",
  "Approved",
  "Assigned",
  "En Route",
]);

/**
 * Loose "N min/hr/day ago" parser so the unified feed can sort chronologically
 * even though each source file stores a human-readable string. Falls back to
 * a large value (i.e. "old") for anything unrecognised, which is safer than
 * crashing the sort.
 */
function minutesAgo(text) {
  if (!text) return 99999;
  const t = text.toLowerCase();
  if (t.includes("min ago")) return parseInt(t, 10) || 0;
  if (t.includes("hr ago")) return (parseInt(t, 10) || 0) * 60;
  if (t.includes("yesterday")) return 1440;
  if (t.includes("days ago")) return (parseInt(t, 10) || 1) * 1440;
  return 99999;
}

function toFeedItem(kind, record) {
  return {
    feedId: `${kind}-${record.id}`,
    kind,
    time: record.time,
    minutesAgo: minutesAgo(record.time),
    record,
  };
}

const VERIFICATION_ORDER = [
  VERIFICATION.FIELD_VERIFIED,
  VERIFICATION.CORROBORATED,
  VERIFICATION.FIELD_REQUESTED,
  VERIFICATION.UNVERIFIED,
  VERIFICATION.DUPLICATE,
  VERIFICATION.DISMISSED,
];

/**
 * Unified feed across all four report kinds.
 *
 * Default order is chronological. When the category is narrowed to civilian
 * reports, `sort` additionally accepts "support" (default — highest community
 * signal first, per the module's default civilian sort), "recent" or
 * "verification".
 */
export function listFeed({ category = FEED_CATEGORY.ALL, sort } = {}) {
  const items = [
    ...fieldReports.map((r) => toFeedItem(FEED_CATEGORY.FIELD, r)),
    ...civilianReports.map((r) => toFeedItem(FEED_CATEGORY.CIVILIAN, r)),
    ...criticalAlerts.map((r) => toFeedItem(FEED_CATEGORY.CRITICAL, r)),
    ...resourceRequests.map((r) => toFeedItem(FEED_CATEGORY.RESOURCE, r)),
  ];

  const filtered =
    category === FEED_CATEGORY.ALL
      ? items
      : items.filter((item) => item.kind === category);

  if (category === FEED_CATEGORY.CIVILIAN && sort === "recent") {
    filtered.sort((a, b) => a.minutesAgo - b.minutesAgo);
  } else if (category === FEED_CATEGORY.CIVILIAN && sort === "verification") {
    filtered.sort(
      (a, b) =>
        VERIFICATION_ORDER.indexOf(a.record.verification) -
        VERIFICATION_ORDER.indexOf(b.record.verification),
    );
  } else if (category === FEED_CATEGORY.CIVILIAN) {
    // Default civilian order: highest community support first. A Critical
    // alert-linked report can still be pinned by severity upstream — support
    // is a sort key here, not a filter, so low-vote reports are never hidden.
    filtered.sort((a, b) => b.record.netSupport - a.record.netSupport);
  } else {
    filtered.sort((a, b) => a.minutesAgo - b.minutesAgo);
  }

  return settle(filtered);
}

/**
 * Civilian reports only, with the sort orders the module requires. Community
 * support drives the default order but never hides a Critical report with few
 * votes — callers that need that guarantee should also check severity.
 */
export function listCivilianReports({ sort = "support" } = {}) {
  const rows = [...civilianReports];

  if (sort === "recent") {
    rows.sort((a, b) => minutesAgo(a.time) - minutesAgo(b.time));
  } else if (sort === "verification") {
    const order = [
      VERIFICATION.FIELD_VERIFIED,
      VERIFICATION.CORROBORATED,
      VERIFICATION.FIELD_REQUESTED,
      VERIFICATION.UNVERIFIED,
      VERIFICATION.DUPLICATE,
      VERIFICATION.DISMISSED,
    ];
    rows.sort((a, b) => order.indexOf(a.verification) - order.indexOf(b.verification));
  } else {
    rows.sort((a, b) => b.netSupport - a.netSupport);
  }

  return settle(rows);
}

/** KPI roll-up, derived from the underlying datasets. */
export function getIncidentSummary() {
  const activeCount = incidentRecords.filter(
    (item) => item.status === INCIDENT_STATUS.ACTIVE,
  ).length;

  const rescueEvacuationUpdates = incidentRecords.reduce((sum, item) => {
    const matches = item.timeline.filter((event) =>
      /rescue|evacuat/i.test(event.event),
    ).length;
    return sum + matches;
  }, 0);

  return settle({
    activeIncidents: activeCount,
    criticalGroundAlerts: criticalAlerts.length,
    fieldSitreps: fieldReports.length,
    civilianReportsCount: civilianReports.length,
    openResourceRequests: resourceRequests.filter((item) =>
      OPEN_RESOURCE_STATUSES.has(item.status),
    ).length,
    rescueEvacuationUpdates,
  });
}

/**
 * Full detail for one incident, including everything the right-hand panel
 * needs across all five tabs.
 */
export function getIncidentDetail(id) {
  const record = incidentRecordById(id);

  if (!record) return settle(null);

  const relatedCivilian = (record.relatedCivilianReportIds ?? [])
    .map(civilianReportById)
    .filter(Boolean);

  const relatedField = (record.relatedFieldReportIds ?? [])
    .map(fieldReportById)
    .filter(Boolean);

  const communitySignal = relatedCivilian.reduce(
    (sum, r) => sum + r.netSupport,
    0,
  );

  const mediaAvailable = relatedCivilian.reduce(
    (sum, r) => sum + r.mediaCount,
    0,
  );

  const fieldConfirmed = relatedCivilian.some(
    (r) => r.verification === VERIFICATION.FIELD_VERIFIED,
  );

  return settle({
    ...record,
    relatedCivilian,
    relatedField,
    verificationDetail: {
      communitySignal,
      independentReportCount: relatedCivilian.length,
      mediaAvailable,
      fieldConfirmed,
    },
  });
}

export function getActiveOperations() {
  return settle([...activeOperations]);
}

export function getCriticalAlertsQueue() {
  return settle([...criticalAlerts]);
}

export function getResourceRequestsQueue() {
  return settle([...resourceRequests]);
}

export function getCivilianVerificationQueue() {
  return settle([...civilianReports].sort((a, b) => b.netSupport - a.netSupport));
}
