import type { LayerDefinition } from '@/types/gis';

/**
 * Map layer registry.
 *
 * Layer *definitions* live here, separate from both the MapLibre components
 * that draw them (`src/components/gis`) and the PostGIS queries that supply
 * their data (`src/server/repositories`). Keeping the three apart is what lets
 * a layer's source change without touching its presentation.
 *
 * Empty in Phase 0 — populated in Phase 3 once there is real geometry to draw.
 * No demo layers are registered here, so nothing can render unlabelled.
 */
export const LAYER_REGISTRY: readonly LayerDefinition[] = [];

export function findLayer(id: string): LayerDefinition | undefined {
  return LAYER_REGISTRY.find((layer) => layer.id === id);
}
