import {create} from "zustand";
import * as Sentry from "@sentry/react-native";

import {getUniversitiesWithFaculties} from "@/src/services/academia.api";
import {AcademiaState} from "@/src/types/academia";

export const useAcademiaStore = create<AcademiaState>((set, get) => ({
    universities: [],
    isLoading: false,
    hasLoaded: false,
    error: null,

    fetchUniversities: async () => {
        if (get().hasLoaded) return;

        set({isLoading: true});

        try {
            const {data} = await getUniversitiesWithFaculties();
            set({universities: data, hasLoaded: true});

        } catch (error: any) {
            Sentry.captureException(error);
            set({error: error.message})
        } finally {
            set({isLoading: false});
        }
    }
}))