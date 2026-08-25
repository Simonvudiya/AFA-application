import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SyncState {
  pendingCount: number;
  setPendingCount: (count: number) => void;
}

export const syncStore = create<SyncState>()(
  persist(
    (set) => ({
      pendingCount: 0,
      setPendingCount: (count) => set({ pendingCount: count }),
    }),
    { name: 'sync-store' }
  )
);
