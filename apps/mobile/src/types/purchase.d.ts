import {create} from "zustand";

export interface PurchasesState {
    customerInfo: CustomerInfo | null;
    isElite: boolean;
    setCustomerInfo: (info: CustomerInfo) => void;
}
