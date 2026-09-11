import { X } from "lucide-react";

import { thematicLayers } from "../../config/mapLayers";

/**
 * Layer control panel.
 *
 * Each toggle is annotated with what the layer actually is today, so an
 * operator can tell demo geometry apart from a real service at a glance.
 */
function MapLayersPanel({ groups, layers, onToggle, onClose, onReset }) {
  return (
    <aside className="layer-panel" aria-label="Map layers">
      <div className="layer-panel-header">
        <strong>Layers</strong>
        <button type="button" onClick={onClose} aria-label="Close layers panel">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="layer-panel-body">
        {groups.map((group) => (
          <section key={group.title} className="layer-section">
            <h4>{group.title}</h4>

            {group.items.map((item) => {
              const meta = thematicLayers[item.layerId] ?? null;
              const isDemo = meta?.source === "local-demo";

              return (
                <label key={item.key} className="layer-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(layers[item.key])}
                    onChange={() => onToggle(item.key)}
                  />
                  <span className="layer-toggle-label">
                    {item.label}
                    {isDemo ? (
                      <span className="layer-flag" title={meta?.note}>
                        demo
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </section>
        ))}
      </div>

      {onReset ? (
        <button type="button" className="reset-layers" onClick={onReset}>
          Reset Layers
        </button>
      ) : null}
    </aside>
  );
}

export default MapLayersPanel;
