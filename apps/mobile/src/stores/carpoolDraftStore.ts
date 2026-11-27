import {create} from 'zustand/react';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CarpoolDraftState} from "@/src/types/carpoolDraft";

const initialPostRide = {
    startLocation: null,
    endLocation: null,
    vehicleModel: '',
    licensePlate: '',
    phone: '',
    numberOfPassengers: 1,
    vehicleType: 'CAR' as const,
};

const initialBookRide = {
    pickupLocation: null,
    dropOffLocation: null,
    phone: '',
    numberOfPassengers: 1,
};

export const useCarpoolDraftStore = create<CarpoolDraftState>()(
    persist(
        (set) => ({
            postRide: {...initialPostRide},
            bookRide: {...initialBookRide},
            savePostRide: (draft) =>
                set((state) => ({postRide: {...state.postRide, ...draft}})),
            saveBookRide: (draft) =>
                set((state) => ({bookRide: {...state.bookRide, ...draft}})),
            clearDrafts: () =>
                set({
                    postRide: {...initialPostRide},
                    bookRide: {...initialBookRide},
                }),
        }),
        {
            name: 'carpool-draft-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
