import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  MapPinned,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import StatCard from "../components/dashboard/StatCard";
import CandidateSitePanel from "../components/dashboard/CandidateSitePanel";
import RakshaMap from "../components/gis/RakshaMap";
import MapToolbar from "../components/gis/MapToolbar";
import MapLayersPanel from "../components/gis/MapLayersPanel";
import MapLegend from "../components/gis/MapLegend";
import { DemoDataBadge, TierBadge } from "../components/common/Badges";

import {
  getCandidateSiteSummary,
  getCapacityDistribution,
  getStates,
  getSuitabilityBreakdown,
  getTopRankedSites,
  getVerificationBreakdown,
  listCandidateSites,
} from "../services/candidateSiteService";
import { getRegion } from "../services/dashboardService";
import { SITE_TIER, SITE_TIER_LABEL } from "../data/mockCandidateSites";

const nf = new Intl.NumberFormat("en-IN");
const PAGE_SIZE = 10;

const TIER_LEGEND = [
  { label: "High Suitability", colour: "#22c55e" },
  { label: "Suitable", colour: "#4ade80" },
  { label: "Needs Assessment", colour: "#facc15" },
  { label: "Limited Suitability", colour: "#f97316" },
  { label: "Rejected / Unsuitable", colour: "#ef4444" },
];

const LAYER_GROUPS = [
  {
    title: "Candidate Sites",
    items: [{ key: "candidateSites", label: "Candidate Sites", layerId: "candidateSites" }],
  },
  {
    title: "Context",
    items: [
      { key: "habitations", label: "Vulnerable Habitations", layerId: "habitations" },
      { key: "hazard", label: "Hazard Zones", layerId: "gsiLandslide" },
      { key: "facilities", label: "Health Facilities & Schools", layerId: "facilities" },
    ],
  },
];

const DEFAULT_LAYERS = {
  candidateSites: true,
  habitations: false,
  hazard: true,
  facilities: false,
};

/**
 * Candidate Sites.
 *
 * India-wide screening catalogue of potential relocation sites: map, table
 * and detail panel stay in sync, matching the pattern already established by
 * HabitationsPage.
 */
