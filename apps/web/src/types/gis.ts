/**
 * GIS type vocabulary.
 *
 * RAKSHA stores and exchanges geometry in EPSG:4326 (longitude/latitude in
 * degrees) and renders it with MapLibre. Any measurement in metres must first
 * be reprojected — see src/lib/gis/crs.ts.
 */

/** A coordinate reference system identified by its EPSG code. */
export type EpsgCode = `EPSG:${number}`;

/** Storage, interchange and web-mapping CRS. Degrees — never metres. */
export const CRS_WGS84 = 'EPSG:4326' as const satisfies EpsgCode;

/**
 * Web Mercator. Used by tile pyramids only. Its metre units are distorted by
 * latitude, so it is *not* valid for distance or area analysis.
 */
export const CRS_WEB_MERCATOR = 'EPSG:3857' as const satisfies EpsgCode;

/** [longitude, latitude] in EPSG:4326 — GeoJSON axis order. */
export type LngLat = readonly [longitude: number, latitude: number];

/** [west, south, east, north] in EPSG:4326. */
export type BoundingBox = readonly [
  west: number,
  south: number,
  east: number,
  north: number,
];

export type GeometryKind =
  | 'Point'
  | 'MultiPoint'
  | 'LineString'
  | 'MultiLineString'
  | 'Polygon'
  | 'MultiPolygon';

/** How a layer is drawn. Kept separate from the data itself. */
export type LayerRenderKind = 'fill' | 'line' | 'circle' | 'symbol' | 'raster';

export type LayerDefinition = {
  id: string;
  title: string;
  renderKind: LayerRenderKind;
  /** Whether the layer is visible when the map first mounts. */
  defaultVisible: boolean;
  /** Shown in the legend so users know how much to trust the layer. */
  description?: string;
};
