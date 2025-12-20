import {create} from "zustand/react";
import {getUniversitiesWithFaculties, UniversityWithFaculties,} from "@/src/services/academia.api";

type AcademiaState = {
    universities: UniversityWithFaculties[];
    isLoading: boolean;
    hasLoaded: boolean;
    error: string | null;
    fetchUniversities: () => Promise<void>;
}

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
            set({error: error.message})
        } finally {
            set({isLoading: false});
        }
    }
}))