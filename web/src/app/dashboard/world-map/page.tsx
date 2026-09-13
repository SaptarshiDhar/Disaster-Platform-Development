"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Globe2, Play, RefreshCw, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorldMap, type AnalysisShape } from "@/features/world-map/WorldMap";
import {
  HAZARD_ACCENT,
  HazardModeToggle,
  type HazardMode,
} from "@/features/world-map/HazardModeToggle";
import { LocationSearch, type ResolvedLocation } from "@/features/world-map/LocationSearch";
import {
  INDIA_CAMERA_BOUNDS,
  INDIA_BOUNDS,
  INDIA_CENTER,
  INDIA_DEFAULT_ZOOM,
  isInsideIndiaBounds,
} from "@/features/world-map/india";
import { WarningHorizonSelector, type WarningHorizon } from "@/features/landslide/components/WarningHorizonSelector";
import { LandslideWarningPanel } from "@/features/landslide/components/LandslideWarningPanel";
import { LandslideResultPanel } from "@/features/landslide/components/LandslideResultPanel";
import { LandslideExplanation } from "@/features/landslide/components/LandslideExplanation";
import type { LandslideAssessment } from "@/features/landslide/types";
import type { PredictionResponse } from "@/features/flood-prediction/types";
import { CloudburstSimulationForm } from "@/features/cloudburst/components/CloudburstSimulationForm";
import { CloudburstHorizonOutlook } from "@/features/cloudburst/components/CloudburstHorizonOutlook";
import type { CloudburstAlert, CloudburstScenarioInput } from "@/features/cloudburst/types";
import { HazardZonePanel } from "@/features/world-map/HazardZonePanel";
import type { HazardBundle } from "@/lib/hazards/contract";
import type { ZoneResult } from "@/lib/hazards/zone-engine";

// This map is scoped to India. The initial camera sits at the geographic
// centre; nothing is derived from it, and every value shown comes from the
// coordinate the user actually picks.
const INITIAL_VIEW: ResolvedLocation = {
  latitude: INDIA_CENTER.latitude,
  longitude: INDIA_CENTER.longitude,
  name: null,
};

const BAND_COLOR: Record<string, string> = {
  LOW: "#22c55e",
  MODERATE: "#eab308",
  HIGH: "#f97316",
  "VERY HIGH": "#ef4444",
};

