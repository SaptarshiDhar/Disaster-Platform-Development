import { Info, TriangleAlert } from "lucide-react";

/**
 * Shared status and provenance badges.
 *
 * Accessibility rule applied throughout: severity is never communicated by
 * colour alone. Each badge renders its level as text, so the meaning survives
 * for colour-blind users and in greyscale print.
 */

const RISK_CLASS = {
  "Very High": "risk-very-high",
  High: "risk-high",
  Medium: "risk-moderate",
  Moderate: "risk-moderate",
  Low: "risk-low",
  "Very Low": "risk-very-low",
};

const PRIORITY_CLASS = {
  Immediate: "priority-immediate",
  "Short-Term": "priority-short",
  "Medium-Term": "priority-medium",
  Low: "priority-low",
};

const STATUS_CLASS = {
  Verified: "status-verified",
  "GIS Assessed": "status-gis",
  "Field Verification Required": "status-field",
  "Relocation Assessment Pending": "status-pending",
  "Candidate Site Identified": "status-site",
  "Not Reviewed": "status-none",
  Recommended: "status-verified",
  Alternative: "status-gis",
  "Not Suitable": "status-field",
  "Pending Assessment": "status-pending",
};

export function RiskBadge({ level }) {
  return (
    <span className={`rk-badge ${RISK_CLASS[level] ?? "risk-low"}`}>
      {level}
    </span>
  );
}

export function PriorityBadge({ level }) {
  return (
    <span className={`rk-badge ${PRIORITY_CLASS[level] ?? "priority-low"}`}>
      {level}
    </span>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`rk-badge ${STATUS_CLASS[status] ?? "status-none"}`}>
      {status}
    </span>
  );
}

/**
 * Marks a value or panel as prototype data. Required by the project data
 * policy anywhere invented figures are shown.
 */
export function DemoDataBadge({ label = "Demo Data", title }) {
  return (
    <span className="demo-badge" title={title ?? "Prototype data, not an official dataset"}>
      <TriangleAlert size={12} aria-hidden="true" />
      {label}
    </span>
  );
}

/** Small inline provenance line, e.g. "Prototype data — future WorldPop integration". */
export function ProvenanceNote({ children }) {
  return (
    <p className="provenance-note">
      <Info size={12} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Placeholder for panels that have no data yet. */
export function EmptyState({ icon: Icon = Info, title, message }) {
  return (
    <div className="empty-state" role="status">
      <Icon size={26} aria-hidden="true" />
      <strong>{title}</strong>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
