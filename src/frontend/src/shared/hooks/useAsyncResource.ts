import { useCallback, useEffect, useState } from 'react';
import { apiErrorMessage } from '@/shared/api/client';

interface UseAsyncResourceOptions<T> {
  load: () => Promise<T>;
  enabled?: boolean;
  fallbackError?: string;
}

export function useAsyncResource<T>({
  load,
  enabled = true,
  fallbackError = 'Request failed',
}: UseAsyncResourceOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await load();
      setData(result);
    } catch (err) {
      setError(apiErrorMessage(err, fallbackError));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [load, enabled, fallbackError]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}
