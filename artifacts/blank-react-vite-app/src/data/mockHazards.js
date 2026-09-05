export const RISK_COLORS = {
  "Very High": "#ef4444",
  High: "#f97316",
  Moderate: "#facc15",
  Low: "#4ade80",
  "Very Low": "#15803d",
};

export const hazardPolygons = {
  landslide: [
    {
      id: "LS-01",
      name: "Prototype Uttarakhand Landslide Zone",
      risk: "Very High",

      positions: [
        [31.15, 78.1],
        [31.05, 80.35],
        [29.35, 80.25],
        [29.4, 78.25],
      ],
    },

    {
      id: "LS-02",
      name: "Prototype Northeast Landslide Zone",
      risk: "High",

      positions: [
        [27.8, 90.9],
        [27.75, 95.5],
        [24.9, 95.2],
        [25.05, 91.0],
      ],
    },

    {
      id: "LS-03",
      name: "Prototype Western Ghats Landslide Zone",
      risk: "High",

      positions: [
        [13.0, 74.8],
        [12.8, 77.1],
        [8.5, 77.2],
        [8.4, 75.0],
      ],
    },
  ],

  flood: [
    {
      id: "FL-01",
      name: "Prototype Bihar Flood Zone",
      risk: "Very High",

      positions: [
        [27.4, 83.1],
        [27.25, 88.2],
        [24.55, 88.0],
        [24.7, 83.3],
      ],
    },

    {
      id: "FL-02",
      name: "Prototype Assam Flood Zone",
      risk: "Very High",

      positions: [
        [28.0, 89.9],
        [28.0, 96.0],
        [25.0, 96.0],
        [24.9, 90.0],
      ],
    },

    {
      id: "FL-03",
      name: "Prototype Odisha Flood Zone",
      risk: "High",

      positions: [
        [21.6, 85.3],
        [21.4, 87.5],
        [19.2, 87.2],
        [19.3, 85.1],
      ],
    },
  ],

  multiHazard: [
    {
      id: "MH-01",
      name: "Prototype Northeast Multi-Hazard Zone",
      risk: "Very High",

      positions: [
        [28.0, 90.4],
        [27.9, 95.3],
        [25.0, 95.1],
        [25.0, 90.7],
      ],
    },

    {
      id: "MH-02",
      name: "Prototype Himalayan Multi-Hazard Zone",
      risk: "High",

      positions: [
        [31.2, 77.9],
        [31.05, 80.5],
        [29.3, 80.3],
        [29.35, 78.0],
      ],
    },

    {
      id: "MH-03",
      name: "Prototype Gangetic Multi-Hazard Zone",
      risk: "High",

      positions: [
        [27.4, 83.0],
        [27.25, 88.3],
        [24.5, 88.1],
        [24.6, 83.2],
      ],
    },

    {
      id: "MH-04",
      name: "Prototype Western Ghats Multi-Hazard Zone",
      risk: "Moderate",

      positions: [
        [13.1, 74.7],
        [12.9, 77.2],
        [8.5, 77.1],
        [8.3, 75.0],
      ],
    },
  ],
};