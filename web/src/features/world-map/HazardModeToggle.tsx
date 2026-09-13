"use client";

import { CloudLightning, Layers3, Mountain, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

export type HazardMode = "flood" | "landslide" | "cloudburst" | "multi";

export const HAZARD_ACCENT: Record<HazardMode, string> = {
  flood: "#3b82f6",
  landslide: "#f97316",
  cloudburst: "#06b6d4",
  multi: "#a855f7",
};

const MODES: Array<{ id: HazardMode; label: string; icon: typeof Waves }> = [
  { id: "flood", label: "FLOOD", icon: Waves },
  { id: "landslide", label: "LANDSLIDE", icon: Mountain },
  { id: "cloudburst", label: "CLOUDBURST", icon: CloudLightning },
  { id: "multi", label: "MULTI-HAZARD", icon: Layers3 },
];

export function HazardModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: HazardMode;
  onChange: (mode: HazardMode) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Hazard mode"
      className="inline-flex rounded-lg border border-border bg-secondary/50 p-1"
    >
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(m.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors disabled:opacity-50",
              active
                ? m.id === "flood"
                  ? "bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-500/30"
                  : m.id === "landslide"
                    ? "bg-orange-500/15 text-orange-300 ring-1 ring-inset ring-orange-500/30"
                    : m.id === "cloudburst"
                      ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-500/30"
                      : "bg-purple-500/15 text-purple-300 ring-1 ring-inset ring-purple-500/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
