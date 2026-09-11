import { useState } from "react";
import { GitCompare, MapPin, Route, X } from "lucide-react";

import { SITE_TIER_LABEL } from "../../data/mockCandidateSites";
import {
  DemoDataBadge,
  EmptyState,
  RiskBadge,
  StatusBadge,
  TierBadge,
} from "../common/Badges";

const TABS = ["Overview", "Safety", "Capacity", "Accessibility", "Services", "Validation"];

const nf = new Intl.NumberFormat("en-IN");

/**
 * Detail panel for the currently selected candidate relocation site.
 *
 * Mirrors SelectedHabitationPanel's tabbed layout so the two panels feel like
 * the same product, but the tab set and content are specific to a site.
 */
function CandidateSitePanel({ site, onClose, onOpenRelocation, onCompare }) {
  const [tab, setTab] = useState("Overview");

  if (!site) {
    return (
      <aside className="habitation-panel">
        <EmptyState
          icon={MapPin}
          title="No site selected"
          message="Select a marker on the map or a row in the table to view its assessment."
        />
      </aside>
    );
  }

  const utilisationPct =
    site.capacity > 0
      ? Math.round(((site.plannedAllocation ?? 0) / site.capacity) * 100)
      : 0;

  return (
    <aside className="habitation-panel" aria-label="Selected candidate site">
      <div className="habitation-panel-heading">
        <span>SELECTED CANDIDATE SITE</span>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Clear selection">
            <X size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="habitation-title-row">
        <h3>{site.name}</h3>
        {site.verification ? <StatusBadge status={site.verification} /> : null}
      </div>

      <p className="habitation-location">
        <MapPin size={13} aria-hidden="true" />
        {site.district}, {site.state}
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
                <span>OVERALL SUITABILITY</span>
                {site.tier ? (
                  <TierBadge tier={site.tier} label={SITE_TIER_LABEL[site.tier]} />
                ) : (
                  <span className="panel-value">{site.suitability}/100</span>
                )}
              </div>
              <div className="decision-card">
                <span>RESIDUAL HAZARD</span>
                <RiskBadge level={site.residualHazard ?? site.hazardSafety} />
              </div>
            </div>

            <div className="metric-grid">
              <div>
                <span>Estimated Safe Capacity</span>
                <strong>{nf.format(site.capacity)} people</strong>
              </div>
              <div>
                <span>Road Accessibility</span>
                <strong>{site.roadAccess ?? site.factors?.roadAccessibility}</strong>
              </div>
            </div>

            <DemoDataBadge
              label="Prototype Assessment"
              title="Suitability and capacity values are demonstration data"
            />

            <section className="panel-section">
              <h4>Recommended Use</h4>
              <p className="panel-value">{site.recommendedUse ?? "—"}</p>
            </section>

            {site.whySuitable?.length ? (
              <section className="panel-section">
                <h4>Why This Site Is Suitable</h4>
                <ul className="reason-list tick-list">
                  {site.whySuitable.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {site.constraints?.length ? (
              <section className="panel-section">
                <h4>Constraints / Considerations</h4>
                <ul className="reason-list">
                  {site.constraints.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <p className="panel-footnote">
                  Demo constraints pending field validation.
                </p>
              </section>
            ) : null}
          </>
        ) : null}

        {tab === "Safety" ? (
          <section className="panel-section">
            <h4>Hazard Safety</h4>
            <RiskBadge level={site.hazardSafety ?? "Moderate"} />

            <h4>Residual Hazard</h4>
            <RiskBadge level={site.residualHazard ?? "Moderate"} />

            {site.suitabilityBreakdown?.length ? (
              <>
                <h4>Suitability Breakdown</h4>
                <ul className="factor-list">
                  {site.suitabilityBreakdown.map((row) => (
                    <li key={row.label}>
                      <span>{row.label}</span>
                      <strong>{row.value}/100</strong>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="panel-footnote">
              Prototype scores. No validated hazard model has been applied.
            </p>
          </section>
        ) : null}

        {tab === "Capacity" ? (
          <section className="panel-section">
            <h4>Capacity</h4>

            <div className="metric-grid">
              <div>
                <span>Estimated Safe Capacity</span>
                <strong>{nf.format(site.capacity)}</strong>
              </div>
              <div>
                <span>Planned Allocation</span>
                <strong>{nf.format(site.plannedAllocation ?? 0)}</strong>
              </div>
              <div>
                <span>Remaining Capacity</span>
                <strong>
                  {nf.format(site.residualCapacity ?? site.capacity)}
                </strong>
              </div>
              <div>
                <span>Utilisation</span>
                <strong>{utilisationPct}%</strong>
              </div>
            </div>

            {site.factors ? (
              <>
                <h4>Key Capacity Factors</h4>
                <ul className="factor-list">
                  {Object.entries({
                    "Terrain Stability": site.factors.terrainStability,
                    "Road Accessibility": site.factors.roadAccessibility,
                    "Water Availability": site.factors.waterAvailability,
                    "Healthcare Access": site.factors.healthcareAccess,
                    "School Access": site.factors.schoolAccess,
                    "Residual Hazard": site.factors.residualHazardRisk,
                  }).map(([label, value]) => (
                    <li key={label}>
                      <span>{label}</span>
                      <strong>{value ?? "Pending Assessment"}</strong>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p className="panel-footnote">
              Prototype assumptions. No validated carrying-capacity study has
              been performed.
            </p>
          </section>
        ) : null}

        {tab === "Accessibility" ? (
          <section className="panel-section">
            <h4>Accessibility</h4>
            {site.accessibility ? (
              <ul className="factor-list">
                <li>
                  <span>Nearest Major Road</span>
                  <strong>{site.accessibility.nearestMajorRoad ?? "Pending Assessment"}</strong>
                </li>
                <li>
                  <span>Road Connectivity</span>
                  <strong>{site.accessibility.roadConnectivity}</strong>
                </li>
                <li>
                  <span>Emergency Vehicle Access</span>
                  <strong>{site.accessibility.emergencyVehicleAccess}</strong>
                </li>
                <li>
                  <span>Alternate Access</span>
                  <strong>{site.accessibility.alternateAccess}</strong>
                </li>
                <li>
                  <span>Distance to Habitation</span>
                  <strong>{site.accessibility.distanceToHabitationKm} km</strong>
                </li>
              </ul>
            ) : (
              <p className="panel-value">
                {site.distanceKm} km · approx. {site.travelTimeMin} min travel time
              </p>
            )}
            <p className="panel-footnote">
              Distances shown are straight-line demo estimates, not routed
              against a real road network.
            </p>
          </section>
        ) : null}

        {tab === "Services" ? (
          <section className="panel-section">
            <h4>Essential Services</h4>
            {site.services ? (
              <ul className="factor-list">
                {Object.entries({
                  Health: site.services.health,
                  School: site.services.school,
                  Water: site.services.water,
                  Electricity: site.services.electricity,
                  Sanitation: site.services.sanitation,
                  "Emergency Services": site.services.emergency,
                }).map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <strong>{value ?? "Pending Assessment"}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-value">Services not yet catalogued for this site.</p>
            )}
          </section>
        ) : null}

        {tab === "Validation" ? (
          <section className="panel-section">
            <h4>Validation Workflow</h4>
            {site.validation?.length ? (
              <ol className="workflow-list">
                {site.validation.map((step) => (
                  <li
                    key={step.step}
                    className={
                      step.state === "Completed"
                        ? "done"
                        : step.state === "In Progress"
                          ? "partial"
                          : ""
                    }
                  >
                    <span>{step.step}</span>
                    <em>{step.state}</em>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="panel-value">Workflow not yet started for this site.</p>
            )}
            <p className="panel-footnote">
              Prototype workflow state. Administrative review remains
              outstanding for every site.
            </p>
          </section>
        ) : null}
      </div>

      <div className="panel-actions">
        <button type="button" onClick={() => onCompare?.(site)}>
          <GitCompare size={14} aria-hidden="true" />
          Compare Site
        </button>
        <button
          type="button"
          className="panel-primary-action"
          onClick={() => onOpenRelocation?.(site)}
        >
          <Route size={14} aria-hidden="true" />
          Open in Relocation Planning
        </button>
      </div>
    </aside>
  );
}

export default CandidateSitePanel;
