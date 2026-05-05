import { create } from 'zustand';
import { PurchasesState } from '@/src/types/purchase';

// RevenueCat removed pending legal clearance — everyone is elite until re-enabled.
export const usePurchasesStore = create<PurchasesState>(() => ({
    customerInfo: null,
    isElite: true,
    setCustomerInfo: () => {},
}));