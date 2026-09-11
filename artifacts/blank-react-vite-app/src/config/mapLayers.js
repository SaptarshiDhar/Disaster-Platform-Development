/**
 * RAKSHA — map layer registry.
 *
 * This module is the single place where map data providers are declared, so
 * that swapping a prototype overlay for a real government service later is a
 * configuration change rather than a component rewrite.
 *
 * IMPORTANT — provider honesty rules:
 *   1. No Bhuvan or GSI endpoint is invented here. Where a real service URL is
 *      not yet known, `url` is null and `status` is 'planned'. The UI renders
 *      those layers from local demo geometry and labels them as such.
 *   2. OpenStreetMap is used for road / accessibility / locational context
 *      only. It is NOT presented as an authoritative source of national or
 *      state political boundaries.
 *   3. Anything with `classification: 'demo'` must be visibly badged wherever
 *      it is drawn or summarised.
 */

/** How much trust a layer's data carries. Drives the UI badge. */
export const CLASSIFICATION = {
  OFFICIAL: 'official',
  DERIVED: 'derived',
  DEMO: 'demo',
};

export const CLASSIFICATION_LABEL = {
  official: 'Official Source',
  derived: 'Derived Dataset',
  demo: 'Demo Data',
};

/**
 * Base maps. Only OSM is wired up today; the government basemaps are declared
 * so the integration point exists, but carry no guessed URL.
 */
export const baseMaps = {
  osm: {
    id: 'osm',
    title: 'OpenStreetMap',
    status: 'active',
    classification: CLASSIFICATION.OFFICIAL,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
    note: 'Road, settlement and accessibility context. Not an authoritative political boundary source.',
  },

  bhuvanBase: {
    id: 'bhuvanBase',
    title: 'ISRO Bhuvan (planned)',
    status: 'planned',
    classification: CLASSIFICATION.OFFICIAL,
    url: null,
    attribution: 'ISRO / NRSC Bhuvan',
    note: 'Intended primary government basemap. Endpoint and access terms to be confirmed before integration.',
  },
};

/**
 * Thematic overlays. `source: 'local-demo'` means the geometry ships with the
 * frontend as illustrative sample data and represents nothing real.
 */
export const thematicLayers = {
  gsiLandslide: {
    id: 'gsiLandslide',
    title: 'Landslide Susceptibility',
    group: 'hazard',
    status: 'planned',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    futureSource: 'Geological Survey of India',
    note: 'Prototype polygons. Future integration: GSI landslide susceptibility mapping.',
  },

  floodLayer: {
    id: 'floodLayer',
    title: 'Flood Hazard',
    group: 'hazard',
    status: 'planned',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    futureSource: 'IIT Delhi India Flood Inventory / IMD',
    note: 'Prototype polygons. Future integration: national flood inventory datasets.',
  },

  multiHazardLayer: {
    id: 'multiHazardLayer',
    title: 'Multi-Hazard Composite',
    group: 'hazard',
    status: 'planned',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    futureSource: 'Derived from GSI + flood + terrain inputs',
    note: 'Prototype composite. No scientific weighting has been applied.',
  },

  worldPop: {
    id: 'worldPop',
    title: 'Population Density',
    group: 'population',
    status: 'planned',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    futureSource: 'WorldPop',
    note: 'Prototype density markers. Future integration: WorldPop gridded population.',
  },

  populationExposure: {
    id: 'populationExposure',
    title: 'Population Exposure',
    group: 'population',
    status: 'planned',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    futureSource: 'Derived: WorldPop x hazard extent',
    note: 'Prototype overlay. Exposure requires a real population raster to compute.',
  },

  osmRoads: {
    id: 'osmRoads',
    title: 'Roads & Accessibility',
    group: 'infrastructure',
    status: 'active',
    source: 'osm',
    classification: CLASSIFICATION.OFFICIAL,
    url: null,
    futureSource: 'OpenStreetMap',
    note: 'Rendered as part of the OSM base map in this prototype.',
  },

  habitations: {
    id: 'habitations',
    title: 'Habitations',
    group: 'assets',
    status: 'active',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    note: 'Prototype habitation records used to demonstrate the assessment workflow.',
  },

  incidents: {
    id: 'incidents',
    title: 'Incident Reports',
    group: 'assets',
    status: 'active',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    note: 'Prototype incident reports. Not live field reporting.',
  },

  candidateSites: {
    id: 'candidateSites',
    title: 'Candidate Relocation Sites',
    group: 'assets',
    status: 'active',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    note: 'Prototype candidate sites for relocation planning demonstration.',
  },

  facilities: {
    id: 'facilities',
    title: 'Hospitals & Schools',
    group: 'infrastructure',
    status: 'active',
    source: 'local-demo',
    classification: CLASSIFICATION.DEMO,
    url: null,
    futureSource: 'OpenStreetMap / state infrastructure registries',
    note: 'Prototype facility markers.',
  },
};

/** Convenience: every layer that currently has no real upstream service. */
export function getPlannedIntegrations() {
  return Object.values(thematicLayers).filter(
    (layer) => layer.status === 'planned',
  );
}

export function getLayer(id) {
  return thematicLayers[id] ?? baseMaps[id] ?? null;
}
