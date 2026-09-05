import {
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  criticalRegions,
  exposureBreakdown,
  incidentReports,
  riskTrend,
} from "../../data/mockDashboard";

function AnalyticsGrid() {
  const maxRegionValue = Math.max(
    ...criticalRegions.map(
      (region) => region.value
    )
  );

  return (
    <section className="analytics-grid">
      {/* POPULATION */}

      <article className="analytics-card">
        <div className="analytics-heading">
          POPULATION EXPOSED
          <span>Prototype</span>
        </div>

        <div className="population-chart-layout">
          <div className="donut-wrapper">
            <ResponsiveContainer
              width="100%"
              height={190}
            >
              <PieChart>
                <Pie
                  data={exposureBreakdown}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={1}
                >
                  {exposureBreakdown.map(
                    (entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="exposure-legend">
            {exposureBreakdown.map(
              (item) => (
                <div key={item.name}>
                  <i
                    style={{
                      background:
                        item.color,
                    }}
                  />

                  <span>
                    {item.name}
                  </span>

                  <strong>
                    {item.value.toLocaleString()}
                  </strong>
                </div>
              )
            )}
          </div>
        </div>

        <small className="analytics-source">
          Future population source:
          WorldPop processing
        </small>
      </article>

      {/* TREND */}

      <article className="analytics-card">
        <div className="analytics-heading">
          RISK TREND
          <span>7 Days</span>
        </div>

        <ResponsiveContainer
          width="100%"
          height={220}
        >
          <LineChart data={riskTrend}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,.14)"
            />

            <XAxis
              dataKey="day"
              stroke="#78909c"
            />

            <YAxis stroke="#78909c" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="veryHigh"
              stroke="#ef4444"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="high"
              stroke="#f97316"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="moderate"
              stroke="#facc15"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </article>

      {/* CRITICAL REGIONS */}

      <article className="analytics-card">
        <div className="analytics-heading">
          TOP CRITICAL REGIONS
          <span>Exposure</span>
        </div>

        <div className="critical-region-list">
          {criticalRegions.map(
            (region) => (
              <div
                key={region.name}
                className="critical-region"
              >
                <div>
                  <span>
                    {region.name}
                  </span>

                  <strong>
                    {region.value.toLocaleString()}
                  </strong>
                </div>

                <div className="region-bar">
                  <div
                    style={{
                      width: `${
                        (region.value /
                          maxRegionValue) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </article>

      {/* INCIDENTS */}

      <article className="analytics-card">
        <div className="analytics-heading">
          RECENT INCIDENTS
          <span>Prototype feed</span>
        </div>

        <div className="incident-list">
          {incidentReports.map(
            (incident) => (
              <div
                className="incident-row"
                key={incident.id}
              >
                <div className="incident-dot" />

                <div>
                  <strong>
                    {incident.place}
                  </strong>

                  <span>
                    {incident.type}
                  </span>
                </div>

                <time>
                  {incident.time}
                </time>
              </div>
            )
          )}
        </div>
      </article>
    </section>
  );
}

export default AnalyticsGrid;