import { describe, expect, it } from 'vitest';
import { UI_COPY } from '@/shared/constants/uiCopy';

describe('UI_COPY (docs/ux-ui-flows alignment)', () => {
  it('matches browse-pets loading copy', () => {
    expect(UI_COPY.loading.petsList).toBe('Fetching the pack...');
    expect(UI_COPY.loading.petDetail).toBe('Studying the records...');
  });

  it('matches adopt-application copy', () => {
    expect(UI_COPY.loading.adopt).toBe('Printing papers...');
    expect(UI_COPY.empty.adoptPetNotFound).toBe('Which dog was it again?');
    expect(UI_COPY.success.adoptTitle).toBe('Wag-tastic!');
    expect(UI_COPY.success.adoptSubtitle).toContain('papers are flying');
  });

  it('includes filter empty copy', () => {
    expect(UI_COPY.empty.noFilterMatch).toContain('No pups match');
  });

  it('includes filter and unavailable copy', () => {
    expect(UI_COPY.filters.clearAll).toBe('Clear all');
    expect(UI_COPY.filters.orHint).toContain('OR');
    expect(UI_COPY.unavailable.detailMessage).toContain('Not available');
  });

  it('matches browse 404 copy', () => {
    expect(UI_COPY.empty.petNotFound).toBe('Pup not found!');
  });
});
