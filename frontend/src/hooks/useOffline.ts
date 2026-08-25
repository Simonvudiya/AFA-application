import { useEffect, useState } from 'react';
import { openDB } from 'idb';

const dbPromise = openDB('CBIRS-offline', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('consignments')) {
      db.createObjectStore('consignments', { keyPath: 'localId', autoIncrement: true });
    }
  }
});

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOffline = async (storeName: string, data: any) => {
    const db = await dbPromise;
    await db.add(storeName, { ...data, timestamp: Date.now() });
  };

  const getPending = async (storeName: string) => {
    const db = await dbPromise;
    return db.getAll(storeName);
  };

  const clearPending = async (storeName: string) => {
    const db = await dbPromise;
    await db.clear(storeName);
  };

  const syncPending = async (storeName: string, apiCall: (data: any) => Promise<any>) => {
    if (!isOnline) return;
    const pending = await getPending(storeName);
    for (const item of pending) {
      try {
        await apiCall(item);
      } catch (e) {
        console.error('Sync failed for item', item, e);
      }
    }
    await clearPending(storeName);
  };

  return { isOnline, saveOffline, getPending, syncPending };
};