export default function WorldMapPage() {
  const [mode, setMode] = useState<HazardMode>("landslide");
  const [location, setLocation] = useState<ResolvedLocation>(INITIAL_VIEW);
  const [landslide, setLandslide] = useState<LandslideAssessment | null>(null);
  const [flood, setFlood] = useState<PredictionResponse | null>(null);
  const [multi, setMulti] = useState<(HazardBundle & { zone: ZoneResult }) | null>(null);
  const [cloudburst, setCloudburst] = useState<CloudburstAlert | null>(null);
  const [cbSourceMode, setCbSourceMode] = useState<"LIVE" | "SIMULATED">("LIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [horizon, setHorizon] = useState<WarningHorizon>("24h");
  const [outsideRegion, setOutsideRegion] = useState(false);

  // Monotonic id: any response whose id is not the latest is discarded, so a
  // slow request for an old coordinate can never overwrite a newer one.
  const requestIdRef = useRef(0);

  function resetResults() {
    requestIdRef.current++;
    setLandslide(null);
    setFlood(null);
    setMulti(null);
    setCloudburst(null);
    setError(null);
    setLoading(false);
  }

  function handleLocationChange(loc: ResolvedLocation) {
    resetResults();
    // The engines work for any coordinate, but this map is scoped to India, so
    // a point outside the region is flagged rather than silently assessed.
    setOutsideRegion(!isInsideIndiaBounds(loc.latitude, loc.longitude));
    setLocation(loc);
  }

  function handleModeChange(next: HazardMode) {
    if (next === mode) return;
    // Results are hazard-specific; never show a flood result under a landslide
    // heading or vice versa.
    resetResults();
    setMode(next);
  }

  const runCloudburst = useCallback(
    async (scenario?: CloudburstScenarioInput) => {
      if (!isInsideIndiaBounds(location.latitude, location.longitude)) {
        setError(
          "This map covers India. Move the marker inside the region to run an assessment."
        );
        return;
      }
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      const sourceMode = scenario ? "SIMULATED" : "LIVE";

      try {
        const res = await fetch("/api/cloudburst/alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            location_name: location.name,
            source_mode: sourceMode,
            scenario: scenario ?? undefined,
          }),
        });
        const body = await res.json();
        if (requestId !== requestIdRef.current) return; // stale

        if (!res.ok) {
          setError(body?.message ?? body?.detail?.message ?? "Cloudburst alert failed.");
          return;
        }
        setCloudburst(body as CloudburstAlert);
      } catch {
        if (requestId !== requestIdRef.current) return;
        setError("Could not reach the cloudburst engine (port 8030).");
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [location]
  );

  const runAssessment = useCallback(async () => {
    if (mode === "cloudburst") {
      // LIVE cloudburst runs through the Run button below like every other
      // mode; SIMULATED is triggered from the scenario form's own submit,
      // which calls runCloudburst(scenario) directly.
      await runCloudburst();
      return;
    }

    if (!isInsideIndiaBounds(location.latitude, location.longitude)) {
      setError(
        "This map covers India. Move the marker inside the region to run an assessment."
      );
      return;
    }
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    const endpoint =
      mode === "landslide"
        ? "/api/landslide/assess"
        : mode === "multi"
          ? "/api/hazards/assess"
          : "/api/flood/predict/live";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          location_name: location.name,
        }),
      });
      const body = await res.json();
      if (requestId !== requestIdRef.current) return; // stale

      if (!res.ok) {
        setError(body?.message ?? body?.detail?.message ?? "Assessment failed.");
        return;
      }
      if (mode === "landslide") setLandslide(body as LandslideAssessment);
      else if (mode === "multi") setMulti(body as HazardBundle & { zone: ZoneResult });
      else setFlood(body as PredictionResponse);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setError(
        mode === "landslide"
          ? "Could not reach the landslide engine (port 8020)."
          : mode === "multi"
            ? "Could not reach the hazard backend."
            : "Could not reach the flood engine (FLOOD_MODEL_API_URL)."
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [mode, location, runCloudburst]);

  // Auto-refresh: a forecast-driven warning goes stale. The interval comes
  // from the engine's own validity_minutes rather than a hardcoded number, so
  // it always matches the forecast cache TTL and never spams the provider.
  const validityMinutes = landslide?.warnings?.validity_minutes ?? 30;
  const runRef = useRef(runAssessment);
  useEffect(() => {
    runRef.current = runAssessment;
  }, [runAssessment]);

  useEffect(() => {
    if (mode !== "landslide" || !landslide?.warnings?.available) return;
    const ms = Math.max(5, validityMinutes) * 60 * 1000;
    const timer = setInterval(() => runRef.current(), ms);
    return () => clearInterval(timer);
  }, [mode, landslide?.warnings?.available, validityMinutes]);

  const accent = HAZARD_ACCENT[mode];

  // In landslide mode the marker reflects the WARNING for the selected
  // horizon when one exists, falling back to the static susceptibility band.
  const horizonLevel = landslide?.warnings?.levels?.[horizon]?.level ?? null;
  const CB_COLOR: Record<string, string> = {
    LOW: "#22c55e",
    MODERATE: "#eab308",
    HIGH: "#f97316",
    VERY_HIGH: "#ef4444",
  };

  const markerColor =
    mode === "multi"
      ? (multi?.zone?.color ?? accent)
      : mode === "cloudburst"
        ? cloudburst?.highest_alert_next_24h
          ? CB_COLOR[cloudburst.highest_alert_next_24h] ?? accent
          : accent
        : mode === "landslide"
        ? horizonLevel
          ? BAND_COLOR[horizonLevel] ?? accent
          : landslide?.hazard_level
            ? BAND_COLOR[landslide.hazard_level] ?? accent
            : accent
        : flood?.forecasts?.["24h"]?.risk_color ?? accent;

  const analysis: AnalysisShape =
    mode === "landslide"
      ? landslide?.terrain?.footprint_m
        ? { kind: "square", sizeM: landslide.terrain.footprint_m }
        : { kind: "square", sizeM: 270 }
      : { kind: "circle", radiusKm: 6 };

  const caption =
    mode === "landslide"
      ? `Dashed box = DEM sampling footprint (~${
          landslide?.terrain?.footprint_m ?? 270
        } m). Not a mapped landslide extent.`
      : "Dashed circle = model analysis area (~6 km). Not a flood extent.";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Globe2 className="h-4.5 w-4.5" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">RAKSHA — India Hazard Map</h1>
          <Badge variant="info">AI MODEL — EXPERIMENTAL</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Search or click any location in India, then assess it for the selected hazard.
        </p>
        <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
          Experimental decision-support output. Not an official warning or an evacuation order, and
          it must be independently validated by competent authorities.
        </div>
      </div>

      {/* Controls + map */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-5">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Hazard mode
              </span>
              <HazardModeToggle mode={mode} onChange={handleModeChange} disabled={loading} />
            </div>

            <LocationSearch
              latitude={location.latitude}
              longitude={location.longitude}
              geocodeEndpoint={
                mode === "landslide" ? "/api/landslide/geocode" : "/api/flood/geocode"
              }
              onLocationChange={handleLocationChange}
            />

            {mode === "cloudburst" ? (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Cloudburst mode
                </span>
                <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-1">
                  {(["LIVE", "SIMULATED"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setCbSourceMode(m);
                        setCloudburst(null);
                        setError(null);
                      }}
                      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                        cbSourceMode === m
                          ? m === "LIVE"
                            ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-500/30"
                            : "bg-purple-500/15 text-purple-300 ring-1 ring-inset ring-purple-500/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m === "LIVE" ? "LIVE WEATHER" : "SIMULATION"}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {mode === "landslide" ? (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Warning horizon
                </span>
                <WarningHorizonSelector
                  horizon={horizon}
                  onChange={setHorizon}
                  result={landslide}
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <div className="text-[11px] text-muted-foreground">
                {location.name ?? "Map coordinates"} — {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </div>
              {landslide?.forecast_provenance?.fetched_at ? (
                <div className="text-[10px] text-muted-foreground">
                  Forecast {landslide.forecast_provenance.provider} · fetched{" "}
                  {new Date(landslide.forecast_provenance.fetched_at).toLocaleTimeString()} ·
                  auto-refresh every {validityMinutes} min
                </div>
              ) : null}
              {mode === "cloudburst" && cbSourceMode === "SIMULATED" ? (
                <CloudburstSimulationForm onRun={runCloudburst} loading={loading} />
              ) : (
                <>
                  <Button onClick={runAssessment} disabled={loading} className="w-full">
                    {loading ? (
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {loading
                      ? "Assessing..."
                      : mode === "landslide"
                        ? "Run Landslide Assessment"
                        : mode === "cloudburst"
                          ? "Run Live Cloudburst Alert"
                          : mode === "multi"
                            ? "Run Multi-Hazard Assessment"
                            : "Run Flood Forecast"}
                  </Button>
                  {(landslide || flood || multi || cloudburst) && !loading ? (
                    <Button variant="secondary" onClick={runAssessment} className="w-full">
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      Refresh
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="h-[460px]">
          <WorldMap
            latitude={location.latitude}
            longitude={location.longitude}
            zoom={location.name === null && !landslide && !flood ? INDIA_DEFAULT_ZOOM : 9}
            markerColor={markerColor}
            accentColor={accent}
            analysis={analysis}
            footprintCaption={caption}
            maxBounds={INDIA_CAMERA_BOUNDS}
            regionOutline={INDIA_BOUNDS}
            onMapClick={(lat, lon) =>
              handleLocationChange({ latitude: lat, longitude: lon, name: null })
            }
          />
        </div>
      </div>

      {outsideRegion ? (
        <Card>
          <CardContent className="pt-5">
            <div className="text-sm font-medium text-foreground">Outside the mapped region</div>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-300">
              This map covers India. The selected point lies outside it, so no assessment is run
              here. The engines themselves remain coordinate-driven.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <CardContent className="pt-5">
            <div className="text-sm font-medium text-foreground">Assessment unavailable</div>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-300">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {!landslide && !flood && !multi && !cloudburst && !error && !loading ? (
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">
              Pick a location and run an assessment. Every value shown is fetched for the
              coordinate you choose.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Landslide result */}
      {mode === "landslide" && landslide ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4">
            <LandslideResultPanel result={landslide} />
            <LandslideExplanation result={landslide} />
          </div>
          <LandslideWarningPanel result={landslide} horizon={horizon} />
        </div>
      ) : null}

      {/* Multi-hazard zone */}
      {mode === "multi" && multi ? (
        <HazardZonePanel bundle={multi} zone={multi.zone} />
      ) : null}

      {/* Cloudburst result */}
      {mode === "cloudburst" && cloudburst ? (
        <CloudburstHorizonOutlook alert={cloudburst} />
      ) : null}

      {/* Flood result — reuses the existing flood contract unchanged. */}
      {mode === "flood" && flood ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["24h", "48h"] as const).map((h) => {
            const f = flood.forecasts?.[h];
            if (!f) return null;
            return (
              <Card key={h}>
                <CardContent className="pt-5">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {h === "24h" ? "Next 24 hours" : "24–48 hours"}
                  </div>
                  <div className="mt-2 flex items-end gap-3">
                    <div className="text-4xl font-semibold tracking-tight text-foreground">
                      {(f.probability * 100).toFixed(0)}
                      <span className="ml-0.5 text-xl text-muted-foreground">%</span>
                    </div>
                    <div
                      className="mb-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold"
                      style={{ color: f.risk_color, borderColor: `${f.risk_color}55` }}
                    >
                      {f.risk_level}
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Experimental flood probability. Full detail on the Flood Prediction page.
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
