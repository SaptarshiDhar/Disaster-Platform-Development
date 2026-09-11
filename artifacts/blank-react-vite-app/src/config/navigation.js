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

/**
 * Command-centre navigation.
 *
 * Every entry has a real route. Modules that are not yet built resolve to a
 * module-placeholder page rather than a dead button, so navigation never
 * appears broken.
 */
export const commandNavigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    to: "/commander",
    end: true,
  },
  {
    label: "Hazard Intelligence",
    icon: TriangleAlert,
    to: "/commander/hazards",
    children: [
      { label: "Landslide", to: "/commander/hazards?hazard=landslide" },
      { label: "Flood", to: "/commander/hazards?hazard=flood" },
      { label: "Multi-Hazard", to: "/commander/hazards?hazard=multiHazard" },
    ],
  },
  {
    label: "Population & Exposure",
    icon: Users,
    to: "/commander/exposure",
  },
  {
    label: "Vulnerable Habitations",
    icon: Home,
    to: "/commander/habitations",
  },
  {
    label: "Relocation Planning",
    icon: Route,
    to: "/commander/relocation",
  },
  {
    label: "Candidate Sites",
    icon: MapPinned,
    to: "/commander/sites",
  },
  {
    label: "Incident Reports",
    icon: MessageSquare,
    to: "/commander/incidents",
    badgeKey: "incidents",
  },
  {
    label: "Alerts & Early Warning",
    icon: Bell,
    to: "/commander/alerts",
    badgeKey: "alerts",
  },
  {
    label: "Reports & Analytics",
    icon: BarChart3,
    to: "/commander/reports",
  },
  {
    label: "Scenario Simulation",
    icon: SlidersHorizontal,
    to: "/commander/simulation",
  },
  {
    label: "Data Management",
    icon: Database,
    to: "/commander/data",
  },
  {
    label: "System Settings",
    icon: Settings,
    to: "/commander/settings",
  },
];
