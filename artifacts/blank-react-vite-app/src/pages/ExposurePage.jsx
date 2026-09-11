import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Building2, Home, TriangleAlert, Users, UsersRound } from "lucide-react";
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
  POPULATION_PROVENANCE,
  getExposureByCategory,
  getExposureByHazard,
  getExposureSummary,
  getInfrastructurePoints,
  getMostExposedHabitations,
  getPopulationDensityPoints,
  getTopExposedDistricts,
} from "../services/exposureService";
import { listHabitations } from "../services/habitationService";
import { getRegion } from "../services/dashboardService";
import { incidentReports } from "../data/mockIncidents";
import { candidateSites } from "../data/mockCandidateSites";

const nf = new Intl.NumberFormat("en-IN");

const compact = (value) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
  return nf.format(value);
};

const LAYER_GROUPS = [
  {
    title: "Population",
    items: [
      { key: "populationDensity", label: "Population Density", layerId: "worldPop" },
      { key: "populationExposure", label: "Population Exposure", layerId: "populationExposure" },
      { key: "habitations", label: "Habitations", layerId: "habitations" },
    ],
  },
  {
    title: "Hazards",
    items: [{ key: "hazard", label: "Hazard Extent", layerId: "gsiLandslide" }],
  },
  {
    title: "Infrastructure",
    items: [
      { key: "facilities", label: "Hospitals & Schools", layerId: "facilities" },
      { key: "candidateSites", label: "Candidate Sites", layerId: "candidateSites" },
    ],
  },
  {
    title: "Context",
    items: [{ key: "incidents", label: "Incident Reports", layerId: "incidents" }],
  },
];

const DEFAULT_LAYERS = {
  populationDensity: true,
  populationExposure: true,
  habitations: true,
  hazard: true,
  facilities: true,
  candidateSites: true,
  incidents: false,
};

const DENSITY_LEGEND = [
  { label: "Very high density", colour: "#6b21a8" },
  { label: "High density", colour: "#a855f7" },
  { label: "Moderate density", colour: "#c4b5fd" },
  { label: "Hazard extent", colour: "#ef4444" },
];

/**
 * Population & Exposure.
 *
 * Answers: where are people concentrated, which of them sit inside hazard
 * extents, and which habitations carry the highest exposure.
 *
 * Population deliberately uses a violet ramp so it can never be mistaken for
 * the red/orange hazard severity ramp.
 */
