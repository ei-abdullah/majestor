import { create } from 'zustand';

interface PremiumModalState {
    isVisible: boolean;
    message: string;
    open: (message: string) => void;
    close: () => void;
}

export const usePremiumModalStore = create<PremiumModalState>((set) => ({
    isVisible: false,
    message: '',
    open: (message) => set({ isVisible: true, message }),
    close: () => set({ isVisible: false, message: '' }),
}));
