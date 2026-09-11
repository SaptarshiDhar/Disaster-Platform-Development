# RAKSHA — Product Requirements

**Problem Statement:** SIH26191 · Smart India Hackathon 2026

---

## 1. Problem

India's disaster-prone regions face recurring floods, landslides, cloudbursts,
coastal erosion and compound multi-hazard exposure. Many habitations remain in
unsafe locations, producing repeated loss of life, infrastructure damage,
livelihood disruption and recurring response expenditure.

Existing relocation efforts are largely **reactive** — triggered after an
event rather than informed by a standing assessment of where exposure is
concentrated and where people could safely go instead.

## 2. What RAKSHA is

A GIS-enabled **decision-support** platform. It assembles hazard, population,
terrain and infrastructure data into reviewable evidence so that authorities
can make relocation decisions with a traceable basis.

## 3. What RAKSHA is not

RAKSHA is **not** an autonomous disaster-management authority. It does not
issue evacuation or relocation orders, and its outputs are not certified hazard
maps or approved risk classifications. Every recommendation is an input to a
human decision made by a competent authority.

## 4. Users

NDRF · SDMA · DDMA · District Administration · GIS analysts · disaster
management planners · authorised government officers.

Primary environment is a desktop authority workstation. Tablet and mobile are
supported for field reference, not as the primary analysis surface.

---

## 5. Modules

Each module lists its target release: **P** = SIH prototype, **M** = MVP,
**F** = future production system.

### Command Dashboard — P
Jurisdiction overview: habitations at risk, population exposed, active
advisories, recent incidents, pending assessments.

### Multi-Hazard GIS Map — P
MapLibre canvas with toggleable hazard, population, habitation, infrastructure
and candidate-site layers. Legend states each layer's classification and
vintage.

### Red Zone Analysis — P
Derived hazard-based restriction zones, with the inputs and method that
produced each zone inspectable from the zone itself.

### Habitation Risk Assessment — P
Per-habitation view: hazard exposure by type, population observations with
their source years, historical events nearby, infrastructure access.

### Carrying Capacity Assessment — M
Whether a candidate site can actually support a displaced population. Factors
are configurable and labelled as prototype assumptions until evidence-based or
stakeholder-agreed. See §7.

### Candidate Relocation Sites — M
Identification and cataloguing of potential resettlement locations with
terrain, access and hazard-distance attributes.

### Site Comparison — M
Side-by-side comparison of candidate sites for one habitation, showing where
the options genuinely differ.

### Relocation Recommendation Engine — M
Prioritisation across **Immediate / Short-Term / Medium-Term** horizons, with
the evidence for each ranking shown alongside it. See §8.

### Weather / Operational Context — M
Current and forecast conditions for situational awareness. Clearly separated
from hazard susceptibility.

### Analytics — M
Exposure trends, assessment throughput, coverage gaps.

### Reports — M
Exportable assessment documents carrying provenance and the prototype
disclaimer.

### Data Provenance — P
Every figure traceable to its source, dataset version, retrieval date and
processing run.

### Administration — F
User, role and jurisdiction management; ingestion monitoring; audit review.

---

## 6. Data sources

Architecture must accommodate these; Phase 0 integrates none of them.

| Domain | Sources |
|---|---|
| Population | WorldPop |
| Landslide | Historical landslide inventories; Bhusanket-derived information where permitted |
| Flood | IIT Delhi HydroSense Lab India Flood Inventory; IMD flood/event information where available |
| Weather | Open-Meteo; authorised weather APIs |
| Geological | Geological Survey of India; ISRO Bhuvan where technically and legally usable |
| Terrain | DEM / elevation rasters |
| Infrastructure | Roads, healthcare, schools, water, electricity, transport accessibility |
| Administrative | State, district, sub-district, village boundaries |

Formats to support: GeoJSON, Shapefile, GeoPackage, GeoTIFF, CSV, JSON, REST
responses.

Every integration requires its licence and permitted use checked before use.

---

## 7. Carrying capacity — factors under consideration

**No weights are defined.** Listing a factor is not agreeing how much it counts.

Usable safe land · terrain suitability · water access · road accessibility ·
healthcare access · school access · electricity · public infrastructure ·
distance from hazards · environmental and legal restrictions · population
density · current settlement load.

Weights must ultimately be evidence-based, stakeholder-defined, or explicitly
labelled in the UI as configurable prototype assumptions.

---

## 8. Relocation priority — factors under consideration

**No formula is defined.**

Multi-hazard severity · population exposure · historical recurrence · critical
infrastructure exposure · accessibility · safe-site availability · terrain
constraints · vulnerable population indicators · relocation feasibility ·
urgency.

Any scoring introduced must show its inputs to the user and be overridable by
the reviewing officer.

---

## 9. Non-functional requirements

| Area | Requirement |
|---|---|
| Accessibility | Semantic heading order, keyboard operability, visible focus, labelled controls, no colour-only encoding |
| Performance | Server Components by default; GIS bundles loaded dynamically; no blocking on optional integrations |
| Security | RLS-enforced authorisation; service-role key server-only; all input validated with Zod |
| Integrity | Every dataset classified and labelled (see demo-data-policy.md) |
| Availability | `/api/health` must succeed with no external dependency configured |
