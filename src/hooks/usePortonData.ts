'use client';

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase/client';
import type { PortonDevice } from '@/lib/types/devices';

/**
 * Hook para escuchar en tiempo real los datos de portones
 * del usuario desde Firebase RTDB.
 * Ruta: dispositivos/{dni}/portones
 */
export function usePortonData(dni: string | undefined) {
  const [portones, setPortones] = useState<PortonDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dni) {
      setLoading(false);
      setPortones([]);
      return;
    }

    setLoading(true);
    const portonesRef = ref(database, `dispositivos/${dni}/portones`);

    const unsubscribe = onValue(
      portonesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedPortones = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          })) as PortonDevice[];
          setPortones(loadedPortones);
        } else {
          setPortones([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('RTDB portones error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dni]);

  return { portones, loading, error };
}
