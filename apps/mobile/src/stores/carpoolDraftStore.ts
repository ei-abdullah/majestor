import {create} from 'zustand/react';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CarpoolDraftState} from "@/src/types/carpoolDraft";

export const useCarpoolDraftStore = create<CarpoolDraftState>()(
    persist(
        (set) => ({
            postRide: {
                startLocation: null,
                endLocation: null,
                vehicleModel: '',
                licensePlate: '',
                phone: '',
                numberOfPassengers: 1,
                vehicleType: 'CAR',
            },
            bookRide: {
                pickupLocation: null,
                dropOffLocation: null,
                phone: '',
                numberOfPassengers: 1,
            },
            savePostRide: (draft) =>
                set((state) => ({postRide: {...state.postRide, ...draft}})),
            saveBookRide: (draft) =>
                set((state) => ({bookRide: {...state.bookRide, ...draft}})),
        }),
        {
            name: 'carpool-draft-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);