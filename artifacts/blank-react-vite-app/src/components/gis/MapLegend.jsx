/**
 * Map legend.
 *
 * Also carries the provenance line for the active layer, so what the colours
 * mean and where they came from are stated in the same place.
 */
function MapLegend({ title, items, note }) {
  return (
    <div className="map-legend" aria-label={`${title} legend`}>
      <strong>{title}</strong>

      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <span
              className="legend-dot"
              style={{ background: item.colour }}
              aria-hidden="true"
            />
            {item.label}
          </li>
        ))}
      </ul>

      {note ? <p className="legend-note">{note}</p> : null}
    </div>
  );
}

export default MapLegend;