function CandidateSitesPage() {
  const navigate = useNavigate();
  const { hazardMode } = useOutletContext();

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [capacityDist, setCapacityDist] = useState([]);
  const [suitabilityDist, setSuitabilityDist] = useState([]);
  const [verificationDist, setVerificationDist] = useState([]);
  const [topRanked, setTopRanked] = useState([]);
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState(null);

  const [stateFilter, setStateFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [regionId, setRegionId] = useState("india");
  const [layersOpen, setLayersOpen] = useState(true);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [searchMessage, setSearchMessage] = useState("");
  const [compareNotice, setCompareNotice] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getCandidateSiteSummary(),
      getCapacityDistribution(),
      getSuitabilityBreakdown(),
      getVerificationBreakdown(),
      getTopRankedSites(5),
      getStates(),
    ]).then(([s, cap, suit, ver, top, stateList]) => {
      if (!active) return;
      setSummary(s);
      setCapacityDist(cap);
      setSuitabilityDist(suit);
      setVerificationDist(ver);
      setTopRanked(top);
      setStates(stateList);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    listCandidateSites({ state: stateFilter, tier: tierFilter, query }).then(
      (result) => {
        if (!active) return;
        setRows(result);
        setPage(1);
        setSelected((current) => {
          if (current && result.some((item) => item.id === current.id)) {
            return current;
          }
          return result[0] ?? null;
        });
      },
    );

    return () => {
      active = false;
    };
  }, [stateFilter, tierFilter, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const region = useMemo(() => getRegion(regionId), [regionId]);

  const handleSearch = (value) => {
    const q = value.trim().toLowerCase();
    if (!q) {
      setSearchMessage("");
      return;
    }
    const found = rows.find(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q),
    );
    if (!found) {
      setSearchMessage(`No prototype candidate site matches "${value}".`);
      return;
    }
    setSearchMessage("");
    setSelected(found);
  };

  const toggleLayer = (key) =>
    setLayers((current) => ({ ...current, [key]: !current[key] }));

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Candidate Sites</h2>
          <p>
            Screening catalogue of potential relocation sites: location,
            suitability, capacity and verification status.
          </p>
        </div>
        <DemoDataBadge label="Prototype Assessment" />
      </div>

      <section className="stat-grid stat-grid-6" aria-label="Candidate site indicators">
        <StatCard
          icon={MapPinned}
          label="CANDIDATE SITES IDENTIFIED"
          value={summary ? summary.total : "—"}
          subtitle="Prototype assessment"
          tone="green"
        />
        <StatCard
          icon={Star}
          label="HIGH-SUITABILITY SITES"
          value={summary ? summary.highSuitability : "—"}
          subtitle="Demo data"
          tone="green"
        />
        <StatCard
          icon={Users}
          label="ESTIMATED SAFE CAPACITY"
          value={summary ? nf.format(summary.estimatedSafeCapacity) : "—"}
          subtitle="Prototype assessment"
          tone="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="FIELD VERIFIED SITES"
          value={summary ? summary.fieldVerified : "—"}
          subtitle="Demo data"
          tone="blue"
        />
        <StatCard
          icon={Clock}
          label="ASSESSMENT PENDING"
          value={summary ? summary.assessmentPending : "—"}
          subtitle="Pending field visit"
          tone="yellow"
        />
        <StatCard
          icon={XCircle}
          label="REJECTED / UNSUITABLE"
          value={summary ? summary.rejected : "—"}
          subtitle="Prototype assessment"
          tone="red"
        />
      </section>

      <section className="habitations-grid">
        <div className="habitations-map">
          <MapToolbar
            regionId={regionId}
            onRegionChange={setRegionId}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onToggleLayers={() => setLayersOpen((open) => !open)}
            layersOpen={layersOpen}
            searchPlaceholder="Search site or location"
          />

          {searchMessage ? (
            <p className="map-search-message" role="status">
              {searchMessage}
            </p>
          ) : null}

          <div className="map-stage map-stage-short">
            <RakshaMap
              region={region}
              hazardMode={hazardMode}
              candidateSites={rows}
              selectedSiteId={selected?.id}
              onSelectSite={setSelected}
              layers={layers}
            />

            <MapLegend
              title="Candidate Site Suitability"
              items={TIER_LEGEND}
              note="Demo / prototype layers. Not real-time data."
            />

            {layersOpen ? (
              <MapLayersPanel
                groups={LAYER_GROUPS}
                layers={layers}
                onToggle={toggleLayer}
                onClose={() => setLayersOpen(false)}
                onReset={() => setLayers(DEFAULT_LAYERS)}
              />
            ) : null}
          </div>
        </div>

        <CandidateSitePanel
          site={selected}
          onClose={() => setSelected(null)}
          onCompare={(site) =>
            setCompareNotice(
              `${site.name} added for comparison (prototype — full comparison view planned for a later phase).`,
            )
          }
          onOpenRelocation={(site) => {
            const habitationId = site.forHabitation ?? "HAB-001";
            navigate(`/commander/relocation?habitation=${habitationId}`);
          }}
        />
      </section>

      {compareNotice ? (
        <p className="map-search-message" role="status" style={{ marginTop: 8 }}>
          {compareNotice}
        </p>
      ) : null}

      <section className="habitations-table-panel" style={{ marginTop: 8 }}>
        <div className="panel-head">
          <h3>
            Candidate Site Table <small>({rows.length}) — Demo Data</small>
          </h3>

          <div className="table-filters">
            <label className="sr-only" htmlFor="filter-site-state">
              Filter by state
            </label>
            <select
              id="filter-site-state"
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value)}
            >
              <option value="all">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-tier">
              Filter by suitability
            </label>
            <select
              id="filter-tier"
              value={tierFilter}
              onChange={(event) => setTierFilter(event.target.value)}
            >
              <option value="all">All Suitability Tiers</option>
              <option value={SITE_TIER.HIGH}>{SITE_TIER_LABEL[SITE_TIER.HIGH]}</option>
              <option value={SITE_TIER.SUITABLE}>{SITE_TIER_LABEL[SITE_TIER.SUITABLE]}</option>
              <option value={SITE_TIER.NEEDS_ASSESSMENT}>
                {SITE_TIER_LABEL[SITE_TIER.NEEDS_ASSESSMENT]}
              </option>
              <option value={SITE_TIER.LIMITED}>{SITE_TIER_LABEL[SITE_TIER.LIMITED]}</option>
              <option value={SITE_TIER.REJECTED}>{SITE_TIER_LABEL[SITE_TIER.REJECTED]}</option>
            </select>

            <label className="sr-only" htmlFor="filter-site-query">
              Search sites
            </label>
            <input
              id="filter-site-query"
              type="search"
              placeholder="Search site or district"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Site</th>
                <th scope="col">District / State</th>
                <th scope="col">Suitability</th>
                <th scope="col">Capacity</th>
                <th scope="col">Residual Hazard</th>
                <th scope="col">Road Access</th>
                <th scope="col">Services</th>
                <th scope="col">Verification</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10} className="table-empty">
                    No candidate sites match the current filters.
                  </td>
                </tr>
              ) : (
                visible.map((row, index) => (
                  <tr
                    key={row.id}
                    className={selected?.id === row.id ? "selected" : ""}
                    tabIndex={0}
                    onClick={() => setSelected(row)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(row);
                      }
                    }}
                  >
                    <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="emphasis">{row.name}</td>
                    <td>
                      {row.district}
                      <small> ({row.state})</small>
                    </td>
                    <td>
                      {row.tier ? (
                        <TierBadge tier={row.tier} label={SITE_TIER_LABEL[row.tier]} />
                      ) : (
                        `${row.suitability}/100`
                      )}
                    </td>
                    <td>{nf.format(row.capacity)}</td>
                    <td>{row.residualHazard ?? "—"}</td>
                    <td>{row.roadAccess ?? row.factors?.roadAccessibility ?? "—"}</td>
                    <td>{row.servicesLevel ?? row.infrastructure ?? "—"}</td>
                    <td>{row.verification ?? "—"}</td>
                    <td>{row.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, rows.length)} of {rows.length}
          </span>

          <div className="pager">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="analytics-grid analytics-grid-4">
        <article className="analytics-card">
          <header>
            <h3>Capacity Distribution</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={capacityDist} margin={{ left: -20, right: 8, top: 4, bottom: 4 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: "#9fc0d4", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#9fc0d4", fontSize: 10 }} axisLine={false} tickLine={false} />
              <ChartTooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#071a27",
                  border: "1px solid rgba(90,140,170,0.35)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#38bdf8" radius={[3, 3, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
          <p className="panel-footnote">Estimated safe capacity (people)</p>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Suitability Breakdown</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={suitabilityDist}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
              >
                {suitabilityDist.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <ChartTooltip
                contentStyle={{
                  background: "#071a27",
                  border: "1px solid rgba(90,140,170,0.35)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul className="chart-legend chart-legend-stacked">
            {suitabilityDist.map((slice) => (
              <li key={slice.name}>
                <span className="legend-dot" style={{ background: slice.color }} aria-hidden="true" />
                {slice.name}
                <strong>{slice.value}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Verification Status</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={verificationDist}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
              >
                {verificationDist.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <ChartTooltip
                contentStyle={{
                  background: "#071a27",
                  border: "1px solid rgba(90,140,170,0.35)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul className="chart-legend chart-legend-stacked">
            {verificationDist.map((slice) => (
              <li key={slice.name}>
                <span className="legend-dot" style={{ background: slice.color }} aria-hidden="true" />
                {slice.name}
                <strong>{slice.value}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Top-Ranked Candidate Sites</h3>
            <DemoDataBadge label="By Score" />
          </header>

          <ul className="rank-list">
            {topRanked.map((site, index) => (
              <li key={site.id}>
                <span className="rank-index">{index + 1}</span>
                <div className="rank-body">
                  <strong>
                    {site.name}
                    <small> ({site.state})</small>
                  </strong>
                  <div className="rank-bar">
                    <div
                      className="rank-bar-fill"
                      style={{
                        width: `${site.suitability}%`,
                        background: "linear-gradient(90deg, #22c55e, #4ade80)",
                      }}
                    />
                  </div>
                </div>
                <span className="rank-value">{site.suitability}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="panel-primary-action"
            onClick={() => setPage(1)}
          >
            <Building2 size={14} aria-hidden="true" />
            View All Candidate Sites
          </button>
        </article>
      </section>
    </>
  );
}

export default CandidateSitesPage;
