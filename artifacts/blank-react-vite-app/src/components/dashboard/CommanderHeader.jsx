import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, LogOut, Menu, ShieldCheck } from "lucide-react";

import { earlyWarningAlerts } from "../../data/mockIncidents";
import { getCurrentUser } from "../../services/authService";

/**
 * Command-centre header: identity, live clock, alerts and sign-out.
 */
function CommanderHeader({ onLogout, onToggleSidebar }) {
  const [now, setNow] = useState(() => new Date());
  const [alertsOpen, setAlertsOpen] = useState(false);
  const alertsRef = useRef(null);

  const user = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Close the alert popover on outside click or Escape.
  useEffect(() => {
    if (!alertsOpen) return undefined;

    const onPointerDown = (event) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setAlertsOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setAlertsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [alertsOpen]);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="commander-header">
      <div className="commander-brand">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <div className="commander-logo" aria-hidden="true">
          <ShieldCheck size={31} />
        </div>

        <div>
          <h1>NDRF / SDMA COMMAND CENTER</h1>
          <p>
            Disaster Relocation Decision Intelligence Platform
            <span className="header-sih">SIH26191</span>
          </p>
        </div>
      </div>

      <div className="commander-account">
        <div className="header-time">
          <strong>{time}</strong>
          <span>{date}</span>
        </div>

        <div className="alerts-wrapper" ref={alertsRef}>
          <button
            type="button"
            className="notification-button"
            onClick={() => setAlertsOpen((open) => !open)}
            aria-expanded={alertsOpen}
            aria-label={`Alerts and early warnings, ${earlyWarningAlerts.length} active`}
          >
            <Bell size={20} aria-hidden="true" />
            <span className="notification-count">
              {earlyWarningAlerts.length}
            </span>
          </button>

          {alertsOpen ? (
            <div className="alerts-popover" role="dialog" aria-label="Active advisories">
              <header>
                <strong>Active Advisories</strong>
                <span className="demo-badge-inline">Demo Data</span>
              </header>

              <ul>
                {earlyWarningAlerts.slice(0, 5).map((alert) => (
                  <li key={alert.id}>
                    <span className={`alert-dot level-${alert.level.replace(/\s+/g, "-").toLowerCase()}`} aria-hidden="true" />
                    <div>
                      <strong>{alert.title}</strong>
                      <span>
                        {alert.area} · {alert.level} · {alert.issued}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="commander-profile">
          <div className="profile-avatar" aria-hidden="true">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>{user?.displayName ?? "Commander"}</strong>
            <span>{user?.unit ?? "NDRF / SDMA"}</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-icon-button"
          onClick={onLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={19} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export default CommanderHeader;
