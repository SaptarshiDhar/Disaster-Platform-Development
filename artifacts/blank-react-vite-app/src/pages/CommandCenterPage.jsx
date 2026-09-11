import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Bell,
  Home,
  MapPinned,
  Radio,
  TriangleAlert,
  Users,
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
import SelectedHabitationPanel from "../components/dashboard/SelectedHabitationPanel";
import RakshaMap from "../components/gis/RakshaMap";
import MapToolbar from "../components/gis/MapToolbar";
import MapLayersPanel from "../components/gis/MapLayersPanel";
import MapLegend from "../components/gis/MapLegend";
import { DemoDataBadge, ProvenanceNote } from "../components/common/Badges";

import {
  getCriticalDistricts,
  getDashboardStats,
  getExposureBreakdown,
  getRecentIncidents,
  getRegion,
} from "../services/dashboardService";
import { listHabitations } from "../services/habitationService";
import { getLayerProvenance } from "../services/hazardService";
import { candidateSites } from "../data/mockCandidateSites";
import { incidentReports } from "../data/mockIncidents";

const nf = new Intl.NumberFormat("en-IN");

const LAYER_GROUPS = [
  {
    title: "Hazard Layers",
    items: [{ key: "hazard", label: "Hazard Extent", layerId: "gsiLandslide" }],
  },
  {
    title: "Exposure Layers",
    items: [
      { key: "populationExposure", label: "Population Exposure", layerId: "populationExposure" },
      { key: "habitations", label: "Habitations", layerId: "habitations" },
    ],
  },
  {
    title: "Context Layers",
    items: [
      { key: "candidateSites", label: "Candidate Sites", layerId: "candidateSites" },
      { key: "incidents", label: "Incident Reports", layerId: "incidents" },
    ],
  },
];

const DEFAULT_LAYERS = {
  hazard: true,
  populationExposure: true,
  habitations: true,
  candidateSites: false,
  incidents: true,
};

const RISK_LEGEND = [
  { label: "Very High", colour: "#ef4444" },
  { label: "High", colour: "#f97316" },
  { label: "Moderate", colour: "#facc15" },
  { label: "Low", colour: "#4ade80" },
];

/**
 * Command centre. Serves both the Overview route and the Hazard Intelligence
 * route; `mode` only changes the framing copy and which analytics are shown,
 * so the two stay visually consistent without duplicating the layout.
 */
