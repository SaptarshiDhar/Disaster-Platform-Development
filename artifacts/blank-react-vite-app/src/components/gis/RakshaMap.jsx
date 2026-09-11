import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import { RISK_COLORS, hazardPolygons } from "../../data/mockHazards";
import { SITE_TIER_COLOUR } from "../../data/mockCandidateSites";
import { baseMaps } from "../../config/mapLayers";

/**
 * Shared GIS canvas for every command-centre view.
 *
 * Visual language rule: hazard severity uses the red/orange/yellow/green ramp,
 * while population uses a violet ramp. The two must stay distinguishable so a
 * dense population never reads as a severe hazard.
 *
 * Only the OpenStreetMap base layer is real. Every overlay below is drawn from
 * local demo geometry — see src/config/mapLayers.js.
 */

const POPULATION_COLOUR = "#a855f7";
const CANDIDATE_COLOUR = "#22c55e";
const INCIDENT_COLOUR = "#fb923c";

/** Marker colour per feed-item kind on the Incident Reports operation map. */
const FEED_KIND_COLOUR = {
  field: "#63dda2",
  civilian: "#38bdf8",
  critical: "#ef4444",
  resource: "#f97316",
};

function MapController({ region }) {
  const map = useMap();

  useEffect(() => {
    if (!region) return;
    map.flyTo(region.center, region.zoom, { duration: 1.1 });
  }, [map, region]);

  return null;
}

