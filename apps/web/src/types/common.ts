/** Cross-cutting primitives used across features. */

/**
 * Provenance classification. Every dataset surfaced in the UI must carry one
 * of these, and the UI must label anything that is not `official` as such.
 * See docs/demo-data-policy.md.
 */
export type DataClassification =
  | 'official'
  | 'derived'
  | 'demo'
  | 'experimental';

export const DATA_CLASSIFICATION_LABEL: Record<DataClassification, string> = {
  official: 'Official / External Source Data',
  derived: 'Derived Dataset',
  demo: 'Demo Data',
  experimental: 'Experimental Model Output',
};

/** Provenance metadata attached to a dataset or a computed layer. */
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

export type Paginated<T> = {
  items: readonly T[];
  total: number;
  page: number;
  pageSize: number;
};
