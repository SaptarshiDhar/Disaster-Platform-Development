
import { useState } from "react";

import {
  MapPin,
  ShieldAlert,
  TriangleAlert,
  Users,
} from "lucide-react";

function RiskValue({ label, value }) {
  const className = value
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <div className="hazard-summary-row">
      <span>{label}</span>

      <strong className={className}>
        {value}
      </strong>
    </div>
  );
}

function HabitationPanel({
  habitation,
}) {
  const [tab, setTab] =
    useState("overview");

  if (!habitation) {
    return (
      <aside className="habitation-panel empty">
        Select a habitation on the map to
        inspect its risk profile.
      </aside>
    );
  }

  const overallRisk =
    habitation.hazards.multiHazard.level;

  return (
    <aside className="habitation-panel">
      <div className="habitation-panel-heading">
        <span>
          SELECTED HABITATION
        </span>

        <span className="prototype-badge">
          Prototype
        </span>
      </div>

      <h2>{habitation.name}</h2>

      <div className="habitation-location">
        <MapPin size={15} />

        {habitation.district},{" "}
        {habitation.state}
      </div>

      <div className="habitation-tabs">
        {[
          "overview",
          "hazard",
          "exposure",
          "relocation",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={
              tab === item
                ? "active"
                : ""
            }
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="decision-cards">
            <div className="decision-card">
              <span>OVERALL RISK</span>

              <strong
                className={`risk-big ${overallRisk
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {overallRisk}
              </strong>
            </div>

            <div className="decision-card">
              <span>
                RELOCATION PRIORITY
              </span>

              <strong className="priority-big">
                {
                  habitation.relocationPriority
                }
              </strong>
            </div>
          </div>

          <div className="population-info-grid">
            <div>
              <Users size={17} />

              <span>Population</span>

              <strong>
                {habitation.population.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Households</span>

              <strong>
                {habitation.households}
              </strong>
            </div>

            <div>
              <span>Area</span>

              <strong>
                {habitation.area} km²
              </strong>
            </div>
          </div>

          <section className="panel-section">
            <h3>Hazard Summary</h3>

            <RiskValue
              label="Landslide"
              value={
                habitation.hazards
                  .landslide.level
              }
            />

            <RiskValue
              label="Flood"
              value={
                habitation.hazards.flood
                  .level
              }
            />

            <RiskValue
              label="Multi-Hazard"
              value={
                habitation.hazards
                  .multiHazard.level
              }
            />
          </section>

          <section className="panel-section">
            <h3>Key Risk Factors</h3>

            {habitation.keyFactors.map(
              (factor) => (
                <div
                  className="risk-factor"
                  key={factor}
                >
                  <TriangleAlert
                    size={14}
                  />

                  {factor}
                </div>
              )
            )}
          </section>
        </>
      )}

      {tab === "hazard" && (
        <section className="panel-section">
          <h3>
            Hazard Intelligence
          </h3>

          <RiskValue
            label="Landslide"
            value={
              habitation.hazards.landslide
                .level
            }
          />

          <RiskValue
            label="Flood"
            value={
              habitation.hazards.flood.level
            }
          />

          <RiskValue
            label="Multi-Hazard"
            value={
              habitation.hazards
                .multiHazard.level
            }
          />

          <div className="engine-note">
            <ShieldAlert size={16} />

            Future values will be provided
            by the GIS / hazard-risk engine.
          </div>
        </section>
      )}

      {tab === "exposure" && (
        <section className="panel-section">
          <h3>
            Population & Exposure
          </h3>

          <div className="exposure-value">
            <span>
              Estimated Population
            </span>

            <strong>
              {habitation.population.toLocaleString()}
            </strong>
          </div>

          <div className="exposure-value">
            <span>Exposure Level</span>

            <strong>
              {habitation.exposure}
            </strong>
          </div>

          <div className="engine-note">
            Future exposed-population
            figures will come from
            WorldPop/geospatial
            intersection processing.
          </div>
        </section>
      )}

      {tab === "relocation" && (
        <section className="panel-section">
          <h3>
            Relocation Decision Support
          </h3>

          <div className="relocation-priority-box">
            <span>Current Priority</span>

            <strong>
              {
                habitation.relocationPriority
              }
            </strong>
          </div>

          <div className="engine-note">
            Safer-site suitability,
            carrying capacity and final
            relocation recommendation will
            be supplied by future
            decision-support engines.
          </div>
        </section>
      )}

      <div className="habitation-actions">
        <button className="secondary-action">
          View Detailed Report
        </button>

        <button
          className="primary-action"
          onClick={() =>
            alert(
              "Future integration: this action will request detailed GIS/risk analysis from the backend."
            )
          }
        >
          Analyse Habitation
        </button>
      </div>
    </aside>
  );
}

export default HabitationPanel;
