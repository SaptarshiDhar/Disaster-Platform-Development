import { Mail } from "lucide-react";

import { SeverityBadge } from "../common/Badges";

/**
 * Official field-team situation report card.
 *
 * Visually distinct from a civilian report (solid left accent, no vote UI) so
 * the two sources never look interchangeable.
 */
function FieldSitrepCard({ report, selected, onSelect }) {
  return (
    <article
      className={`feed-card feed-card-field ${selected ? "selected" : ""}`}
      onClick={() => onSelect?.(report)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(report);
        }
      }}
      tabIndex={0}
      role="button"
    >
      <header>
        <span className="feed-kind">
          <Mail size={12} aria-hidden="true" />
          Field SITREP
        </span>
        <span className="feed-time">{report.time}</span>
      </header>

      <p className="feed-title">{report.team}</p>
      <p className="feed-location">{report.place}</p>

      <SeverityBadge level={report.severity} />

      <p className="feed-body">{report.situation}</p>

      <div className="feed-progress">
        <div className="feed-progress-track">
          <div
            className="feed-progress-fill"
            style={{ width: `${report.progressPct}%` }}
          />
        </div>
        <span>{report.progressPct}%</span>
      </div>

      {report.obstacle ? (
        <p className="feed-next">
          <strong>Next:</strong> {report.obstacle}
        </p>
      ) : null}
    </article>
  );
}

export default FieldSitrepCard;
