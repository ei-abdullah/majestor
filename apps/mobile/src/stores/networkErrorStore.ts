import {create} from "zustand";

interface NetworkErrorState {
    hasNetworkError: boolean;
    setNetworkError: (val: boolean) => void;
}

export const useNetworkErrorStore = create<NetworkErrorState>((set) => ({
    hasNetworkError: false,
    setNetworkError: (val) => set({hasNetworkError: val}),
}));
