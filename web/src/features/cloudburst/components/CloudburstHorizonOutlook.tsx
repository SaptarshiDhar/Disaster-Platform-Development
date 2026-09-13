"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CloudburstAlert, CloudburstHorizonKey } from "../types";

const LEVEL_STYLE: Record<string, string> = {
  LOW: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  MODERATE: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  HIGH: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  VERY_HIGH: "text-red-400 border-red-500/30 bg-red-500/10",
};

const HORIZON_LABEL: Record<CloudburstHorizonKey, string> = {
  now: "NOW",
  "3h": "3H",
  "6h": "6H",
  "12h": "12H",
  "24h": "24H",
};

const ORDER: CloudburstHorizonKey[] = ["now", "3h", "6h", "12h", "24h"];

function LevelBadge({ level }: { level: string }) {
  if (level === "DATA_UNAVAILABLE") {
    return (
      <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
        unavailable
      </span>
    );
  }
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
        LEVEL_STYLE[level] ?? ""
      }`}
    >
      {level.replace(/_/g, " ")}
    </span>
  );
}

export function CloudburstHorizonOutlook({ alert }: { alert: CloudburstAlert }) {
  const highest = alert.highest_alert_next_24h;

  return (
    <div className="flex flex-col gap-4">
      {/* 24h summary */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              24-hour cloudburst outlook
            </div>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                alert.source_mode === "LIVE"
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "bg-purple-500/15 text-purple-300"
              }`}
            >
              {alert.source_mode === "LIVE" ? "LIVE WEATHER" : "SIMULATED SCENARIO"}
            </span>
          </div>

          {highest ? (
            <div className="mt-3 flex items-end gap-3">
              <div
                className={`inline-flex rounded-lg border px-3 py-1.5 text-lg font-semibold ${
                  LEVEL_STYLE[highest] ?? ""
                }`}
              >
                {highest.replace(/_/g, " ")}
              </div>
              {alert.peak_window ? (
                <span className="mb-1 text-[11px] text-muted-foreground">
                  peaks at {HORIZON_LABEL[alert.peak_window]}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="mt-3 text-2xl font-semibold text-muted-foreground">—</div>
          )}

          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {alert.engine_note}
          </p>

          {alert.source_mode === "SIMULATED" ? (
            <div className="mt-3 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-[11px] leading-relaxed text-purple-300">
              <strong>USER-SUPPLIED RAINFALL OVERRIDE.</strong> These values were entered
              manually and do not represent observed or forecast weather.
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Per-horizon breakdown */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Horizon breakdown
          </div>
          <div className="mt-3 divide-y divide-border">
            {ORDER.map((key) => {
              const h = alert.horizons[key];
              if (!h) return null;
              return (
                <div key={key} className="py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-foreground">
                      {HORIZON_LABEL[key]}
                      <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                        next {h.window_hours}h
                      </span>
                    </span>
                    <LevelBadge level={h.level} />
                  </div>
                  {h.available && h.reasons.length > 0 ? (
                    <ul className="mt-1 flex flex-col gap-0.5 pl-1">
                      {h.reasons.map((r, i) => (
                        <li key={i} className="text-[10px] leading-relaxed text-muted-foreground">
                          • {r}
                        </li>
                      ))}
                    </ul>
                  ) : !h.available ? (
                    <p className="mt-1 text-[10px] leading-relaxed text-amber-400">
                      {h.unavailable_reason ?? "No data available for this window."}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Provenance */}
      <Card>
        <CardContent className="pt-5">
          <div className="text-sm font-medium text-foreground">Data &amp; engine</div>
          <div className="mt-2 flex flex-col gap-1 text-[11px] text-muted-foreground">
            <div>
              Data quality: <span className="text-foreground">{alert.data_quality}</span>
            </div>
            <div>
              Weather provider:{" "}
              <span className="text-foreground">{alert.provider?.name ?? "—"}</span>
            </div>
            <div>
              Engine: <span className="text-foreground">rule-based ({alert.engine_version})</span>
              <span className="ml-1 text-[10px]">— not a trained ML model</span>
            </div>
            <div>
              Thresholds status:{" "}
              <span className="text-foreground">{alert.thresholds_status}</span>
            </div>
            <div>
              Generated: <span className="text-foreground">{new Date(alert.generated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
