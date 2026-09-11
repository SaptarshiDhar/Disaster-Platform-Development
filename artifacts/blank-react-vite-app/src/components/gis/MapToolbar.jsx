import { Layers3, Search } from "lucide-react";

import { regionOptions } from "../../services/dashboardService";

/**
 * Map toolbar: jurisdiction selector, search and the layer-panel toggle.
 *
 * The location selector is India-first; the listed states are demo focus areas
 * only and carry no special status.
 */
function MapToolbar({
  regionId,
  onRegionChange,
  query,
  onQueryChange,
  onSearch,
  onToggleLayers,
  layersOpen,
  searchPlaceholder = "Search state, district or habitation",
}) {
  return (
    <div className="map-toolbar">
      <label className="sr-only" htmlFor="map-region">
        Jurisdiction
      </label>
      <select
        id="map-region"
        value={regionId}
        onChange={(event) => onRegionChange(event.target.value)}
      >
        {regionOptions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>

      <form
        className="map-search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(query);
        }}
        role="search"
      >
        <Search size={17} aria-hidden="true" />
        <label className="sr-only" htmlFor="map-search-input">
          {searchPlaceholder}
        </label>
        <input
          id="map-search-input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
        />
        <button type="submit">Search</button>
      </form>

      <button
        type="button"
        className="layers-button"
        onClick={onToggleLayers}
        aria-expanded={layersOpen}
      >
        <Layers3 size={17} aria-hidden="true" />
        Layers
      </button>
    </div>
  );
}

export default MapToolbar;
