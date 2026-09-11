import { useState } from "react";
import {
  ClipboardCheck,
  FileText,
  MapPin,
  Plus,
  Route,
  X,
} from "lucide-react";

import {
  DemoDataBadge,
  EmptyState,
  PriorityBadge,
  RiskBadge,
  StatusBadge,
} from "../common/Badges";

const TABS = ["Overview", "Hazards", "Exposure", "Accessibility", "Relocation"];

const HAZARD_ROWS = [
  { key: "landslide", label: "Landslide Risk" },
  { key: "flood", label: "Flood Risk" },
  { key: "multiHazard", label: "Multi-Hazard Risk" },
];

const nf = new Intl.NumberFormat("en-IN");

/**
 * Detail panel for the currently selected habitation.
 *
 * Shared by the command centre, exposure and habitations views so a habitation
 * always reads the same way wherever it is selected.
 */
function SelectedHabitationPanel({
  habitation,
  onClose,
  onOpenRelocation,
  compact = false,
}) {
  const [tab, setTab] = useState("Overview");

  if (!habitation) {
    return (
      <aside className="habitation-panel">
        <EmptyState
          icon={MapPin}
          title="No habitation selected"
          message="Select a marker on the map or a row in the table to view its assessment."
        />
      </aside>
    );
  }

  return (
    <aside className="habitation-panel" aria-label="Selected habitation">
      <div className="habitation-panel-heading">
        <span>SELECTED HABITATION</span>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Clear selection">
            <X size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="habitation-title-row">
        <h3>{habitation.name}</h3>
        <StatusBadge status={habitation.assessmentStatus} />
      </div>

      <p className="habitation-location">
        <MapPin size={13} aria-hidden="true" />
        {habitation.district} District, {habitation.state}
      </p>

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
        {tab === "Overview" ? (
          <>
            <div className="decision-cards">
              <div className="decision-card">
                <span>OVERALL RISK</span>
                <RiskBadge level={habitation.overallRisk} />
              </div>
              <div className="decision-card">
                <span>RELOCATION PRIORITY</span>
                <PriorityBadge level={habitation.relocationPriority} />
              </div>
            </div>

            <div className="metric-grid">
              <div>
                <span>Population</span>
                <strong>{nf.format(habitation.population)}</strong>
              </div>
              <div>
                <span>Households</span>
                <strong>{nf.format(habitation.households)}</strong>
              </div>
              <div>
                <span>Area</span>
                <strong>{habitation.area} sq km</strong>
              </div>
              <div>
                <span>Exposure</span>
                <strong>{habitation.exposurePct}%</strong>
              </div>
            </div>

            <DemoDataBadge
              label="Prototype figures"
              title="Population and exposure values are demonstration data"
            />

            <section className="panel-section">
              <h4>Why Vulnerable?</h4>
              <ul className="reason-list">
                {habitation.whyVulnerable.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <p className="panel-footnote">
                Demo explanations pending GIS and field verification.
              </p>
            </section>
          </>
        ) : null}

        {tab === "Hazards" ? (
          <section className="panel-section">
            <h4>Hazard Summary</h4>
            {HAZARD_ROWS.map((row) => {
              const value = habitation.hazards[row.key];
              return (
                <div key={row.key} className="hazard-summary-row">
                  <span>{row.label}</span>
                  <span className="hazard-summary-value">
                    <RiskBadge level={value.level} />
                    <small>{value.score}/100</small>
                  </span>
                </div>
              );
            })}

            <h4>Primary Hazard</h4>
            <p className="panel-value">{habitation.primaryHazard}</p>

            <h4>Multi-Hazard</h4>
            <p className="panel-value">
              {habitation.isMultiHazard ? "Yes" : "No"}
            </p>

            <p className="panel-footnote">
              Prototype scores. No validated scientific weighting has been
              applied. Future sources: GSI, flood inventory, terrain data.
            </p>
          </section>
        ) : null}

        {tab === "Exposure" ? (
          <section className="panel-section">
            <h4>Population Exposure</h4>

            <div className="metric-grid">
              <div>
                <span>Total Population</span>
                <strong>{nf.format(habitation.population)}</strong>
              </div>
              <div>
                <span>Population Exposed</span>
                <strong>{nf.format(habitation.exposedPopulation)}</strong>
              </div>
            </div>

            <div className="exposure-bar-wrap">
              <div className="exposure-bar">
                <div
                  className="exposure-bar-fill"
                  style={{ width: `${habitation.exposurePct}%` }}
                />
              </div>
              <span>{habitation.exposurePct}% exposed</span>
            </div>

            <h4>Key Exposure Factors</h4>
            <ul className="reason-list">
              {habitation.keyFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>

            <p className="panel-footnote">
              Prototype data — future WorldPop integration.
            </p>
          </section>
        ) : null}

        {tab === "Accessibility" ? (
          <section className="panel-section">
            <h4>Access Condition</h4>
            <p className="panel-value">{habitation.accessibility}</p>

            <h4>Assessment Status</h4>
            <StatusBadge status={habitation.assessmentStatus} />

            <p className="panel-footnote">
              Road and travel-time analysis will use OpenStreetMap road context
              once routing is integrated. Not yet computed.
            </p>
          </section>
        ) : null}

        {tab === "Relocation" ? (
          <section className="panel-section">
            <h4>Relocation Priority</h4>
            <PriorityBadge level={habitation.relocationPriority} />

            <p className="panel-footnote">
              Prototype decision-support recommendation. Requires commander
              review and field validation. This is not a relocation order.
            </p>

            {onOpenRelocation ? (
              <button
                type="button"
                className="panel-primary-action"
                onClick={() => onOpenRelocation(habitation)}
              >
                <Route size={15} aria-hidden="true" />
                Open Relocation Analysis
              </button>
            ) : null}
          </section>
        ) : null}
      </div>

      {!compact ? (
        <div className="panel-actions">
          <button type="button">
            <FileText size={14} aria-hidden="true" />
            View Full Assessment
          </button>
          <button type="button">
            <ClipboardCheck size={14} aria-hidden="true" />
            Request Field Verification
          </button>
          <button type="button">
            <Plus size={14} aria-hidden="true" />
            Add to Relocation Plan
          </button>
        </div>
      ) : null}
    </aside>
  );
}

export default SelectedHabitationPanel;
