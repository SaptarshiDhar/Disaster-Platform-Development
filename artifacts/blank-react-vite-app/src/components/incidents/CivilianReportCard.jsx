import { ImageIcon, ThumbsDown, ThumbsUp, Users2 } from "lucide-react";

import { StatusBadge } from "../common/Badges";

/**
 * Civilian crowd-sourced report card.
 *
 * Deliberately different visual treatment from FieldSitrepCard (dashed left
 * accent, vote counters) so source is obvious at a glance. Community support
 * is labelled "Community Signal" — it is never presented as verification.
 */
function CivilianReportCard({ report, selected, onSelect }) {
  return (
    <article
      className={`feed-card feed-card-civilian ${selected ? "selected" : ""}`}
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
        <span className="feed-kind feed-kind-civilian">
          <Users2 size={12} aria-hidden="true" />
          Civilian Report
        </span>
        <span className="feed-time">{report.time}</span>
      </header>

      <p className="feed-title">{report.type}</p>
      <p className="feed-location">{report.place}</p>

      <p className="feed-body">{report.description}</p>

      <div className="feed-votes">
        <span className="vote-up">
          <ThumbsUp size={12} aria-hidden="true" />
          {report.upvotes}
        </span>
        <span className="vote-down">
          <ThumbsDown size={12} aria-hidden="true" />
          {report.downvotes}
        </span>
        <span className="vote-net">Community Signal +{report.netSupport}</span>
        {report.mediaCount > 0 ? (
          <span className="vote-media">
            <ImageIcon size={12} aria-hidden="true" />
            {report.mediaCount}
          </span>
        ) : null}
      </div>

      <StatusBadge status={report.verification} />
    </article>
  );
}

export default CivilianReportCard;
