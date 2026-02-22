import {AxiosResponse} from "axios";
import api from "@/src/services/index";
import {FetchCoursesByUserResponse} from "@/src/types/course";


export const fetchCoursesByUser = async (userId: number): Promise<AxiosResponse<FetchCoursesByUserResponse>> =>
    api.get<FetchCoursesByUserResponse>(`/course/getCoursesByUser/${userId}`, {
        headers: {skipAuth: true}
    });