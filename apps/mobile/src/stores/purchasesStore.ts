import { create } from 'zustand';
import { CustomerInfo } from 'react-native-purchases';
import { hasEliteEntitlement } from '@/src/services/purchases.service';
import {PurchasesState} from "@/src/types/purchase";

export const usePurchasesStore = create<PurchasesState>((set) => ({
    customerInfo: null,
    isElite: false,
    setCustomerInfo: (info) =>
        set({ customerInfo: info, isElite: hasEliteEntitlement(info) }),
}));