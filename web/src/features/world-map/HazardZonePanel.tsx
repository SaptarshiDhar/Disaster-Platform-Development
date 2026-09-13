"use client";

import { AlertTriangle, CircleSlash, Layers3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HazardAssessment, HazardBundle } from "@/lib/hazards/contract";
import type { ZoneResult } from "@/lib/hazards/zone-engine";

const HAZARD_LABEL: Record<string, string> = {
  FLOOD: "Flood",
  LANDSLIDE: "Landslide",
  CLOUDBURST: "Cloudburst",
  COASTAL_EROSION: "Coastal erosion",
};

const KIND_LABEL: Record<string, string> = {
  probability: "probability",
  susceptibility_score: "susceptibility",
  warning_level: "warning level",
};

const BAND_STYLE: Record<string, string> = {
  LOW: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  MODERATE: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  HIGH: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  "VERY HIGH": "text-red-400 border-red-500/30 bg-red-500/10",
};

function HazardRow({ hazard }: { hazard: HazardAssessment }) {
  const ready = hazard.status === "ready" && hazard.primary;

  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className="text-xs text-foreground">{HAZARD_LABEL[hazard.hazardType]}</div>
        {ready && hazard.primary ? (
          <div className="text-[10px] text-muted-foreground">
            {KIND_LABEL[hazard.primary.kind] ?? hazard.primary.kind}
            {hazard.primary.horizon ? ` · ${hazard.primary.horizon}` : ""}
            {hazard.primary.value !== null
              ? ` · ${hazard.primary.value.toFixed(2)}`
              : ""}
          </div>
        ) : (
          <div className="text-[10px] leading-relaxed text-amber-400">
            {hazard.status.replace(/_/g, " ")}
            {hazard.statusDetail ? ` — ${hazard.statusDetail.slice(0, 110)}` : ""}
          </div>
        )}
      </div>

      <div className="shrink-0">
        {ready && hazard.primary?.band ? (
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
              BAND_STYLE[hazard.primary.band] ?? ""
            }`}
          >
            {hazard.primary.band}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}

export function HazardZonePanel({
  bundle,
  zone,
}: {
  bundle: HazardBundle;
  zone: ZoneResult;
}) {
  const unclassified = zone.zone === "UNCLASSIFIED";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              Multi-hazard zone
            </div>
            <span className="text-[10px] text-muted-foreground">worst band wins</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            {unclassified ? (
              <CircleSlash className="h-6 w-6 text-muted-foreground" />
            ) : (
              <span
                className="inline-block h-7 w-7 rounded-md"
                style={{ backgroundColor: zone.color }}
              />
            )}
            <div>
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {zone.zone}
              </div>
              {zone.governingHazard ? (
                <div className="text-[11px] text-muted-foreground">
                  set by {HAZARD_LABEL[zone.governingHazard]} at {zone.governingBand}
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{zone.note}</p>

          {zone.partial ? (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>Partial coverage.</strong> {zone.gaps.length} of{" "}
                {bundle.hazards.length} hazards could not be assessed here. An unassessed
                hazard is a gap, not an absence of risk.
              </span>
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <div>
              Data quality: <span className="text-foreground">{zone.dataQuality ?? "—"}</span>
            </div>
            <div>
              Weakest domain:{" "}
              <span className="text-foreground">
                {zone.weakestDomain?.replace(/_/g, " ") ?? "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <div className="text-sm font-medium text-foreground">Hazards at this point</div>
          <div className="mt-2 divide-y divide-border">
            {bundle.hazards.map((h) => (
              <HazardRow key={h.hazardType} hazard={h} />
            ))}
          </div>
          <p className="mt-3 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            These measures are not the same quantity. Flood reports a calibrated
            probability, landslide reports a relative susceptibility and a rule-based
            warning level. They are combined by band, never averaged numerically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
