import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Clock, Home, Layers3, TriangleAlert, Users } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts";

import StatCard from "../components/dashboard/StatCard";
import SelectedHabitationPanel from "../components/dashboard/SelectedHabitationPanel";
import RakshaMap from "../components/gis/RakshaMap";
import MapLegend from "../components/gis/MapLegend";
import {
  DemoDataBadge,
  PriorityBadge,
  RiskBadge,
  StatusBadge,
} from "../components/common/Badges";

import {
  getAssessmentStatusDistribution,
  getHabitationSummary,
  getHabitationsByHazard,
  getPriorityDistribution,
  getStates,
  listHabitations,
} from "../services/habitationService";
import { getRegion } from "../services/dashboardService";
import { RELOCATION_PRIORITY } from "../data/mockHabitations";

const nf = new Intl.NumberFormat("en-IN");
const PAGE_SIZE = 10;

const PRIORITY_LEGEND = [
  { label: "Immediate", colour: "#ef4444" },
  { label: "Short-Term", colour: "#f97316" },
  { label: "Medium-Term", colour: "#facc15" },
];

/**
 * Vulnerable Habitations.
 *
 * Map, prioritised table and detail panel stay in sync: selecting a marker
 * highlights the row, and selecting a row moves the panel and the map focus.
 */
