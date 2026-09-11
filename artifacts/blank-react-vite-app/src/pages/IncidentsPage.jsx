import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  MapPinned,
  MessageSquare,
  PackageSearch,
  Radio,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import RakshaMap from "../components/gis/RakshaMap";
import MapLegend from "../components/gis/MapLegend";
import { DemoDataBadge, StatusBadge } from "../components/common/Badges";
import FieldSitrepCard from "../components/incidents/FieldSitrepCard";
import CivilianReportCard from "../components/incidents/CivilianReportCard";
import CriticalAlertCard from "../components/incidents/CriticalAlertCard";
import ResourceRequestCard from "../components/incidents/ResourceRequestCard";
import IncidentDetailPanel from "../components/incidents/IncidentDetailPanel";
import CivilianReportDetail from "../components/incidents/CivilianReportDetail";

import {
  FEED_CATEGORY,
  getActiveOperations,
  getCivilianVerificationQueue,
  getCriticalAlertsQueue,
  getIncidentDetail,
  getIncidentSummary,
  getResourceRequestsQueue,
  listFeed,
} from "../services/incidentReportService";

const CATEGORY_TABS = [
  { id: FEED_CATEGORY.ALL, label: "All Incidents", icon: Activity },
  { id: FEED_CATEGORY.FIELD, label: "Field Operations", icon: Radio },
  { id: FEED_CATEGORY.CIVILIAN, label: "Civilian Reports", icon: MessageSquare },
  { id: FEED_CATEGORY.CRITICAL, label: "Critical Alerts", icon: AlertTriangle },
  { id: FEED_CATEGORY.RESOURCE, label: "Resource Requests", icon: PackageSearch },
];

const MARKER_LEGEND = [
  { label: "Field Team Report", colour: "#63dda2" },
  { label: "Civilian Report", colour: "#38bdf8" },
  { label: "Critical Alert", colour: "#ef4444" },
  { label: "Resource Request", colour: "#f97316" },
];

/** Builds a map marker from a unified feed item, whatever its kind. */
function toMarker(item) {
  const r = item.record;
  const coordinates = r.coordinates;
  if (!coordinates) return null;

  const title =
    item.kind === "field"
      ? r.team
      : item.kind === "civilian"
        ? r.type
        : item.kind === "critical"
          ? r.title
          : r.item;

  const subtitle = r.place ?? "";

  return { feedId: item.feedId, kind: item.kind, coordinates, title, subtitle };
}

/**
 * Incident Reports.
 *
 * Unifies official field SITREPs and civilian crowd-sourced reports into one
 * feed, clearly distinguishing source and verification level throughout.
 */
