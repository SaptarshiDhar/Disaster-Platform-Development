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

  // Candidate site verification
  "Field Visit Required": "status-field",
  "Partially Verified": "status-gis",
  Pending: "status-pending",
  "Not Visited": "status-none",

  // Civilian report verification
  Unverified: "status-none",
  Corroborated: "status-gis",
  "Field Verification Requested": "status-field",
  "Field Verified": "status-verified",
  Duplicate: "status-pending",
  Dismissed: "status-none",

  // Resource request status
  Requested: "status-pending",
  Approved: "status-gis",
  Assigned: "status-gis",
  "En Route": "status-field",
  Delivered: "status-verified",
  Closed: "status-none",
  Unavailable: "status-field",

  // Incident status
  Active: "status-field",
  Contained: "status-gis",

  // Site suitability tiers
  "High Suitability": "status-verified",
  Suitable: "status-verified",
  "Needs Assessment": "status-pending",
  "Limited Suitability": "status-field",
  "Rejected / Unsuitable": "status-none",
};

const SEVERITY_CLASS = {
  Critical: "risk-very-high",
  "Very High": "risk-very-high",
  High: "risk-high",
  Moderate: "risk-moderate",
  Low: "risk-low",
};

const TIER_CLASS = {
  high: "tier-high",
  suitable: "tier-suitable",
  "needs-assessment": "tier-needs-assessment",
  limited: "tier-limited",
  rejected: "tier-rejected",
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

/** Incident/report severity — Critical maps onto the same visual weight as Very High. */
export function SeverityBadge({ level }) {
  return (
    <span className={`rk-badge ${SEVERITY_CLASS[level] ?? "risk-low"}`}>
      {level}
    </span>
  );
}

/** Candidate site suitability tier (high / suitable / needs-assessment / limited / rejected). */
export function TierBadge({ tier, label }) {
  return (
    <span className={`rk-badge ${TIER_CLASS[tier] ?? "tier-needs-assessment"}`}>
      {label}
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
