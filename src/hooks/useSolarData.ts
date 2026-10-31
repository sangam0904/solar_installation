import { useState, useEffect, useCallback } from "react";

export function useSolarData<T>(resource: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPostgres, setIsPostgres] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/solar/data?resource=${resource}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setData(json.data);
        setIsPostgres(json.source === "postgresql");
      }
    } catch (err: any) {
      console.warn(`[useSolarData] Failed to fetch ${resource}:`, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    setData,
    loading,
    error,
    isPostgres,
    refetch: fetchData,
  };
}
