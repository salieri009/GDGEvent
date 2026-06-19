// @vitest-environment happy-dom
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAsyncResource } from './useAsyncResource';

describe('useAsyncResource', () => {
  it('loads data when enabled', async () => {
    const { result } = renderHook(() =>
      useAsyncResource({
        load: async () => 'loaded',
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe('loaded');
    expect(result.current.error).toBeNull();
  });

  it('clears state when disabled', async () => {
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useAsyncResource({
          load: async () => 'loaded',
          enabled,
        }),
      { initialProps: { enabled: true } },
    );

    await waitFor(() => expect(result.current.data).toBe('loaded'));

    rerender({ enabled: false });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  it('ignores stale responses when a newer request completes first', async () => {
    const resolvers: Array<(value: number) => void> = [];
    const load = () =>
      new Promise<number>((resolve) => {
        resolvers.push(resolve);
      });

    const { result } = renderHook(() => useAsyncResource({ load }));

    await waitFor(() => expect(result.current.loading).toBe(true));
    expect(resolvers).toHaveLength(1);

    await act(async () => {
      void result.current.reload();
    });

    expect(resolvers).toHaveLength(2);

    await act(async () => {
      resolvers[1](2);
    });

    await waitFor(() => expect(result.current.data).toBe(2));

    await act(async () => {
      resolvers[0](1);
    });

    expect(result.current.data).toBe(2);
  });
});