function CommandCenterPage({ mode = "overview" }) {
  const navigate = useNavigate();
  const { hazardMode } = useOutletContext();

  const [stats, setStats] = useState(null);
  const [habitations, setHabitations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [exposureBands, setExposureBands] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const [regionId, setRegionId] = useState("india");
  const [query, setQuery] = useState("");
  const [layersOpen, setLayersOpen] = useState(true);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getDashboardStats(),
      listHabitations(),
      getExposureBreakdown(),
      getCriticalDistricts(5),
      getRecentIncidents(5),
    ]).then(([s, h, e, d, i]) => {
      if (!active) return;
      setStats(s);
      setHabitations(h);
      setSelected((current) => current ?? h[0] ?? null);
      setExposureBands(e);
      setDistricts(d);
      setIncidents(i);
    });

    return () => {
      active = false;
    };
  }, []);

  const region = useMemo(() => getRegion(regionId), [regionId]);
  const provenance = useMemo(
    () => getLayerProvenance(hazardMode),
    [hazardMode],
  );

  const handleSearch = (value) => {
    const q = value.trim().toLowerCase();

    if (!q) {
      setSearchMessage("");
      return;
    }

    const found = habitations.find(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q),
    );

    if (!found) {
      setSearchMessage(`No prototype habitation matches "${value}".`);
      return;
    }

    setSearchMessage("");
    setSelected(found);
  };

  const toggleLayer = (key) =>
    setLayers((current) => ({ ...current, [key]: !current[key] }));

  const totalExposed = exposureBands.reduce((sum, b) => sum + b.value, 0);

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>
            {mode === "hazard" ? "Hazard Intelligence" : "Command Overview"}
          </h2>
          <p>
            {mode === "hazard"
              ? "Hazard extents, affected habitations and exposure for the selected hazard mode."
              : "National situational picture across all prototype hazard layers."}
          </p>
        </div>
        <DemoDataBadge label="Demo Dataset" />
      </div>

      <section className="stat-grid" aria-label="Key indicators">
        <StatCard
          icon={Home}
          label="CRITICAL HABITATIONS"
          value={stats ? stats.criticalHabitations : "—"}
          subtitle="High / Very High risk"
          tone="red"
        />
        <StatCard
          icon={Users}
          label="POPULATION AT RISK"
          value={stats ? nf.format(stats.populationAtRisk) : "—"}
          subtitle="Prototype estimate"
          tone="blue"
        />
        <StatCard
          icon={TriangleAlert}
          label="IMMEDIATE RELOCATION"
          value={stats ? stats.immediateRelocation : "—"}
          subtitle="Requires review"
          tone="red"
        />
        <StatCard
          icon={MapPinned}
          label="CANDIDATE SITES"
          value={stats ? stats.candidateSites : "—"}
          subtitle="Prototype catalogue"
          tone="green"
        />
        <StatCard
          icon={Radio}
          label="ACTIVE INCIDENTS"
          value={stats ? stats.activeIncidents : "—"}
          subtitle="Demo field reports"
          tone="orange"
        />
        <StatCard
          icon={Bell}
          label="ADVISORIES"
          value={stats ? stats.alerts : "—"}
          subtitle="Demo advisories"
          tone="yellow"
        />
      </section>

      <section className="workspace-grid">
        <div className="map-workspace">
          <MapToolbar
            regionId={regionId}
            onRegionChange={setRegionId}
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            onToggleLayers={() => setLayersOpen((open) => !open)}
            layersOpen={layersOpen}
          />

          {searchMessage ? (
            <p className="map-search-message" role="status">
              {searchMessage}
            </p>
          ) : null}

          <div className="map-stage">
            <RakshaMap
              region={region}
              hazardMode={hazardMode}
              habitations={habitations}
              selectedHabitation={selected}
              onSelectHabitation={setSelected}
              layers={layers}
              candidateSites={candidateSites}
              incidents={incidentReports}
            />

            <MapLegend
              title={`Risk Level (${hazardMode === "multiHazard" ? "Multi-Hazard" : hazardMode})`}
              items={RISK_LEGEND}
              note={provenance ? provenance.note : undefined}
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

        <SelectedHabitationPanel
          habitation={selected}
          onOpenRelocation={(habitation) =>
            navigate(`/commander/relocation?habitation=${habitation.id}`)
          }
        />
      </section>

      <section className="analytics-grid">
        <article className="analytics-card">
          <header>
            <h3>Population Exposed</h3>
            <DemoDataBadge />
          </header>

          <div className="chart-holder">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={exposureBands}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {exposureBands.map((band) => (
                    <Cell key={band.name} fill={band.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  contentStyle={{
                    background: "#071a27",
                    border: "1px solid rgba(90,140,170,0.35)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                  formatter={(value) => nf.format(value)}
                />
              </PieChart>
            </ResponsiveContainer>

            <ul className="chart-legend">
              {exposureBands.map((band) => (
                <li key={band.name}>
                  <span
                    className="legend-dot"
                    style={{ background: band.color }}
                    aria-hidden="true"
                  />
                  {band.name}
                  <strong>{nf.format(band.value)}</strong>
                </li>
              ))}
            </ul>
          </div>

          <ProvenanceNote>
            Total {nf.format(totalExposed)} · Prototype data — future WorldPop
            integration
          </ProvenanceNote>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Top Critical Districts</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={districts}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="district"
                width={92}
                tick={{ fill: "#9fc0d4", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#071a27",
                  border: "1px solid rgba(90,140,170,0.35)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(value) => [nf.format(value), "Exposed (demo)"]}
              />
              <Bar dataKey="value" fill="#ef4444" radius={[0, 3, 3, 0]} barSize={13} />
            </BarChart>
          </ResponsiveContainer>

          <ProvenanceNote>
            Exposed population by district, derived from prototype habitations
          </ProvenanceNote>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Recent Incidents</h3>
            <DemoDataBadge />
          </header>

          <ul className="incident-list">
            {incidents.map((incident) => (
              <li key={incident.id}>
                <span
                  className={`incident-dot sev-${incident.severity
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  aria-hidden="true"
                />
                <div>
                  <strong>{incident.place}</strong>
                  <span>
                    {incident.type} · {incident.district}, {incident.state}
                  </span>
                </div>
                <time>{incident.time}</time>
              </li>
            ))}
          </ul>

          <ProvenanceNote>
            Demonstration reports. Not live field reporting.
          </ProvenanceNote>
        </article>
      </section>
    </>
  );
}

export default CommandCenterPage;
