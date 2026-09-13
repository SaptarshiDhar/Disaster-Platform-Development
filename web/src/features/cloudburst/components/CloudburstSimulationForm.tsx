"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CloudburstScenarioInput } from "../types";

interface Props {
  onRun: (scenario: CloudburstScenarioInput) => void;
  loading: boolean;
}

// Text-field state: kept as strings so a field can be legitimately empty
// (meaning "not supplied") without fighting a controlled-number-input.
type FieldState = Record<
  | "peakHourlyRainfall"
  | "rainfall3h"
  | "rainfall6h"
  | "rainfall12h"
  | "rainfall24h"
  | "recent24hRainfall"
  | "precipitationProbability",
  string
>;

const EMPTY: FieldState = {
  peakHourlyRainfall: "",
  rainfall3h: "",
  rainfall6h: "",
  rainfall12h: "",
  rainfall24h: "",
  recent24hRainfall: "",
  precipitationProbability: "",
};

// A pre-filled EXTREME preset makes the demo requirement ("show dangerous
// weather even when actual weather is calm") a one-click action rather than
// something the user has to construct by hand.
const EXTREME_PRESET: FieldState = {
  peakHourlyRainfall: "90",
  rainfall3h: "180",
  rainfall6h: "240",
  rainfall12h: "280",
  rainfall24h: "330",
  recent24hRainfall: "100",
  precipitationProbability: "95",
};

export function CloudburstSimulationForm({ onRun, loading }: Props) {
  const [fields, setFields] = useState<FieldState>(EMPTY);
  const [thunderstorm, setThunderstorm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof FieldState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  function parsed(key: keyof FieldState): number | undefined {
    const raw = fields[key].trim();
    if (raw === "") return undefined;
    return Number(raw);
  }

  function applyPreset() {
    setFields(EXTREME_PRESET);
    setThunderstorm(true);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const values = Object.entries(fields) as [keyof FieldState, string][];
    for (const [key, raw] of values) {
      if (raw.trim() === "") continue;
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        setError(`${key} must be a number.`);
        return;
      }
      if (n < 0) {
        setError("Rainfall values cannot be negative.");
        return;
      }
    }
    const prob = parsed("precipitationProbability");
    if (prob !== undefined && (prob < 0 || prob > 100)) {
      setError("Precipitation probability must be between 0 and 100.");
      return;
    }

    const scenario: CloudburstScenarioInput = {
      peak_hourly_rainfall: parsed("peakHourlyRainfall"),
      rainfall_3h: parsed("rainfall3h"),
      rainfall_6h: parsed("rainfall6h"),
      rainfall_12h: parsed("rainfall12h"),
      rainfall_24h: parsed("rainfall24h"),
      recent_24h_rainfall: parsed("recent24hRainfall"),
      precipitation_probability: prob,
      thunderstorm,
    };

    if (Object.values(scenario).every((v) => v === undefined || v === thunderstorm)) {
      setError("Enter at least one rainfall value.");
      return;
    }

    onRun(scenario);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Manual rainfall scenario
        </Label>
        <button
          type="button"
          onClick={applyPreset}
          className="text-[10px] font-medium text-purple-300 hover:text-purple-200"
        >
          fill extreme preset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="cb-peak" className="text-[10px]">Peak hourly (mm)</Label>
          <Input id="cb-peak" inputMode="decimal" value={fields.peakHourlyRainfall} onChange={set("peakHourlyRainfall")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cb-3h" className="text-[10px]">3h total (mm)</Label>
          <Input id="cb-3h" inputMode="decimal" value={fields.rainfall3h} onChange={set("rainfall3h")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cb-6h" className="text-[10px]">6h total (mm)</Label>
          <Input id="cb-6h" inputMode="decimal" value={fields.rainfall6h} onChange={set("rainfall6h")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cb-12h" className="text-[10px]">12h total (mm)</Label>
          <Input id="cb-12h" inputMode="decimal" value={fields.rainfall12h} onChange={set("rainfall12h")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cb-24h" className="text-[10px]">24h total (mm)</Label>
          <Input id="cb-24h" inputMode="decimal" value={fields.rainfall24h} onChange={set("rainfall24h")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cb-recent" className="text-[10px]">Recent 24h fallen (mm)</Label>
          <Input id="cb-recent" inputMode="decimal" value={fields.recent24hRainfall} onChange={set("recent24hRainfall")} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="cb-prob" className="text-[10px]">Precipitation probability (%)</Label>
        <Input id="cb-prob" inputMode="decimal" value={fields.precipitationProbability} onChange={set("precipitationProbability")} />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
        <Label htmlFor="cb-thunder" className="text-xs">Thunderstorm / convective condition</Label>
        <Switch id="cb-thunder" checked={thunderstorm} onCheckedChange={setThunderstorm} />
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
        <FlaskConical className="mr-1.5 h-3.5 w-3.5" />
        {loading ? "Running…" : "Run Simulation"}
      </Button>

      <p className="text-[10px] leading-relaxed text-muted-foreground">
        These values feed the same rule engine LIVE mode uses. The engine — not this
        form — decides the resulting severity.
      </p>
    </form>
  );
}