function IncidentsPage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState(FEED_CATEGORY.ALL);
  const [civilianSort, setCivilianSort] = useState("support");
  const [feed, setFeed] = useState([]);
  const [summary, setSummary] = useState(null);
  const [alertsQueue, setAlertsQueue] = useState([]);
  const [resourceQueue, setResourceQueue] = useState([]);
  const [civilianQueue, setCivilianQueue] = useState([]);
  const [operations, setOperations] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [incidentDetail, setIncidentDetail] = useState(null);
  const [acknowledged, setAcknowledged] = useState(() => new Set());
  const [notice, setNotice] = useState("");

  const loadFeed = useCallback(() => {
    listFeed({ category, sort: civilianSort }).then(setFeed);
  }, [category, civilianSort]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    let active = true;

    Promise.all([
      getIncidentSummary(),
      getCriticalAlertsQueue(),
      getResourceRequestsQueue(),
      getCivilianVerificationQueue(),
      getActiveOperations(),
    ]).then(([s, alerts, resources, civilian, ops]) => {
      if (!active) return;
      setSummary(s);
      setAlertsQueue(alerts);
      setResourceQueue(resources);
      setCivilianQueue(civilian);
      setOperations(ops);
    });

    return () => {
      active = false;
    };
  }, []);

  // Resolve the full incident record whenever a non-civilian feed item with a
  // linked incident is selected.
  useEffect(() => {
    if (!selectedItem || selectedItem.kind === "civilian") {
      setIncidentDetail(null);
      return;
    }

    const linkedId = selectedItem.record.linkedIncidentId;

    if (!linkedId) {
      setIncidentDetail(null);
      return;
    }

    let active = true;
    getIncidentDetail(linkedId).then((detail) => {
      if (active) setIncidentDetail(detail);
    });

    return () => {
      active = false;
    };
  }, [selectedItem]);

  const markers = useMemo(
    () => feed.map(toMarker).filter(Boolean),
    [feed],
  );

  const region = useMemo(() => {
    if (!selectedItem?.record.coordinates) {
      return { center: [22.9734, 78.6569], zoom: 5 };
    }
    return { center: selectedItem.record.coordinates, zoom: 8 };
  }, [selectedItem]);

  const handleSelect = (record, kind) => {
    setSelectedItem({ feedId: `${kind}-${record.id}`, kind, record });
  };

  const handleMarkerSelect = (marker) => {
    const item = feed.find((f) => f.feedId === marker.feedId);
    if (item) setSelectedItem(item);
  };

  const handleAcknowledge = (incident) => {
    setAcknowledged((prev) => new Set(prev).add(incident.id));
    setNotice(`${incident.id} acknowledged.`);
  };

  const handleRequestSupport = (incident) => {
    setNotice(`Support requested for ${incident.id} (prototype — no live dispatch).`);
  };

  const civilianAction = (label) => (report) =>
    setNotice(`${label}: ${report.id} (prototype — no backend change made).`);

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Incident Reports</h2>
          <p>
            Official field-team reporting combined with civilian crowd-sourced
            reports, clearly separated by source and verification level.
          </p>
        </div>
        <DemoDataBadge label="Mock Incident Feed" />
      </div>

      <section className="stat-grid stat-grid-6" aria-label="Incident indicators">
        <StatCard
          icon={Activity}
          label="ACTIVE INCIDENTS"
          value={summary ? summary.activeIncidents : "—"}
          subtitle="Prototype assessment"
          tone="red"
        />
        <StatCard
          icon={AlertTriangle}
          label="CRITICAL GROUND ALERTS"
          value={summary ? summary.criticalGroundAlerts : "—"}
          subtitle="Demo data"
          tone="red"
        />
        <StatCard
          icon={Radio}
          label="FIELD SITREPS"
          value={summary ? summary.fieldSitreps : "—"}
          subtitle="Official reports"
          tone="blue"
        />
        <StatCard
          icon={MessageSquare}
          label="CIVILIAN REPORTS"
          value={summary ? summary.civilianReportsCount : "—"}
          subtitle="Crowd-sourced"
          tone="blue"
        />
        <StatCard
          icon={PackageSearch}
          label="OPEN RESOURCE REQUESTS"
          value={summary ? summary.openResourceRequests : "—"}
          subtitle="Awaiting fulfilment"
          tone="orange"
        />
        <StatCard
          icon={Bell}
          label="RESCUE / EVACUATION UPDATES"
          value={summary ? summary.rescueEvacuationUpdates : "—"}
          subtitle="Demo data"
          tone="green"
        />
      </section>

      <div className="incident-tabs" role="tablist">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={category === tab.id}
              className={category === tab.id ? "active" : ""}
              onClick={() => setCategory(tab.id)}
            >
              <Icon size={15} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {notice ? (
        <p className="map-search-message" role="status">
          {notice}
        </p>
      ) : null}

      <section className="incidents-grid">
        <div className="incident-feed-panel">
          <div className="panel-head">
            <h3>
              Live Report Feed <small>({feed.length})</small>
            </h3>

            {category === FEED_CATEGORY.CIVILIAN ? (
              <select
                aria-label="Sort civilian reports"
                value={civilianSort}
                onChange={(event) => setCivilianSort(event.target.value)}
                className="feed-sort-select"
              >
                <option value="support">Most Reported</option>
                <option value="recent">Most Recent</option>
                <option value="verification">Verification Status</option>
              </select>
            ) : null}
          </div>

          <div className="incident-feed-scroll">
            {feed.length === 0 ? (
              <p className="table-empty">No reports match this filter.</p>
            ) : (
              feed.map((item) => {
                const isSelected = selectedItem?.feedId === item.feedId;

                if (item.kind === "field") {
                  return (
                    <FieldSitrepCard
                      key={item.feedId}
                      report={item.record}
                      selected={isSelected}
                      onSelect={(r) => handleSelect(r, "field")}
                    />
                  );
                }
                if (item.kind === "civilian") {
                  return (
                    <CivilianReportCard
                      key={item.feedId}
                      report={item.record}
                      selected={isSelected}
                      onSelect={(r) => handleSelect(r, "civilian")}
                    />
                  );
                }
                if (item.kind === "critical") {
                  return (
                    <CriticalAlertCard
                      key={item.feedId}
                      alert={item.record}
                      selected={isSelected}
                      onSelect={(r) => handleSelect(r, "critical")}
                    />
                  );
                }
                return (
                  <ResourceRequestCard
                    key={item.feedId}
                    request={item.record}
                    selected={isSelected}
                    onSelect={(r) => handleSelect(r, "resource")}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="incident-map">
          <div className="panel-head">
            <h3>Operation Map — India</h3>
          </div>

          <div className="map-stage map-stage-tall">
            <RakshaMap
              region={region}
              hazardMode="landslide"
              layers={{ hazard: false }}
              feedMarkers={markers}
              selectedFeedId={selectedItem?.feedId}
              onSelectFeedItem={handleMarkerSelect}
            />

            <MapLegend
              title="Incident Markers"
              items={MARKER_LEGEND}
              note="Demo / prototype feed. Not a live operational picture."
            />
          </div>
        </div>

        {selectedItem?.kind === "civilian" ? (
          <CivilianReportDetail
            report={selectedItem.record}
            onClose={() => setSelectedItem(null)}
            onRequestVerification={civilianAction("Field verification requested")}
            onLinkIncident={civilianAction("Link to existing incident")}
            onCreateIncident={civilianAction("Incident created")}
            onMarkDuplicate={civilianAction("Marked as duplicate")}
            onDismiss={civilianAction("Report dismissed")}
          />
        ) : (
          <IncidentDetailPanel
            incident={incidentDetail}
            onClose={() => setSelectedItem(null)}
            onAcknowledge={handleAcknowledge}
            onRequestSupport={handleRequestSupport}
            acknowledged={incidentDetail ? acknowledged.has(incidentDetail.id) : false}
          />
        )}
      </section>

      <section className="analytics-grid analytics-grid-4">
        <article className="analytics-card">
          <header>
            <h3>
              Critical Alerts Queue <small>({alertsQueue.length})</small>
            </h3>
            <button type="button" className="view-all-link">View All</button>
          </header>
          <ul className="queue-list">
            {alertsQueue.map((alert) => (
              <li key={alert.id}>
                <span className={`queue-dot sev-${alert.severity.toLowerCase()}`} aria-hidden="true" />
                <div>
                  <strong>{alert.title}</strong>
                  <span>{alert.place} · {alert.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>
              Open Resource Requests <small>({resourceQueue.length})</small>
            </h3>
            <button type="button" className="view-all-link">View All</button>
          </header>
          <ul className="queue-list">
            {resourceQueue.map((r) => (
              <li key={r.id}>
                <span className={`urgency-tag urgency-${r.urgency.toLowerCase()}`}>
                  {r.urgency}
                </span>
                <div>
                  <strong>{r.item}</strong>
                  <span>{r.place} · {r.time}</span>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>
              Civilian Verification Queue <small>({civilianQueue.length})</small>
            </h3>
            <button type="button" className="view-all-link">View All</button>
          </header>
          <ul className="queue-list">
            {civilianQueue.slice(0, 6).map((r) => (
              <li key={r.id}>
                <span className="vote-net-compact">+{r.netSupport}</span>
                <div>
                  <strong>{r.type}</strong>
                  <span>{r.place}</span>
                </div>
                <StatusBadge status={r.verification} />
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>
              Active Operations <small>({operations.length})</small>
            </h3>
            <button type="button" className="view-all-link">View All</button>
          </header>
          <ul className="queue-list">
            {operations.map((op) => (
              <li key={op.id}>
                <MapPinned size={13} aria-hidden="true" />
                <div>
                  <strong>{op.type}</strong>
                  <span>{op.place} · {op.teams} teams</span>
                </div>
                <span className="ops-status">{op.status}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}

export default IncidentsPage;