function ExposurePage() {
  const navigate = useNavigate();
  const { hazardMode } = useOutletContext();

  const [summary, setSummary] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [byHazard, setByHazard] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mostExposed, setMostExposed] = useState([]);
  const [habitations, setHabitations] = useState([]);
  const [density, setDensity] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selected, setSelected] = useState(null);

  const [regionId, setRegionId] = useState("india");
  const [query, setQuery] = useState("");
  const [layersOpen, setLayersOpen] = useState(true);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getExposureSummary(),
      getExposureByCategory(),
      getExposureByHazard(),
      getTopExposedDistricts(5),
      getMostExposedHabitations(5),
      listHabitations(),
      getPopulationDensityPoints(),
      getInfrastructurePoints(),
    ]).then(([s, c, h, d, m, hab, den, inf]) => {
      if (!active) return;
      setSummary(s);
      setByCategory(c);
      setByHazard(h);
      setDistricts(d);
      setMostExposed(m);
      setHabitations(hab);
      setDensity(den);
      setFacilities(inf);
      setSelected((current) => current ?? hab[0] ?? null);
    });

    return () => {
      active = false;
    };
  }, []);

  const region = useMemo(() => getRegion(regionId), [regionId]);

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

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Population &amp; Exposure</h2>
          <p>
            Where population concentrates, how much of it falls inside hazard
            extents, and which habitations are most exposed.
          </p>
        </div>
        <DemoDataBadge label="Demo Dataset" />
      </div>

      <section className="stat-grid stat-grid-6" aria-label="Exposure indicators">
        <StatCard
          icon={UsersRound}
          label="POPULATION IN VIEW"
          value={summary ? compact(summary.populationInView) : "—"}
          subtitle="Prototype national figure"
          tone="blue"
        />
        <StatCard
          icon={Users}
          label="POPULATION EXPOSED"
          value={summary ? compact(summary.populationExposed) : "—"}
          subtitle="Within demo hazard extents"
          tone="orange"
        />
        <StatCard
          icon={TriangleAlert}
          label="VERY HIGH EXPOSURE"
          value={summary ? compact(summary.veryHighExposure) : "—"}
          subtitle="Highest severity band"
          tone="red"
        />
        <StatCard
          icon={Home}
          label="CRITICAL HABITATIONS"
          value={summary ? nf.format(summary.criticalHabitations) : "—"}
          subtitle="Prototype estimate"
          tone="red"
        />
        <StatCard
          icon={Building2}
          label="INFRASTRUCTURE EXPOSED"
          value={summary ? nf.format(summary.infrastructureExposed) : "—"}
          subtitle="Buildings, roads, facilities"
          tone="yellow"
        />
        <StatCard
          icon={Users}
          label="IMMEDIATE-PRIORITY POP."
          value={summary ? compact(summary.immediatePriorityPopulation) : "—"}
          subtitle="Requires review"
          tone="red"
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
            searchPlaceholder="Search state, district, city or habitation"
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
              densityPoints={density}
              infrastructure={facilities}
              candidateSites={candidateSites}
              incidents={incidentReports}
            />

            <MapLegend
              title="Population & Exposure"
              items={DENSITY_LEGEND}
              note="Population shown in violet; hazard severity in red/orange. Prototype data — future WorldPop integration."
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

      <section className="analytics-grid analytics-grid-4">
        <article className="analytics-card">
          <header>
            <h3>Exposure by Risk Category</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={2}
              >
                {byCategory.map((band) => (
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
                formatter={(value) => compact(value)}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul className="chart-legend">
            {byCategory.map((band) => (
              <li key={band.name}>
                <span
                  className="legend-dot"
                  style={{ background: band.color }}
                  aria-hidden="true"
                />
                {band.name}
                <strong>{compact(band.value)}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Top Exposed Districts</h3>
            <DemoDataBadge />
          </header>

          <ul className="rank-list">
            {districts.map((row, index) => (
              <li key={`${row.district}-${row.state}`}>
                <span className="rank-index">{index + 1}</span>
                <div className="rank-body">
                  <strong>
                    {row.district}
                    <small> ({row.state})</small>
                  </strong>
                  <div className="rank-bar">
                    <div
                      className="rank-bar-fill"
                      style={{
                        width: `${(row.exposed / districts[0].exposed) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="rank-value">{compact(row.exposed)}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Hazard-wise Exposed Population</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={byHazard}
              layout="vertical"
              margin={{ left: 6, right: 16, top: 4, bottom: 4 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="hazard"
                width={86}
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
                formatter={(value) => [compact(value), "Exposed (demo)"]}
              />
              <Bar dataKey="exposed" radius={[0, 3, 3, 0]} barSize={15}>
                {byHazard.map((row) => (
                  <Cell key={row.hazard} fill={row.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Most Exposed Habitations</h3>
            <DemoDataBadge />
          </header>

          <table className="mini-table">
            <thead>
              <tr>
                <th scope="col">Habitation</th>
                <th scope="col">District</th>
                <th scope="col">Exposed</th>
                <th scope="col">%</th>
              </tr>
            </thead>
            <tbody>
              {mostExposed.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelected(row)}
                  className={selected?.id === row.id ? "selected" : ""}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(row);
                    }
                  }}
                >
                  <td>{row.name}</td>
                  <td>
                    {row.district}
                    <small> ({row.state})</small>
                  </td>
                  <td>{nf.format(row.exposedPopulation)}</td>
                  <td className="emphasis">{row.exposurePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      <ProvenanceNote>{POPULATION_PROVENANCE}</ProvenanceNote>
    </>
  );
}

export default ExposurePage;
