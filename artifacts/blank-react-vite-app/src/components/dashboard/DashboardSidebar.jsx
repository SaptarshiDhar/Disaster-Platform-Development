import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, TriangleAlert } from "lucide-react";

import { commandNavigation } from "../../config/navigation";
import { earlyWarningAlerts, incidentReports } from "../../data/mockIncidents";

/**
 * Command-centre sidebar.
 *
 * Every item routes. Counts on the badges are derived from the prototype
 * datasets so they cannot drift away from the pages they link to.
 */
const badgeCounts = {
  incidents: incidentReports.length,
  alerts: earlyWarningAlerts.length,
};

function DashboardSidebar({ onNavigate, onSetHazard }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(() =>
    location.pathname.startsWith("/commander/hazards") ? "Hazard Intelligence" : null,
  );

  const handleSubItem = (event, to) => {
    event.preventDefault();

    const [path, search] = to.split("?");
    const hazard = new URLSearchParams(search).get("hazard");

    if (hazard) {
      onSetHazard?.(hazard);
    }

    navigate(`${path}${search ? `?${search}` : ""}`);
    onNavigate?.();
  };

  return (
    <aside className="dashboard-sidebar" aria-label="Command centre sections">
      <nav>
        {commandNavigation.map((item) => {
          const Icon = item.icon;
          const hasChildren = Array.isArray(item.children);
          const isOpen = expanded === item.label;
          const count = item.badgeKey ? badgeCounts[item.badgeKey] : null;

          return (
            <div key={item.label} className="sidebar-group">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "active" : ""}`
                }
                onClick={(event) => {
                  if (hasChildren) {
                    setExpanded(isOpen ? null : item.label);
                  }
                  if (!event.defaultPrevented) {
                    onNavigate?.();
                  }
                }}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>

                {count ? (
                  <span className="sidebar-badge">
                    {count}
                    <span className="sr-only"> items</span>
                  </span>
                ) : null}

                {hasChildren ? (
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`sidebar-chevron ${isOpen ? "open" : ""}`}
                  />
                ) : null}
              </NavLink>

              {hasChildren && isOpen ? (
                <div className="sidebar-subnav">
                  {item.children.map((child) => {
                    const hazard = new URLSearchParams(
                      child.to.split("?")[1],
                    ).get("hazard");

                    const isActive =
                      location.pathname.startsWith("/commander/hazards") &&
                      (new URLSearchParams(location.search).get("hazard") ??
                        "landslide") === hazard;

                    return (
                      <a
                        key={child.label}
                        href={child.to}
                        className={`sidebar-subitem ${isActive ? "active" : ""}`}
                        onClick={(event) => handleSubItem(event, child.to)}
                      >
                        {child.label}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-prototype-note">
        <TriangleAlert size={17} aria-hidden="true" />
        <div>
          <strong>Prototype Mode</strong>
          <p>
            Hazard, exposure and capacity values are demonstration data pending
            backend and GIS integration.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
