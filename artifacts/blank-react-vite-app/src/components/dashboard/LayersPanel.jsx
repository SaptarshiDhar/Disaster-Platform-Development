
import { Layers3, X } from "lucide-react";

function Toggle({
  checked,
  onChange,
  label,
}) {
  return (
    <label className="layer-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      <span>{label}</span>
    </label>
  );
}

function LayerControlPanel({
  layers,
  setLayers,
  onClose,
}) {
  const toggle = (key) => {
    setLayers((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <div>
          <Layers3 size={17} />
          <strong>MAP LAYERS</strong>
        </div>

        <button onClick={onClose}>
          <X size={17} />
        </button>
      </div>

      <div className="layer-section">
        <h4>Exposure</h4>

        <Toggle
          checked={layers.population}
          onChange={() =>
            toggle("population")
          }
          label="Population Density"
        />

        <Toggle
          checked={layers.habitations}
          onChange={() =>
            toggle("habitations")
          }
          label="Habitations"
        />
      </div>

      <div className="layer-section">
        <h4>Operations</h4>

        <Toggle
          checked={layers.incidents}
          onChange={() =>
            toggle("incidents")
          }
          label="Incident Reports"
        />

        <Toggle
          checked={layers.candidateSites}
          onChange={() =>
            toggle("candidateSites")
          }
          label="Candidate Relocation Sites"
        />
      </div>

      <div className="layer-info">
        Population visualization is currently a
        prototype overlay.
        <br />
        <strong>Future source: WorldPop GIS processing.</strong>
      </div>
    </div>
  );
}

export default LayerControlPanel;
