import { floodEngineFetch } from "@/lib/flood-engine";
import { landslideEngineFetch } from "@/lib/landslide-engine";
import { cloudburstEngineFetch, CloudburstEngineRequestError } from "@/lib/cloudburst-engine";
import type { HazardAssessment, HazardBundle } from "./contract";
import {
  adaptCloudburst,
  adaptFlood,
  adaptLandslide,
  coastalErosionPlaceholder,
} from "./adapters";

/**
 * Common Hazard Backend.
 *
 * Fans one coordinate out to every hazard engine in parallel and returns them
 * in the shared contract. Engines are queried independently: one being down
 * degrades that hazard only, and never turns into a "no risk" answer for the
 * others.
 */

interface Input {
  latitude: number;
  longitude: number;
  locationName?: string | null;
}

async function safeFlood(input: Input): Promise<HazardAssessment> {
  try {
    const res = await floodEngineFetch("/predict/live", {
      method: "POST",
      body: JSON.stringify({
        latitude: input.latitude,
        longitude: input.longitude,
        location_name: input.locationName ?? null,
      }),
    });
    return adaptFlood(res as never);
  } catch (err) {
    return {
      hazardType: "FLOOD",
      status: "error",
      statusDetail:
        err instanceof Error ? err.message : "Flood engine unreachable.",
      primary: null,
      measures: [],
      domainStatus: "UNKNOWN",
      validatedRegion: null,
      dataQuality: null,
      model: null,
      generatedAt: null,
    };
  }
}

async function safeLandslide(input: Input): Promise<HazardAssessment> {
  try {
    const res = await landslideEngineFetch("/assess", {
      method: "POST",
      body: JSON.stringify({
        latitude: input.latitude,
        longitude: input.longitude,
        location_name: input.locationName ?? null,
      }),
    });
    return adaptLandslide(res as never);
  } catch (err) {
    return {
      hazardType: "LANDSLIDE",
      status: "error",
      statusDetail:
        err instanceof Error ? err.message : "Landslide engine unreachable.",
      primary: null,
      measures: [],
      domainStatus: "UNKNOWN",
      validatedRegion: null,
      dataQuality: null,
      model: null,
      generatedAt: null,
    };
  }
}

async function safeCloudburst(input: Input): Promise<HazardAssessment> {
  try {
    const res = await cloudburstEngineFetch("/alert", {
      method: "POST",
      body: JSON.stringify({
        latitude: input.latitude,
        longitude: input.longitude,
        location_name: input.locationName ?? null,
        source_mode: "LIVE",
      }),
    });
    return adaptCloudburst(res as never);
  } catch (err) {
    // A 4xx/5xx from the engine (e.g. validation) surfaces via
    // CloudburstEngineRequestError with the engine's own JSON body attached;
    // anything else (connection refused, timeout) has no body to read.
    const detail =
      err instanceof CloudburstEngineRequestError
        ? (err.body as { message?: string } | undefined)?.message ?? err.message
        : err instanceof Error
          ? err.message
          : "Cloudburst engine unreachable.";
    return {
      hazardType: "CLOUDBURST",
      status: "error",
      statusDetail: detail,
      primary: null,
      measures: [],
      domainStatus: "UNKNOWN",
      validatedRegion: null,
      dataQuality: null,
      model: null,
      generatedAt: null,
    };
  }
}

export async function assessAllHazards(input: Input): Promise<HazardBundle> {
  // Parallel, and each already failure-isolated.
  const [flood, landslide, cloudburst] = await Promise.all([
    safeFlood(input),
    safeLandslide(input),
    safeCloudburst(input),
  ]);

  return {
    location: {
      latitude: input.latitude,
      longitude: input.longitude,
      name: input.locationName ?? null,
    },
    hazards: [flood, landslide, cloudburst, coastalErosionPlaceholder()],
    generatedAt: new Date().toISOString(),
  };
}
