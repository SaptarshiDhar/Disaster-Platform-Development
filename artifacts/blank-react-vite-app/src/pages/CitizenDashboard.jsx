import { useState } from "react";
import {
  Bell,
  Check,
  Download,
  Home,
  Map,
  Menu,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import "../styles/citizen.css";

/**
 * Citizen Home Dashboard — frontend only, static demo data.
 *
 * No live alerts, GIS, or reporting workflow yet. Every action here is a
 * placeholder interaction until the citizen backend and reporting flow land.
 */

const DISTRICTS = ["Darjeeling District", "Kalimpong District", "Jalpaiguri District"];

const NEED_TILES = [
  {
    icon: TriangleAlert,
    tone: "tone-red",
    title: "Report Incident",
    subtitle: "Flood, landslide, road damage",
    action: "report",
  },
  {
    icon: Map,
    tone: "tone-blue",
    title: "Emergency Map",
    subtitle: "Shelters, hospitals, safe points",
  },
  {
    icon: TriangleAlert,
    tone: "tone-orange",
    title: "Alerts Near Me",
    subtitle: "Official warnings and updates",
  },
  {
    icon: ShieldCheck,
    tone: "tone-green",
    title: "Safety Guide",
    subtitle: "What to do before, during, after",
  },
];

const SITUATION_ROWS = [
  { label: "Landslide exposure", value: "HIGH", tone: "pill-high" },
  { label: "Flood exposure", value: "LOW", tone: "pill-low" },
  { label: "Citizen reports nearby", value: "7 unverified", tone: "pill-warn" },
];

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "report", label: "Report", icon: TriangleAlert },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "more", label: "More", icon: Menu },
];

function CitizenDashboard() {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [pickingDistrict, setPickingDistrict] = useState(false);
  const [packReady, setPackReady] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const reportIncident = () => alert("Incident reporting coming next.");

  return (
    <div className="citizen-app">
      <div className="citizen-shell">
        <header className="citizen-dash-header">
          <div className="citizen-dash-brand">
            <div className="citizen-shield small" aria-hidden="true" />
            <div>
              <h1>RAKSHA</h1>
              <p>Citizen Safety</p>
            </div>
          </div>

          <span className="citizen-online-badge">
            <span className="citizen-online-dot" aria-hidden="true" />
            ONLINE
          </span>
        </header>

        <div className="citizen-area-row">
          <div>
            <p className="label">Your area</p>
            <p className="value">{district}</p>
          </div>
          <button type="button" onClick={() => setPickingDistrict((v) => !v)}>
            Change
          </button>

          {pickingDistrict ? (
            <div className="citizen-district-menu">
              {DISTRICTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === district ? "active" : ""}
                  onClick={() => {
                    setDistrict(item);
                    setPickingDistrict(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="citizen-dash-content">
          <section className="citizen-hero">
            <h2>Stay aware. Act safely.</h2>
            <p>
              See verified alerts, report what you observe, and keep key
              safety information ready offline.
            </p>

            <button type="button" className="citizen-report-btn" onClick={reportIncident}>
              <TriangleAlert size={17} aria-hidden="true" />
              REPORT AN INCIDENT
            </button>
          </section>

          <section className="citizen-alert-card">
            <span className="citizen-alert-badge">OFFICIAL ALERT</span>
            <h3>Heavy rainfall warning in parts of the district</h3>
            <p>
              Follow instructions from local authorities. Avoid unnecessary
              travel in landslide-prone areas.
            </p>
            <p className="meta">Updated 18 min ago &nbsp;•&nbsp; Verified source</p>
          </section>

          <section>
            <div className="citizen-section-head" style={{ marginBottom: 12 }}>
              <h3>What do you need?</h3>
            </div>
            <div className="citizen-need-grid">
              {NEED_TILES.map(({ icon: Icon, tone, title, subtitle, action }) => (
                <button
                  key={title}
                  type="button"
                  className="citizen-need-card"
                  onClick={action === "report" ? reportIncident : undefined}
                >
                  <span className={`citizen-icon-badge ${tone}`}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="title">{title}</span>
                  <p>{subtitle}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="citizen-situation-card">
            <h3>Situation around you</h3>
            {SITUATION_ROWS.map((row) => (
              <div key={row.label} className="citizen-situation-row">
                <span className="label">{row.label}</span>
                <span className={`citizen-pill ${row.tone}`}>{row.value}</span>
              </div>
            ))}
            <p className="citizen-situation-note">
              Risk information is advisory. Follow official instructions.
            </p>
          </section>

          <section className="citizen-pack-card">
            <div className="citizen-pack-row">
              <span className="citizen-icon-badge tone-teal">
                {packReady ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Download size={16} aria-hidden="true" />
                )}
              </span>
              <div>
                <h3>Offline Emergency Pack</h3>
                <p>
                  Keep maps, safety guides and emergency contacts available
                  even if internet access is lost.
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`citizen-pack-btn ${packReady ? "ready" : ""}`}
              onClick={() => setPackReady(true)}
              disabled={packReady}
            >
              {packReady ? "EMERGENCY PACK READY" : "DOWNLOAD"}
            </button>
          </section>

          <section className="citizen-emergency-strip">
            Emergency? Call the appropriate official emergency service.
          </section>
        </div>
      </div>

      <nav className="citizen-bottom-nav" aria-label="Citizen navigation">
        <div className="citizen-bottom-nav-inner">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                className={`citizen-nav-item ${active ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default CitizenDashboard;