function RakshaMap({
  region,
  hazardMode = "landslide",
  habitations = [],
  selectedHabitation,
  onSelectHabitation,
  layers = {},
  densityPoints = [],
  candidateSites = [],
  selectedSiteId,
  onSelectSite,
  incidents = [],
  infrastructure = [],
  routes = [],
  originHabitation,
  feedMarkers = [],
  selectedFeedId,
  onSelectFeedItem,
  className = "disaster-map",
}) {
  const polygons =
    hazardMode === "exposure" ? [] : hazardPolygons[hazardMode] ?? [];

  const habitationColour = (habitation) => {
    if (hazardMode === "exposure") return POPULATION_COLOUR;
    const hazard = habitation.hazards?.[hazardMode];
    return RISK_COLORS[hazard?.level] ?? "#38bdf8";
  };

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        minZoom={4}
        maxZoom={14}
        className={className}
        scrollWheelZoom
      >
        <MapController region={region} />

        <TileLayer
          attribution={baseMaps.osm.attribution}
          url={baseMaps.osm.url}
          maxZoom={baseMaps.osm.maxZoom}
        />

        {/* Demo hazard extents */}
        {layers.hazard !== false &&
          polygons.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.positions}
              pathOptions={{
                color: RISK_COLORS[zone.risk],
                fillColor: RISK_COLORS[zone.risk],
                fillOpacity: 0.32,
                weight: 1.4,
              }}
            >
              <Tooltip sticky>
                <strong>{zone.name}</strong>
                <br />
                Demo risk class: {zone.risk}
                <br />
                <em>Prototype extent — not a GSI or IMD product</em>
              </Tooltip>
            </Polygon>
          ))}

        {/* Population density — violet, deliberately unlike the hazard ramp */}
        {layers.populationDensity &&
          densityPoints.map((point) => (
            <Circle
              key={point.id}
              center={point.coordinates}
              radius={point.density * 70}
              pathOptions={{
                color: POPULATION_COLOUR,
                fillColor: POPULATION_COLOUR,
                fillOpacity: 0.18,
                opacity: 0.35,
                weight: 1,
              }}
            >
              <Tooltip>
                <strong>{point.name}</strong>
                <br />
                Prototype density indicator
              </Tooltip>
            </Circle>
          ))}

        {/* Population exposure halo around each habitation */}
        {layers.populationExposure &&
          habitations.map((habitation) => (
            <Circle
              key={`exposure-${habitation.id}`}
              center={habitation.coordinates}
              radius={9000 + habitation.exposedPopulation * 2.4}
              pathOptions={{
                color: POPULATION_COLOUR,
                fillColor: POPULATION_COLOUR,
                fillOpacity: 0.1,
                opacity: 0.25,
                weight: 1,
              }}
            />
          ))}

        {/* Habitations */}
        {layers.habitations !== false &&
          habitations.map((habitation) => {
            const selected = selectedHabitation?.id === habitation.id;

            return (
              <CircleMarker
                key={habitation.id}
                center={habitation.coordinates}
                radius={selected ? 11 : 7}
                pathOptions={{
                  color: selected ? "#ffffff" : habitationColour(habitation),
                  fillColor: habitationColour(habitation),
                  fillOpacity: 0.9,
                  weight: selected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectHabitation?.(habitation),
                }}
              >
                <Tooltip>
                  <strong>{habitation.name}</strong>
                  <br />
                  {habitation.district}, {habitation.state}
                  <br />
                  Priority: {habitation.relocationPriority}
                  <br />
                  Exposure: {habitation.exposurePct}% (demo)
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* Origin marker for relocation planning */}
        {originHabitation ? (
          <CircleMarker
            center={originHabitation.coordinates}
            radius={12}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#ef4444",
              fillOpacity: 0.95,
              weight: 3,
            }}
          >
            <Tooltip permanent direction="top">
              <strong>{originHabitation.name}</strong> (origin)
            </Tooltip>
          </CircleMarker>
        ) : null}

        {/* Proposed routes — straight-line demo paths, not road-routed */}
        {routes.map((route) => (
          <Polyline
            key={`${route.from}-${route.to}`}
            positions={route.path}
            pathOptions={{
              color: "#facc15",
              weight: 2,
              dashArray: "6 6",
              opacity: 0.85,
            }}
          >
            <Tooltip sticky>
              Proposed corridor (demo, straight-line)
            </Tooltip>
          </Polyline>
        ))}

        {/* Candidate relocation sites — coloured by suitability tier */}
        {layers.candidateSites &&
          candidateSites.map((site) => {
            const selected = selectedSiteId === site.id;
            const fill = SITE_TIER_COLOUR[site.tier] ?? CANDIDATE_COLOUR;

            return (
              <CircleMarker
                key={site.id}
                center={site.coordinates}
                radius={selected ? 11 : 8}
                pathOptions={{
                  color: selected ? "#ffffff" : "#0b1a26",
                  fillColor: fill,
                  fillOpacity: 0.92,
                  weight: selected ? 3 : 1.5,
                }}
                eventHandlers={
                  onSelectSite ? { click: () => onSelectSite(site) } : undefined
                }
              >
                <Tooltip>
                  <strong>{site.name}</strong>
                  <br />
                  {site.district}, {site.state}
                  <br />
                  Prototype capacity: {site.capacity.toLocaleString("en-IN")}
                  <br />
                  Suitability: {site.suitability}/100 (demo)
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* Generic feed markers — Incident Reports operation map */}
        {feedMarkers.map((item) => {
          const selected = selectedFeedId === item.feedId;

          return (
            <CircleMarker
              key={item.feedId}
              center={item.coordinates}
              radius={selected ? 10 : 7}
              pathOptions={{
                color: selected ? "#ffffff" : "#0b1a26",
                fillColor: FEED_KIND_COLOUR[item.kind] ?? "#94a3b8",
                fillOpacity: 0.92,
                weight: selected ? 3 : 1.5,
              }}
              eventHandlers={
                onSelectFeedItem
                  ? { click: () => onSelectFeedItem(item) }
                  : undefined
              }
            >
              <Tooltip>
                <strong>{item.title}</strong>
                <br />
                {item.subtitle}
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Incident reports */}
        {layers.incidents &&
          incidents.map((incident) => (
            <CircleMarker
              key={incident.id}
              center={incident.coordinates}
              radius={6}
              pathOptions={{
                color: INCIDENT_COLOUR,
                fillColor: INCIDENT_COLOUR,
                fillOpacity: 0.85,
                weight: 1.2,
              }}
            >
              <Tooltip>
                <strong>{incident.type}</strong>
                <br />
                {incident.place}, {incident.state}
                <br />
                {incident.source} · {incident.time}
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Hospitals and schools */}
        {layers.facilities &&
          infrastructure.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.coordinates}
              radius={5}
              pathOptions={{
                color: point.type === "hospital" ? "#38bdf8" : "#63dda2",
                fillColor: point.type === "hospital" ? "#38bdf8" : "#63dda2",
                fillOpacity: 0.9,
                weight: 1,
              }}
            >
              <Tooltip>
                <strong>{point.name}</strong>
                <br />
                {point.type === "hospital" ? "Health facility" : "School"} (demo)
              </Tooltip>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}

export default RakshaMap;