function HabitationsPage() {
  const navigate = useNavigate();
  const { hazardMode } = useOutletContext();

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [priorityDist, setPriorityDist] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [byHazard, setByHazard] = useState([]);
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState(null);

  const [stateFilter, setStateFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    Promise.all([
      getHabitationSummary(),
      getPriorityDistribution(),
      getAssessmentStatusDistribution(),
      getHabitationsByHazard(),
      getStates(),
    ]).then(([s, p, st, h, stateList]) => {
      if (!active) return;
      setSummary(s);
      setPriorityDist(p);
      setStatusDist(st);
      setByHazard(h);
      setStates(stateList);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    listHabitations({
      state: stateFilter,
      priority: priorityFilter,
      query,
    }).then((result) => {
      if (!active) return;
      setRows(result);
      setPage(1);
      setSelected((current) => {
        if (current && result.some((item) => item.id === current.id)) {
          return current;
        }
        return result[0] ?? null;
      });
    });

    return () => {
      active = false;
    };
  }, [stateFilter, priorityFilter, query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Follow the selection on the map rather than staying at the national view.
  const region = useMemo(() => {
    if (!selected) return getRegion("india");
    return { center: selected.coordinates, zoom: 8 };
  }, [selected]);

  const maxHazardCount = byHazard.length
    ? Math.max(...byHazard.map((item) => item.count))
    : 1;

  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Vulnerable Habitations</h2>
          <p>
            Which habitations are most vulnerable, why, and what action comes
            next.
          </p>
        </div>
        <DemoDataBadge label="Demo Dataset" />
      </div>

      <section className="stat-grid stat-grid-6" aria-label="Habitation indicators">
        <StatCard
          icon={Home}
          label="VULNERABLE HABITATIONS"
          value={summary ? summary.total : "—"}
          subtitle="In prototype dataset"
          tone="blue"
        />
        <StatCard
          icon={TriangleAlert}
          label="IMMEDIATE PRIORITY"
          value={summary ? summary.immediate : "—"}
          subtitle="Requires review"
          tone="red"
        />
        <StatCard
          icon={Clock}
          label="SHORT-TERM"
          value={summary ? summary.shortTerm : "—"}
          subtitle="Planned horizon"
          tone="orange"
        />
        <StatCard
          icon={Clock}
          label="MEDIUM-TERM"
          value={summary ? summary.mediumTerm : "—"}
          subtitle="Planned horizon"
          tone="yellow"
        />
        <StatCard
          icon={Users}
          label="POPULATION EXPOSED"
          value={summary ? nf.format(summary.populationExposed) : "—"}
          subtitle="Prototype estimate"
          tone="blue"
        />
        <StatCard
          icon={Layers3}
          label="MULTI-HAZARD"
          value={summary ? summary.multiHazard : "—"}
          subtitle="More than one hazard"
          tone="green"
        />
      </section>

      <section className="habitations-grid">
        <div className="habitations-map">
          <div className="panel-head">
            <h3>Habitation Priority Map</h3>
          </div>

          <div className="map-stage map-stage-short">
            <RakshaMap
              region={region}
              hazardMode={hazardMode}
              habitations={rows}
              selectedHabitation={selected}
              onSelectHabitation={setSelected}
              layers={{ habitations: true, hazard: true }}
            />

            <MapLegend
              title="Relocation Priority"
              items={PRIORITY_LEGEND}
              note="Prototype prioritisation. Requires commander review."
            />
          </div>
        </div>

        <div className="habitations-table-panel">
          <div className="panel-head">
            <h3>
              Prioritised Habitation List <small>({rows.length})</small>
            </h3>

            <div className="table-filters">
              <label className="sr-only" htmlFor="filter-state">
                Filter by state
              </label>
              <select
                id="filter-state"
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

              <label className="sr-only" htmlFor="filter-priority">
                Filter by priority
              </label>
              <select
                id="filter-priority"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value={RELOCATION_PRIORITY.IMMEDIATE}>Immediate</option>
                <option value={RELOCATION_PRIORITY.SHORT_TERM}>Short-Term</option>
                <option value={RELOCATION_PRIORITY.MEDIUM_TERM}>Medium-Term</option>
              </select>

              <label className="sr-only" htmlFor="filter-query">
                Search habitations
              </label>
              <input
                id="filter-query"
                type="search"
                placeholder="Search habitation or district"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Habitation</th>
                  <th scope="col">District / State</th>
                  <th scope="col">Population</th>
                  <th scope="col">Primary Hazard</th>
                  <th scope="col">Exposure</th>
                  <th scope="col">Overall Risk</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Access</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="table-empty">
                      No habitations match the current filters.
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
                      <td>{nf.format(row.population)}</td>
                      <td>{row.primaryHazard}</td>
                      <td>{row.exposurePct}%</td>
                      <td>
                        <RiskBadge level={row.overallRisk} />
                      </td>
                      <td>
                        <PriorityBadge level={row.relocationPriority} />
                      </td>
                      <td>{row.accessibility}</td>
                      <td>
                        <StatusBadge status={row.assessmentStatus} />
                      </td>
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
            <h3>Priority Distribution</h3>
            <DemoDataBadge />
          </header>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={priorityDist}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={2}
              >
                {priorityDist.map((slice) => (
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

          <ul className="chart-legend">
            {priorityDist.map((slice) => (
              <li key={slice.name}>
                <span
                  className="legend-dot"
                  style={{ background: slice.color }}
                  aria-hidden="true"
                />
                {slice.name}
                <strong>{slice.value}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Exposure by Hazard</h3>
            <DemoDataBadge />
          </header>

          <ul className="bar-list">
            {byHazard.map((row) => (
              <li key={row.hazard}>
                <span>{row.hazard}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(row.count / maxHazardCount) * 100}%`,
                      background: row.color,
                    }}
                  />
                </div>
                <strong>{row.count}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Assessment Status</h3>
            <DemoDataBadge />
          </header>

          <ul className="chart-legend chart-legend-stacked">
            {statusDist.map((slice) => (
              <li key={slice.name}>
                <span
                  className="legend-dot"
                  style={{ background: slice.color }}
                  aria-hidden="true"
                />
                {slice.name}
                <strong>{slice.value}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <header>
            <h3>Next Actions</h3>
          </header>

          <div className="action-stack">
            <button type="button" className="panel-primary-action">
              View Full Assessment
            </button>
            <button
              type="button"
              className="panel-primary-action"
              onClick={() =>
                selected &&
                navigate(`/commander/relocation?habitation=${selected.id}`)
              }
              disabled={!selected}
            >
              Open Relocation Analysis
            </button>
            <button type="button" className="panel-secondary-action">
              Request Field Verification
            </button>
            <button type="button" className="panel-secondary-action">
              Add to Relocation Plan
            </button>
          </div>

          <p className="panel-footnote">
            Actions are prototype placeholders pending backend workflow.
          </p>
        </article>
      </section>
    </>
  );
}

export default HabitationsPage;
