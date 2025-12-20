import api from "@/src/services/index";
import {AxiosResponse} from "axios";

type Faculty = {
    id: number;
    name: string;
}

export type UniversityWithFaculties = {
    id: number;
    name: string;
    faculties: Faculty[];
}

export const getUniversitiesWithFaculties = async (): Promise<AxiosResponse<UniversityWithFaculties[]>> =>
    api.get<UniversityWithFaculties[]>("/university/getWithFaculties");
