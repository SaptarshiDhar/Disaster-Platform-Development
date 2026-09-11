import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  MapPin,
  ShieldAlert,
  X,
} from "lucide-react";

import { EmptyState, SeverityBadge, StatusBadge } from "../common/Badges";

const TABS = ["Summary", "Timeline", "Casualties", "Resources", "Verification"];

/**
 * Detail panel for the currently selected incident.
 *
 * `incident` is the enriched record returned by
 * incidentReportService.getIncidentDetail — it carries casualties, a
 * timeline, resource requests and a verification summary alongside the base
 * fields.
 */
function IncidentDetailPanel({ incident, onClose, onAcknowledge, onRequestSupport, acknowledged }) {
  const [tab, setTab] = useState("Summary");

  if (!incident) {
    return (
      <aside className="habitation-panel">
        <EmptyState
          icon={MapPin}
          title="No incident selected"
          message="Select a marker on the map or a report from the feed to view its detail."
        />
      </aside>
    );
  }

  return (
    <aside className="habitation-panel" aria-label="Selected incident">
      <div className="habitation-panel-heading">
        <span>SELECTED INCIDENT</span>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Clear selection">
            <X size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="habitation-title-row">
        <h3>{incident.id}</h3>
        <SeverityBadge level={incident.severity} />
      </div>

      <p className="panel-value" style={{ padding: "0 12px" }}>
        {incident.headline}
      </p>

      <p className="habitation-location">
        <MapPin size={13} aria-hidden="true" />
        {incident.place}, {incident.district}, {incident.state}
      </p>

      <div className="incident-meta-row">
        <StatusBadge status={incident.status} />
        <span className="incident-meta-item">{incident.source}</span>
        <span className="incident-meta-item">{incident.reportedAgo}</span>
        <StatusBadge status={incident.verification} />
      </div>

      <div className="habitation-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="habitation-panel-body" role="tabpanel">
        {tab === "Summary" ? (
          <>
            <div className="metric-grid">
              <div>
                <span>Operation ID</span>
                <strong>{incident.id}</strong>
              </div>
              <div>
                <span>Open Requests</span>
                <strong>{incident.openRequestsCount}</strong>
              </div>
            </div>

            <section className="panel-section">
              <h4>Assigned Teams</h4>
              <ul className="reason-list">
                {incident.assignedTeams.map((team) => (
                  <li key={team}>{team}</li>
                ))}
              </ul>
            </section>

            <section className="panel-section">
              <h4>Latest Update ({incident.latestUpdateAgo})</h4>
              <p className="panel-value" style={{ fontWeight: 400, fontSize: 12 }}>
                {incident.latestUpdate}
              </p>
            </section>

            {incident.commanderAttention ? (
              <section className="panel-section">
                <h4>
                  <ShieldAlert size={13} aria-hidden="true" />
                  Commander Attention
                </h4>
                <p className="panel-value" style={{ fontWeight: 400, fontSize: 12, color: "#fdba74" }}>
                  {incident.commanderAttention}
                </p>
              </section>
            ) : null}
          </>
        ) : null}

        {tab === "Timeline" ? (
          <section className="panel-section">
            <h4>Operational Timeline</h4>
            <ol className="timeline-list">
              {incident.timeline.map((event, index) => (
                <li key={`${event.time}-${index}`}>
                  <span className="timeline-time">{event.time}</span>
                  <span className="timeline-event">{event.event}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {tab === "Casualties" ? (
          <section className="panel-section">
            <h4>Persons Located</h4>
            <div className="metric-grid">
              <div>
                <span>Rescued</span>
                <strong>{incident.casualties.rescued}</strong>
              </div>
              <div>
                <span>Evacuated</span>
                <strong>{incident.casualties.evacuated}</strong>
              </div>
              <div>
                <span>Injured</span>
                <strong>{incident.casualties.injured}</strong>
              </div>
              <div>
                <span>Medical Transport</span>
                <strong>{incident.casualties.medicalTransport}</strong>
              </div>
              <div>
                <span>Fatalities Reported</span>
                <strong>{incident.casualties.fatalities}</strong>
              </div>
              <div>
                <span>Missing</span>
                <strong>{incident.casualties.missing}</strong>
              </div>
            </div>
            <p className="panel-footnote">
              Last Updated: {incident.latestUpdateAgo} · Reported By: {incident.reportedBy}
            </p>
          </section>
        ) : null}

        {tab === "Resources" ? (
          <section className="panel-section">
            <h4>Requested Resources</h4>
            {incident.resources?.length ? (
              <ul className="resource-mini-list">
                {incident.resources.map((r) => (
                  <li key={r.item}>
                    <div>
                      <strong>
                        {r.quantity > 1 ? `${r.quantity} × ` : ""}
                        {r.item}
                      </strong>
                      <span>{r.requestingTeam}</span>
                    </div>
                    <div className="resource-mini-meta">
                      <span className={`urgency-tag urgency-${r.urgency.toLowerCase()}`}>
                        {r.urgency}
                      </span>
                      <StatusBadge status={r.status} />
                      {r.etaMin ? <span>ETA {r.etaMin} min</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-value">No open resource requests for this incident.</p>
            )}
          </section>
        ) : null}

        {tab === "Verification" ? (
          <section className="panel-section">
            <h4>Community Signal</h4>
            <p className="panel-value">
              +{incident.verificationDetail.communitySignal}
            </p>

            <div className="metric-grid">
              <div>
                <span>Independent Reports</span>
                <strong>{incident.verificationDetail.independentReportCount}</strong>
              </div>
              <div>
                <span>Media Available</span>
                <strong>{incident.verificationDetail.mediaAvailable}</strong>
              </div>
            </div>

            <h4>Field Confirmation</h4>
            <p className="panel-value">
              {incident.verificationDetail.fieldConfirmed ? "Confirmed by field team" : "Not yet confirmed"}
            </p>

            {incident.relatedCivilian.length > 0 ? (
              <>
                <h4>Related Civilian Reports</h4>
                <ul className="reason-list">
                  {incident.relatedCivilian.map((r) => (
                    <li key={r.id}>
                      {r.description} — <em>{r.verification}</em>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="panel-footnote">
              Community signal is a sorting and attention cue only. It is not a
              trust score and does not by itself confirm an incident.
            </p>
          </section>
        ) : null}
      </div>

      <div className="panel-actions">
        <button type="button">
          <FileText size={14} aria-hidden="true" />
          Open Full Incident
        </button>
        <button
          type="button"
          onClick={() => onAcknowledge?.(incident)}
          disabled={acknowledged}
        >
          <CheckCircle2 size={14} aria-hidden="true" />
          {acknowledged ? "Acknowledged" : "Acknowledge"}
        </button>
        <button
          type="button"
          className="panel-primary-action"
          onClick={() => onRequestSupport?.(incident)}
        >
          Request Support
        </button>
      </div>
    </aside>
  );
}

export default IncidentDetailPanel;
