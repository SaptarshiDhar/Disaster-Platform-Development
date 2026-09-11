import { useCallback, useMemo, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

import CommanderHeader from "../dashboard/CommanderHeader";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import HazardTabs from "../dashboard/HazardTabs";
import { logout } from "../../services/authService";

import "../../styles/commander-dashboard.css";

/**
 * Shared chrome for every authenticated command-centre route: header, hazard
 * mode tabs, prototype notice and sidebar.
 *
 * The active hazard mode lives in the URL (`?hazard=`) rather than in local
 * state so that it survives a refresh and can be linked to directly from the
 * sidebar sub-navigation.
 */
function CommandShell() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hazardMode = searchParams.get("hazard") ?? "landslide";

  const setHazardMode = useCallback(
    (mode) => {
      const next = new URLSearchParams(searchParams);
      next.set("hazard", mode);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [navigate]);

  // Passed down through the router outlet so pages share hazard mode without
  // prop drilling through intermediate layout components.
  const outletContext = useMemo(
    () => ({ hazardMode, setHazardMode }),
    [hazardMode, setHazardMode],
  );

  return (
    <div className="commander-app">
      <CommanderHeader
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <div className="hazard-navigation-bar">
        <HazardTabs activeHazard={hazardMode} onChange={setHazardMode} />
      </div>

      <div className="prototype-warning" role="note">
        <TriangleAlert size={16} aria-hidden="true" />
        <strong>FRONTEND PROTOTYPE:</strong>
        <span>
          Hazard extents, population figures, incidents, capacity estimates and
          relocation recommendations shown here are demonstration data. They are
          not official datasets and not an evacuation or relocation order.
        </span>
      </div>

      <div className={`commander-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
        <DashboardSidebar
          onNavigate={() => setSidebarOpen(false)}
          onSetHazard={setHazardMode}
        />

        <main className="commander-main" id="main-content">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}

export default CommandShell;
