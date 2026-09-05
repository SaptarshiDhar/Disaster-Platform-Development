
import {
  Layers3,
  TriangleAlert,
  Users,
  Waves,
} from "lucide-react";

const tabs = [
  {
    id: "landslide",
    label: "LANDSLIDE",
    icon: TriangleAlert,
  },

  {
    id: "flood",
    label: "FLOOD",
    icon: Waves,
  },

  {
    id: "multiHazard",
    label: "MULTI-HAZARD",
    icon: Layers3,
  },

  {
    id: "exposure",
    label: "EXPOSURE",
    icon: Users,
  },
];

function HazardTabs({
  activeHazard,
  onChange,
}) {
  return (
    <div className="hazard-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            className={`hazard-tab ${tab.id} ${
              activeHazard === tab.id
                ? "active"
                : ""
            }`}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={19} />

            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default HazardTabs;
