import { TriangleAlert } from "lucide-react";

import { SeverityBadge } from "../common/Badges";

/** Critical safety alert card — hazard-type alerts requiring immediate attention. */
function CriticalAlertCard({ alert, selected, onSelect }) {
  return (
    <article
      className={`feed-card feed-card-critical ${selected ? "selected" : ""}`}
      onClick={() => onSelect?.(alert)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(alert);
        }
      }}
      tabIndex={0}
      role="button"
    >
      <header>
        <span className="feed-kind feed-kind-critical">
          <TriangleAlert size={12} aria-hidden="true" />
          Critical Alert
        </span>
        <span className="feed-time">{alert.time}</span>
      </header>

      <p className="feed-title">{alert.title}</p>
      <p className="feed-location">{alert.place}</p>

      <div className="feed-tags">
        <SeverityBadge level={alert.severity} />
        <span className="feed-alert-kind">{alert.kind}</span>
      </div>
    </article>
  );
}

export default CriticalAlertCard;
