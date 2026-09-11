import {
  Ban,
  Copy,
  Link2,
  MapPin,
  PlusCircle,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

import { StatusBadge } from "../common/Badges";

/**
 * Detail view for a selected civilian report.
 *
 * Kept separate from IncidentDetailPanel: civilian reports carry their own
 * action set (verification and triage actions) rather than the official
 * incident actions, and votes are shown as a labelled community signal, never
 * as an accuracy score.
 */
function CivilianReportDetail({
  report,
  onClose,
  onRequestVerification,
  onLinkIncident,
  onCreateIncident,
  onMarkDuplicate,
  onDismiss,
}) {
  return (
    <aside className="habitation-panel" aria-label="Selected civilian report">
      <div className="habitation-panel-heading">
        <span>CIVILIAN REPORT</span>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Clear selection">
            <X size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="habitation-title-row">
        <h3>{report.type}</h3>
        <StatusBadge status={report.verification} />
      </div>

      <p className="habitation-location">
        <MapPin size={13} aria-hidden="true" />
        {report.place}
      </p>

      <div className="habitation-panel-body">
        <section className="panel-section" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
          <p className="panel-value" style={{ fontWeight: 400, fontSize: 12.5 }}>
            {report.description}
          </p>

          <div className="feed-votes" style={{ marginTop: 10 }}>
            <span className="vote-up">
              <ThumbsUp size={13} aria-hidden="true" />
              {report.upvotes}
            </span>
            <span className="vote-down">
              <ThumbsDown size={13} aria-hidden="true" />
              {report.downvotes}
            </span>
            <span className="vote-net">Community Signal +{report.netSupport}</span>
          </div>

          <p className="panel-footnote">
            Reported {report.time} · {report.mediaCount} media attachment
            {report.mediaCount === 1 ? "" : "s"}
          </p>

          {report.linkedIncidentId ? (
            <p className="panel-footnote">
              Linked to incident <strong>{report.linkedIncidentId}</strong>
            </p>
          ) : (
            <p className="panel-footnote">Not yet linked to a tracked incident.</p>
          )}
        </section>
      </div>

      <div className="panel-actions">
        <button type="button" onClick={() => onRequestVerification?.(report)}>
          Request Field Verification
        </button>
        <button type="button" onClick={() => onLinkIncident?.(report)}>
          <Link2 size={14} aria-hidden="true" />
          Link to Existing Incident
        </button>
        <button type="button" onClick={() => onCreateIncident?.(report)}>
          <PlusCircle size={14} aria-hidden="true" />
          Create Incident
        </button>
        <button type="button" onClick={() => onMarkDuplicate?.(report)}>
          <Copy size={14} aria-hidden="true" />
          Mark Duplicate
        </button>
        <button type="button" onClick={() => onDismiss?.(report)}>
          <Ban size={14} aria-hidden="true" />
          Dismiss Report
        </button>
      </div>
    </aside>
  );
}

export default CivilianReportDetail;
