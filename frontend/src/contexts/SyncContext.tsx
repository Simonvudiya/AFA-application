import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useOffline } from '../hooks/useOffline';

interface SyncContextType {
  isOnline: boolean;
  pendingCount: number;
  syncNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOnline, getPending } = useOffline();
  const [pendingCount, setPendingCount] = useState(0);

  const syncNow = async () => {
    const items = await getPending('consignments');
    setPendingCount(items.length);
  };

  return (
    <SyncContext.Provider value={{ isOnline, pendingCount, syncNow }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
};
