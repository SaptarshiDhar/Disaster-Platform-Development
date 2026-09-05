import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Home,
  Layers3,
  MapPinned,
  Radio,
  Search,
  TriangleAlert,
  Users,
} from "lucide-react";

import CommanderHeader from "../components/dashboard/CommanderHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import HazardTabs from "../components/dashboard/HazardTabs";
import StatCard from "../components/dashboard/StatCard";
import DisasterMap from "../components/dashboard/DisasterMap";
import LayerControlPanel from "../components/dashboard/LayerControlPanel";
import HabitationPanel from "../components/dashboard/HabitationPanel";
import AnalyticsGrid from "../components/dashboard/AnalyticsGrid";

import {
  dashboardStats,
  regionOptions,
} from "../data/mockDashboard";

import { mockHabitations } from "../data/mockHabitations";

import "../styles/commander-dashboard.css";

function CommanderDashboard() {
  const navigate = useNavigate();

  const [activeHazard, setActiveHazard] =
    useState("landslide");

  const [
    selectedHabitation,
    setSelectedHabitation,
  ] = useState(mockHabitations[0]);

  const [regionId, setRegionId] =
    useState("india");

  const [query, setQuery] =
    useState("");

  const [layerPanelOpen, setLayerPanelOpen] =
    useState(true);

  const [layers, setLayers] = useState({
    population: true,
    habitations: true,
    incidents: true,
    candidateSites: false,
  });

  const region =
    regionOptions.find(
      (item) => item.id === regionId
    ) || regionOptions[0];

  const handleLogout = () => {
    localStorage.removeItem(
      "sih_commander_logged_in"
    );

    localStorage.removeItem(
      "sih_user"
    );

    navigate("/");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const normalized =
      query.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    const found =
      mockHabitations.find(
        (habitation) =>
          habitation.name
            .toLowerCase()
            .includes(normalized) ||
          habitation.district
            .toLowerCase()
            .includes(normalized) ||
          habitation.state
            .toLowerCase()
            .includes(normalized)
      );

    if (!found) {
      alert(
        "No matching prototype habitation found."
      );

      return;
    }

    setSelectedHabitation(found);

    const matchingRegion =
      regionOptions.find(
        (item) =>
          item.label.toLowerCase() ===
          found.state.toLowerCase()
      );

    if (matchingRegion) {
      setRegionId(
        matchingRegion.id
      );
    }
  };

  return (
    <div className="commander-app">
      <CommanderHeader
        onLogout={handleLogout}
      />

      <div className="hazard-navigation-bar">
        <HazardTabs
          activeHazard={activeHazard}
          onChange={setActiveHazard}
        />
      </div>

      <div className="prototype-warning">
        <TriangleAlert size={16} />

        <strong>
          FRONTEND PROTOTYPE:
        </strong>

        Hazard polygons, exposed-population
        values, incidents and relocation
        priorities shown below are mock
        development data.

        <span>
          OpenStreetMap is the live base
          map.
        </span>
      </div>

      <div className="commander-layout">
        <DashboardSidebar />

        <main className="commander-main">
          {/* KPI CARDS */}

          <section className="stat-grid">
            <StatCard
              icon={Home}
              label="CRITICAL HABITATIONS"
              value={
                dashboardStats.criticalHabitations
              }
              subtitle="Prototype nationwide view"
              tone="red"
            />

            <StatCard
              icon={Users}
              label="POPULATION AT RISK"
              value={dashboardStats.populationAtRisk.toLocaleString()}
              subtitle="Future: WorldPop intersection"
              tone="blue"
            />

            <StatCard
              icon={TriangleAlert}
              label="IMMEDIATE RELOCATION"
              value={
                dashboardStats.immediateRelocation
              }
              subtitle="Decision-engine output"
              tone="red"
            />

            <StatCard
              icon={MapPinned}
              label="CANDIDATE SITES"
              value={
                dashboardStats.candidateSites
              }
              subtitle="Prototype candidates"
              tone="green"
            />

            <StatCard
              icon={Radio}
              label="ACTIVE INCIDENTS"
              value={
                dashboardStats.activeIncidents
              }
              subtitle="Citizen + field reports"
              tone="orange"
            />

            <StatCard
              icon={Bell}
              label="ALERTS"
              value={dashboardStats.alerts}
              subtitle="Requires attention"
              tone="yellow"
            />
          </section>

          {/* MAP + HABITATION */}

          <section className="workspace-grid">
            <div className="map-workspace">
              <div className="map-toolbar">
                <select
                  value={regionId}
                  onChange={(event) =>
                    setRegionId(
                      event.target.value
                    )
                  }
                >
                  {regionOptions.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>

                <form
                  className="map-search"
                  onSubmit={handleSearch}
                >
                  <Search size={17} />

                  <input
                    type="text"
                    value={query}
                    onChange={(event) =>
                      setQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search state, district or habitation"
                  />

                  <button type="submit">
                    Search
                  </button>
                </form>

                <button
                  className="layers-button"
                  onClick={() =>
                    setLayerPanelOpen(
                      !layerPanelOpen
                    )
                  }
                >
                  <Layers3 size={17} />
                  Layers
                </button>
              </div>

              <div className="map-stage">
                <DisasterMap
                  activeHazard={
                    activeHazard
                  }
                  habitations={
                    mockHabitations
                  }
                  selectedHabitation={
                    selectedHabitation
                  }
                  onSelectHabitation={
                    setSelectedHabitation
                  }
                  layers={layers}
                  region={region}
                />

                {layerPanelOpen && (
                  <LayerControlPanel
                    layers={layers}
                    setLayers={setLayers}
                    onClose={() =>
                      setLayerPanelOpen(
                        false
                      )
                    }
                  />
                )}
              </div>
            </div>

            <HabitationPanel
              habitation={
                selectedHabitation
              }
            />
          </section>

          <AnalyticsGrid />
        </main>
      </div>
    </div>
  );
}

export default CommanderDashboard;