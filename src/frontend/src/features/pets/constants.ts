/** Filter pills — must match seed tags per SRS FR-1.5 / ERD */
export const FILTER_TAGS = ['Very Wiggly', 'Expert Napper', 'Gentle'] as const;

export type FilterTag = (typeof FILTER_TAGS)[number];
