import { useState, useCallback } from "react";

export function useLoading() {
  const [loading, setLoading] = useState(false);

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, setLoading, wrap } as const;
}
