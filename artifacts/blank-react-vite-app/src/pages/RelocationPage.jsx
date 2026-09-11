import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Circle,
  Clock,
  Home,
  MapPinned,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import RakshaMap from "../components/gis/RakshaMap";
import MapLegend from "../components/gis/MapLegend";
import {
  DemoDataBadge,
  EmptyState,
  PriorityBadge,
  RiskBadge,
  StatusBadge,
} from "../components/common/Badges";

import {
  getRelocationCase,
  getRelocationSummary,
  getRoutesFor,
  listCandidateSites,
  listRelocationCases,
} from "../services/relocationService";
import { WORKFLOW_STATE } from "../data/mockRelocation";

const nf = new Intl.NumberFormat("en-IN");

const SITE_LEGEND = [
  { label: "Origin habitation", colour: "#ef4444" },
  { label: "Candidate site", colour: "#22c55e" },
  { label: "Proposed corridor", colour: "#facc15" },
];

const CAPACITY_FACTORS = [
  { key: "terrainStability", label: "Terrain Stability" },
  { key: "roadAccessibility", label: "Road Accessibility" },
  { key: "waterAvailability", label: "Water Availability" },
  { key: "healthcareAccess", label: "Healthcare Access" },
  { key: "schoolAccess", label: "School Access" },
  { key: "residualHazardRisk", label: "Residual Hazard Risk" },
];

/**
 * Relocation Planning.
 *
 * Moves from "this habitation is vulnerable" to "what plan should the
 * authority consider". Every recommendation is explicitly a prototype
 * decision-support output requiring commander review — never an order.
 */
function RelocationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const habitationParam = searchParams.get("habitation");

  const [summary, setSummary] = useState(null);
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [sites, setSites] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([getRelocationSummary(), listRelocationCases()]).then(
      ([s, c]) => {
        if (!active) return;
        setSummary(s);
        setCases(c);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  // Resolve which case to show: the URL parameter wins, otherwise the first
  // case that actually has a plan attached.
  useEffect(() => {
    if (cases.length === 0) return undefined;

    let active = true;
    const targetId =
      habitationParam ??
      cases.find((item) => item.plan)?.habitationId ??
      cases[0].habitationId;

    getRelocationCase(targetId).then((result) => {
      if (!active) return;
      setActiveCase(result);
      setSelectedSiteId(result?.plan?.allocations?.[0]?.siteId ?? null);
    });

    getRoutesFor(targetId).then((result) => {
      if (active) setRoutes(result);
    });

    listCandidateSites(targetId).then((result) => {
      if (active) setSites(result);
    });

    return () => {
      active = false;
    };
  }, [cases, habitationParam]);

  const habitation = activeCase?.habitation ?? null;
  const plan = activeCase?.plan ?? null;

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) ?? sites[0] ?? null,
    [sites, selectedSiteId],
  );

  const region = useMemo(() => {
    if (!habitation) return { center: [22.9734, 78.6569], zoom: 5 };
    return { center: habitation.coordinates, zoom: 9 };
  }, [habitation]);

  const capacity = activeCase?.carryingCapacity ?? null;

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Relocation Planning</h2>
          <p>
            Candidate sites, carrying capacity and a prototype relocation
            recommendation for review.
          </p>
        </div>
        <DemoDataBadge label="Prototype Plan" />
      </div>

      <section className="stat-grid stat-grid-6" aria-label="Relocation indicators">
        <StatCard
          icon={Home}
          label="REQUIRING RELOCATION"
          value={summary ? summary.habitationsRequiring : "—"}
          subtitle="Prototype assessment"
          tone="red"
        />
        <StatCard
          icon={TriangleAlert}
          label="IMMEDIATE CASES"
          value={summary ? summary.immediateCases : "—"}
          subtitle="Requires review"
          tone="red"
        />
        <StatCard
          icon={Users}
          label="POPULATION TO RELOCATE"
          value={summary ? nf.format(summary.populationToRelocate) : "—"}
          subtitle="Immediate priority only"
          tone="blue"
        />
        <StatCard
          icon={MapPinned}
          label="CANDIDATE SITES"
          value={summary ? summary.sitesAvailable : "—"}
          subtitle="Prototype catalogue"
          tone="green"
        />
        <StatCard
          icon={Building2}
          label="CAPACITY AVAILABLE"
          value={summary ? nf.format(summary.capacityAvailable) : "—"}
          subtitle="Suitable sites only"
          tone="green"
        />
        <StatCard
          icon={TriangleAlert}
          label="CAPACITY DEFICIT"
          value={summary ? nf.format(summary.capacityDeficit) : "—"}
          subtitle="Demand minus capacity"
          tone={summary && summary.capacityDeficit > 0 ? "orange" : "green"}
        />
      </section>

      <div className="case-selector">
        <label htmlFor="case-select">Relocation case</label>
        <select
          id="case-select"
          value={habitation?.id ?? ""}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams);
            next.set("habitation", event.target.value);
            setSearchParams(next, { replace: true });
          }}
        >
          {cases.map((item) => (
            <option key={item.id} value={item.habitationId}>
              {item.habitation?.name} — {item.habitation?.district}
            </option>
          ))}
        </select>
      </div>

      <section className="relocation-grid">
        {/* LEFT: case details */}
        <aside className="relocation-case-panel">
          <div className="panel-head">
            <h3>Relocation Case Details</h3>
          </div>

          {habitation ? (
            <>
              <div className="case-identity">
                <strong>{habitation.name}</strong>
                <span>
                  {habitation.district} District, {habitation.state}
                </span>
                <div className="case-tags">
                  <RiskBadge level={habitation.overallRisk} />
                  <DemoDataBadge label="Prototype Data" />
                </div>
              </div>

              <dl className="case-metrics">
                <div>
                  <dt>Total Population</dt>
                  <dd>{nf.format(habitation.population)}</dd>
                </div>
                <div>
                  <dt>Exposed Population</dt>
                  <dd>
                    {nf.format(habitation.exposedPopulation)} (
                    {habitation.exposurePct}%)
                  </dd>
                </div>
                <div>
                  <dt>Households</dt>
                  <dd>{nf.format(habitation.households)}</dd>
                </div>
                <div>
                  <dt>Relocation Priority</dt>
                  <dd>
                    <PriorityBadge level={habitation.relocationPriority} />
                  </dd>
                </div>
                <div>
                  <dt>Assessment Status</dt>
                  <dd>
                    <StatusBadge status={habitation.assessmentStatus} />
                  </dd>
                </div>
              </dl>

              <section className="panel-section">
                <h4>
                  <TriangleAlert size={14} aria-hidden="true" />
                  Why Relocation Is Needed
                </h4>
                <ul className="reason-list">
                  {activeCase.whyRelocation.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <p className="panel-footnote">
                  Demo reasoning. Requires field validation before any decision.
                </p>
              </section>
            </>
          ) : (
            <EmptyState title="Loading case" message="Fetching prototype data." />
          )}
        </aside>

        {/* CENTRE: map */}
        <div className="relocation-map">
          <div className="map-stage map-stage-tall">
            <RakshaMap
              region={region}
              hazardMode="landslide"
              habitations={[]}
              originHabitation={habitation}
              routes={routes}
              candidateSites={sites}
              layers={{ hazard: true, candidateSites: true, habitations: false }}
            />

            <MapLegend
              title="Relocation Context"
              items={SITE_LEGEND}
              note="Corridors are straight-line demo paths, not routed against a road network."
            />
          </div>
        </div>

        {/* RIGHT: recommended plan */}
        <aside className="relocation-plan-panel">
          <div className="panel-head">
            <h3>Recommended Relocation Plan</h3>
            <DemoDataBadge label="Prototype" />
          </div>

          {plan ? (
            <>
              <div className="plan-headline">
                <ShieldCheck size={16} aria-hidden="true" />
                <div>
                  <strong>Recommended: {plan.type}</strong>
                  <p>{plan.summary}</p>
                </div>
              </div>

              <div className="plan-sites">
                {plan.allocations.map((allocation) => (
                  <article
                    key={allocation.siteId}
                    className={`plan-site ${
                      selectedSiteId === allocation.siteId ? "active" : ""
                    }`}
                    onClick={() => setSelectedSiteId(allocation.siteId)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedSiteId(allocation.siteId);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedSiteId === allocation.siteId}
                  >
                    <header>
                      <strong>{allocation.siteName}</strong>
                      <span>{allocation.sharePct}% of total</span>
                    </header>

                    <p className="plan-people">
                      <Users size={13} aria-hidden="true" />
                      {nf.format(allocation.people)} people
                    </p>

                    <dl>
                      <div>
                        <dt>Distance</dt>
                        <dd>{allocation.distanceKm} km</dd>
                      </div>
                      <div>
                        <dt>Travel Time</dt>
                        <dd>{allocation.travelTimeMin} min</dd>
                      </div>
                      <div>
                        <dt>Capacity Used</dt>
                        <dd>{allocation.utilisationPct}%</dd>
                      </div>
                      <div>
                        <dt>Residual</dt>
                        <dd>{nf.format(allocation.residualCapacity)}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>

              <div className="plan-status" role="note">
                <TriangleAlert size={15} aria-hidden="true" />
                <div>
                  <strong>Plan Status: {plan.status}</strong>
                  <span>
                    Field verification recommended before any approval. This is
                    not a relocation order.
                  </span>
                </div>
              </div>

              <section className="panel-section">
                <h4>Why This Plan?</h4>
                <ul className="reason-list tick-list">
                  {plan.rationale.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </section>

              <div className="plan-actions">
                <button type="button" className="panel-secondary-action">
                  Compare Candidate Sites
                </button>
                <button type="button" className="panel-secondary-action">
                  Open Carrying Capacity
                </button>
                <button type="button" className="panel-secondary-action">
                  Request Field Verification
                </button>
                <button type="button" className="panel-primary-action">
                  Generate Relocation Plan
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              icon={MapPinned}
              title="No plan generated yet"
              message="Candidate sites have not been identified for this habitation. Complete site identification to produce a prototype plan."
            />
          )}
        </aside>
      </section>

      {/* BOTTOM ANALYTICS */}
      <section className="analytics-grid analytics-grid-4">
        <article className="analytics-card analytics-card-wide">
          <header>
            <h3>Candidate Site Comparison</h3>
            <DemoDataBadge />
          </header>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Site</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Hazard Safety</th>
                  <th scope="col">Capacity</th>
                  <th scope="col">Infrastructure</th>
                  <th scope="col">Suitability</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site, index) => (
                  <tr
                    key={site.id}
                    className={selectedSite?.id === site.id ? "selected" : ""}
                    tabIndex={0}
                    onClick={() => setSelectedSiteId(site.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedSiteId(site.id);
                      }
                    }}
                  >
                    <td>{index + 1}</td>
                    <td className="emphasis">{site.name}</td>
                    <td>{site.distanceKm} km</td>
                    <td>
                      <RiskBadge level={site.hazardSafety} />
                    </td>
                    <td>{nf.format(site.capacity)}</td>
                    <td>{site.infrastructure}</td>
                    <td className="emphasis">{site.suitability}/100</td>
                    <td>
                      <StatusBadge status={site.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Carrying Capacity</h3>
            <DemoDataBadge label="Prototype" />
          </header>

          {capacity ? (
            <>
              <p className="capacity-site">{capacity.siteName}</p>

              <dl className="case-metrics compact">
                <div>
                  <dt>Safe Carrying Capacity</dt>
                  <dd>{nf.format(capacity.safeCapacity)} people</dd>
                </div>
                <div>
                  <dt>Relocation Demand</dt>
                  <dd>{nf.format(capacity.demandAllocated)} people</dd>
                </div>
                <div>
                  <dt>Residual Capacity</dt>
                  <dd>{nf.format(capacity.residualCapacity)}</dd>
                </div>
              </dl>

              <div className="capacity-bar-wrap">
                <div className="capacity-bar">
                  <div
                    className={`capacity-bar-fill ${
                      capacity.utilisationPct > 100 ? "over" : ""
                    }`}
                    style={{
                      width: `${Math.min(100, capacity.utilisationPct)}%`,
                    }}
                  />
                </div>
                <span>{capacity.utilisationPct}% utilised</span>
              </div>

              {capacity.utilisationPct > 100 ? (
                <p className="capacity-warning">
                  Demand exceeds prototype capacity at this site. An additional
                  site is required.
                </p>
              ) : null}

              <h4>Key Capacity Factors</h4>
              <ul className="factor-list">
                {selectedSite
                  ? CAPACITY_FACTORS.map((factor) => (
                      <li key={factor.key}>
                        <span>{factor.label}</span>
                        <strong
                          className={`factor-${(
                            selectedSite.factors[factor.key] ?? "pending"
                          )
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                        >
                          {selectedSite.factors[factor.key] ??
                            "Pending Assessment"}
                        </strong>
                      </li>
                    ))
                  : null}
              </ul>

              <p className="panel-footnote">
                Prototype assumptions. No validated carrying-capacity study has
                been performed and no weighting has been agreed.
              </p>
            </>
          ) : (
            <EmptyState
              icon={Clock}
              title="Pending Assessment"
              message="Carrying capacity has not been computed for this case."
            />
          )}
        </article>

        <article className="analytics-card">
          <header>
            <h3>Site Suitability Analysis</h3>
            <DemoDataBadge />
          </header>

          {selectedSite ? (
            <>
              <div className="suitability-score">
                <strong>{selectedSite.suitability}</strong>
                <span>/ 100</span>
                <p>{selectedSite.name}</p>
              </div>

              <ul className="bar-list">
                {selectedSite.suitabilityBreakdown.map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${row.value}%`,
                          background:
                            row.value >= 75
                              ? "#4ade80"
                              : row.value >= 55
                                ? "#facc15"
                                : "#f97316",
                        }}
                      />
                    </div>
                    <strong>{row.value}</strong>
                  </li>
                ))}
              </ul>

              <p className="panel-footnote">
                Prototype scores shown for comparison only.
              </p>
            </>
          ) : (
            <EmptyState title="No site selected" />
          )}
        </article>

        <article className="analytics-card">
          <header>
            <h3>Planning Workflow</h3>
          </header>

          <ol className="workflow-list">
            {(activeCase?.workflow ?? []).map((step) => {
              const done = step.state === WORKFLOW_STATE.COMPLETE;
              const partial = step.state === WORKFLOW_STATE.PROTOTYPE;

              return (
                <li key={step.step} className={done ? "done" : partial ? "partial" : ""}>
                  {done ? (
                    <CheckCircle2 size={15} aria-hidden="true" />
                  ) : partial ? (
                    <ShieldCheck size={15} aria-hidden="true" />
                  ) : (
                    <Circle size={15} aria-hidden="true" />
                  )}
                  <span>{step.step}</span>
                  <em>{step.state}</em>
                </li>
              );
            })}
          </ol>

          <p className="panel-footnote">
            Workflow state is prototype only. Commander review and field
            validation remain outstanding for every case.
          </p>
        </article>
      </section>
    </>
  );
}

export default RelocationPage;
