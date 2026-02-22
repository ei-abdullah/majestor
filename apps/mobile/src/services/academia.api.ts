import api from "@/src/services/index";
import {AxiosResponse} from "axios";
import {UniversityWithFaculties} from "@/src/types/academia";


export const getUniversitiesWithFaculties = async (): Promise<AxiosResponse<UniversityWithFaculties[]>> =>
    api.get<UniversityWithFaculties[]>("/university/getWithFaculties", {
        headers: {skipAuth: true}
    });
