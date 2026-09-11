import { Package } from "lucide-react";

import { StatusBadge } from "../common/Badges";

/** Standing resource request card (equipment, teams, supplies). */
function ResourceRequestCard({ request, selected, onSelect }) {
  return (
    <article
      className={`feed-card feed-card-resource ${selected ? "selected" : ""}`}
      onClick={() => onSelect?.(request)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(request);
        }
      }}
      tabIndex={0}
      role="button"
    >
      <header>
        <span className="feed-kind feed-kind-resource">
          <Package size={12} aria-hidden="true" />
          Resource Request
        </span>
        <span className="feed-time">{request.time}</span>
      </header>

      <p className="feed-title">{request.item}</p>
      <p className="feed-location">{request.place}</p>

      <div className="feed-tags">
        <span className={`urgency-tag urgency-${request.urgency.toLowerCase()}`}>
          {request.urgency}
        </span>
        <StatusBadge status={request.status} />
      </div>
    </article>
  );
}

export default ResourceRequestCard;
