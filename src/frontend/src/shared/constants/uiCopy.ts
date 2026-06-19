/** Loading / empty copy — must match docs/ux-ui-flows/*.md */
export const UI_COPY = {
  loading: {
    petsList: 'Fetching the pack...',
    petDetail: 'Studying the records...',
    adopt: 'Printing papers...',
    homePack: 'Loading the pack...',
    homeFeatured: 'Fetching featured pup...',
  },
  empty: {
    petNotFound: 'Pup not found!',
    adoptPetNotFound: 'Which dog was it again?',
    noPups: 'No pups on the roster yet',
    noFilterMatch: 'No pups match those filters — try clearing a tag or search.',
  },
  unavailable: {
    detailMessage: 'Not available for adoption right now.',
    detailHint: 'Browse other pups in the pack — someone else may be waiting for you!',
    adoptBlocked: 'is not available for adoption right now.',
  },
  filters: {
    activeLabel: 'Active filters',
    clearAll: 'Clear all',
    orHint: 'Tag pills match any selected vibe (OR). Search narrows further (AND).',
  },
  success: {
    adoptTitle: 'Wag-tastic!',
    adoptSubtitle: "The papers are flying towards us. We'll bark back soon!",
    adoptRedirect: 'Redirecting to the pack in 3 seconds...',
  },
} as const;
