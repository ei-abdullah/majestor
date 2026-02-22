export interface Faculty  {
    id: number,
    name: string
}

export interface UniversityWithFaculties {
    id: number,
    name: string,
    faculties: Faculty[]
}

export interface AcademiaState {
    universities: UniversityWithFaculties[],
    isLoading: boolean,
    hasLoaded: boolean,
    error: string | null,
    fetchUniversities: () => Promise<void>
}