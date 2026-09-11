import { CRS_WGS84, type BoundingBox, type LngLat } from '@/types/gis';

/**
 * Coordinate reference system helpers.
 *
 * The rule this module exists to enforce: **never compute distances or areas
 * from raw EPSG:4326 degrees.** A degree of longitude is ~111 km at the
 * equator and ~0 km at the poles, so naive Euclidean maths on lat/lng is
 * wrong by a latitude-dependent factor.
 *
 * Phase 0 provides only spherical great-circle distance, which is accurate
 * enough for coarse UI needs (nearest-site ordering, map fitting). Any
 * analytical measurement that feeds a published figure — usable safe area,
 * buffer zones, carrying capacity — must instead be computed in PostGIS
 * against an appropriate projected CRS. See selectMetricCrs below.
 */

const EARTH_RADIUS_METRES = 6_371_008.8;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Great-circle distance in metres between two EPSG:4326 points.
 *
 * Suitable for approximate ordering and display. Not a substitute for a
 * projected-CRS calculation in reporting or analysis.
 */
export function haversineDistanceMetres(a: LngLat, b: LngLat): number {
  const [lonA, latA] = a;
  const [lonB, latB] = b;

  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latA)) *
      Math.cos(toRadians(latB)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METRES * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Pick a projected CRS suitable for metric analysis at a given longitude.
 *
 * Returns a UTM zone (WGS 84 / UTM north), which is the pragmatic default for
 * India and keeps distortion low within the zone. Analysis that spans several
 * zones should instead use an equal-area CRS chosen deliberately and recorded
 * against the processing run.
 */
export function selectMetricCrs(longitudeDegrees: number): {
  epsg: `EPSG:${number}`;
  utmZone: number;
} {
  const normalised = ((longitudeDegrees + 180) % 360 + 360) % 360 - 180;
  const utmZone = Math.floor((normalised + 180) / 6) + 1;

  // 326xx is the WGS 84 / UTM northern-hemisphere block. India is entirely
  // north of the equator, so the southern block (327xx) is not needed here.
  return { epsg: `EPSG:${32600 + utmZone}`, utmZone };
}

/** Whether a bounding box is well-formed and within EPSG:4326 limits. */
export function isValidBoundingBox(bbox: BoundingBox): boolean {
  const [west, south, east, north] = bbox;

  return (
    west >= -180 &&
    east <= 180 &&
    south >= -90 &&
    north <= 90 &&
    west < east &&
    south < north
  );
}

/** The CRS all RAKSHA geometry is stored and exchanged in. */
export const STORAGE_CRS = CRS_WGS84;
