'use client';

import { useEffect, useState } from 'react';
import { listenToData } from '@/app/firebase';

export function useRealtimeData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = listenToData(path, (snapshot) => {
      try {
        setData(snapshot);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
}