import { z } from 'zod';

/**
 * Reusable request-validation schemas.
 *
 * Every route handler parses its input through Zod before use — this is the
 * trust boundary. Values arrive as `unknown` and leave as typed data; `any` is
 * never used to skip the step.
 */

/** Longitude in EPSG:4326. */
export const longitudeSchema = z.number().min(-180).max(180);

/** Latitude in EPSG:4326. */
export const latitudeSchema = z.number().min(-90).max(90);

/** `[lng, lat]` — GeoJSON axis order, not `[lat, lng]`. */
export const lngLatSchema = z.tuple([longitudeSchema, latitudeSchema]);

/** `[west, south, east, north]`, refined so the box is non-degenerate. */
export const boundingBoxSchema = z
  .tuple([longitudeSchema, latitudeSchema, longitudeSchema, latitudeSchema])
  .refine(([west, south, east, north]) => west < east && south < north, {
    message: 'Bounding box must satisfy west < east and south < north',
  });

/**
 * Bounding box supplied as a query string, e.g. `?bbox=72.5,18.8,73.1,19.3`.
 */
export const boundingBoxQuerySchema = z
  .string()
  .transform((value) => value.split(',').map(Number))
  .pipe(boundingBoxSchema);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const uuidSchema = z.string().uuid();
