# RAKSHA — Data Classification & Demo Data Policy

This policy exists because RAKSHA displays information that looks
authoritative. A hazard polygon on a dark map reads as official whether or not
it is. **Every dataset must therefore declare what it actually is, and the UI
must show that declaration.**

This is a binding rule for the project, not a guideline.

---

## 1. The four classifications

Every dataset, layer and computed figure carries exactly one.

### `official` — Official / External Source Data

Traceable to a named external provider, with a retrievable URL or citation and
a recorded retrieval date.

> Examples: WorldPop population rasters, Geological Survey of India hazard
> mapping, the IIT Delhi HydroSense Lab India Flood Inventory, IMD
> observations, ISRO Bhuvan layers, Open-Meteo forecasts.

**UI label:** the source agency name.

### `derived` — Processed / Derived Data

Computed by RAKSHA from source data. Must record its inputs, method and
`processing_run_id`.

> Example: a red zone polygon produced by intersecting a flood inventory with
> a slope raster.

**UI label:** `Derived Dataset`, with the inputs inspectable.

### `demo` — Demo / Simulated Data

Invented for prototype demonstration. Corresponds to nothing real.

> Example: the mock habitations and hazard polygons in
> `artifacts/blank-react-vite-app/src/data/`.

**UI label:** `Demo Data` or `Simulated Dataset` — persistently visible on any
view that renders it, not hidden behind a tooltip.

### `experimental` — Experimental Model Output

Produced by a model or algorithm that has not been validated against ground
truth.

**UI label:** `Experimental Model Output` or `Prototype Estimate`.

---

## 2. Prohibited

These are not style preferences. Each one misrepresents the provenance of
information that could influence a decision about people's homes.

- Inventing government statistics, hazard events, casualty figures or
  probabilities.
- Attributing prototype-generated data to NDRF, GSI, ISRO, IMD, IIT Delhi,
  WorldPop or any other agency unless it genuinely came from that source.
- Presenting an algorithmic output as an official evacuation order, relocation
  order, certified hazard map or approved risk classification.
- Silently mixing datasets from different years — vintage travels with the data.
- Implying geographic precision the source does not support (for example,
  rendering a district-level estimate as a building-level point).
- Presenting a historical event as a prediction, or hazard exposure as an
  established relocation requirement.

---

## 3. Enforcement

The type system carries the classification so it cannot be dropped in transit:

```ts
// src/types/common.ts
export type DataClassification =
  | 'official' | 'derived' | 'demo' | 'experimental';

export type DataProvenance = {
  classification: DataClassification;
  sourceName: string;
  sourceUrl?: string;
  sourceAgency?: string;
  license?: string;
  datasetVersion?: string;
  retrievedAt?: string;
  processingMethod?: string;
};
```

In the database, `data_sources.classification` is a non-null enum column, and
every table holding external or derived data references it.

**Review rule:** a pull request that renders a dataset without surfacing its
classification does not get merged.

---

## 4. Global disclaimer

Carried in the application footer and on every exported report:

> RAKSHA is a prototype decision-support platform developed for Smart India
> Hackathon 2026. Hazard classifications, carrying-capacity estimates,
> relocation rankings and recommendations produced by the prototype must not be
> interpreted as official government evacuation or relocation orders unless
> independently validated and authorised by the competent authorities.
