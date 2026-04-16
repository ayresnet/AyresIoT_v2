'use client';

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase/client';
import type { AlarmDevice } from '@/lib/types/devices';

/**
 * Hook para escuchar en tiempo real los datos de alarmas
 * del usuario desde Firebase RTDB.
 * Ruta: dispositivos/{dni}/alarmas
 */
export function useAlarmaData(dni: string | undefined) {
  const [alarms, setAlarms] = useState<AlarmDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dni) {
      setLoading(false);
      setAlarms([]);
      return;
    }

    setLoading(true);
    const alarmsRef = ref(database, `dispositivos/${dni}/alarmas`);

    const unsubscribe = onValue(
      alarmsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedAlarms = Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            ...value,
          })) as AlarmDevice[];
          setAlarms(loadedAlarms);
        } else {
          setAlarms([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('RTDB alarmas error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dni]);

  return { alarms, loading, error };
}
