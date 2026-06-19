import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await load();
      if (id !== requestId.current) return;
      setData(result);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(apiErrorMessage(err, fallbackError));
      setData(null);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [load, enabled, fallbackError]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}
