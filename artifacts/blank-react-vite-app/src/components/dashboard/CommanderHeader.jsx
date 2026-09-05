
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

function CommanderHeader({ onLogout }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

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
        <div className="commander-logo">
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

        <button className="notification-button">
          <Bell size={20} />

          <span className="notification-count">6</span>
        </button>

        <div className="commander-profile">
          <div className="profile-avatar">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>Commander</strong>
            <span>NDRF / SDMA</span>
          </div>
        </div>

        <button
          className="logout-icon-button"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default CommanderHeader;
