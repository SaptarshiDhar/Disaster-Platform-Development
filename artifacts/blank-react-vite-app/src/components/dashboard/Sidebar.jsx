
import {
  BarChart3,
  Bell,
  Database,
  Home,
  LayoutDashboard,
  MapPinned,
  MessageSquare,
  Route,
  Settings,
  SlidersHorizontal,
  TriangleAlert,
  Users,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
  },

  {
    label: "Hazard Intelligence",
    icon: TriangleAlert,
    active: true,
  },

  {
    label: "Population & Exposure",
    icon: Users,
  },

  {
    label: "Vulnerable Habitations",
    icon: Home,
  },

  {
    label: "Relocation Planning",
    icon: Route,
  },

  {
    label: "Candidate Sites",
    icon: MapPinned,
  },

  {
    label: "Incident Reports",
    icon: MessageSquare,
    badge: "24",
  },

  {
    label: "Alerts & Early Warning",
    icon: Bell,
    badge: "6",
  },

  {
    label: "Reports & Analytics",
    icon: BarChart3,
  },

  {
    label: "Scenario Simulation",
    icon: SlidersHorizontal,
  },

  {
    label: "Data Management",
    icon: Database,
  },

  {
    label: "System Settings",
    icon: Settings,
  },
];

function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <nav>
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`sidebar-item ${
                item.active ? "active" : ""
              }`}
            >
              <Icon size={18} />

              <span>{item.label}</span>

              {item.badge && (
                <span className="sidebar-badge">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-prototype-note">
        <TriangleAlert size={17} />

        <div>
          <strong>Prototype Mode</strong>

          <p>
            Hazard and exposure values currently
            use development mock data.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
