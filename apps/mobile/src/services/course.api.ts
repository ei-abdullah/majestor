import {AxiosResponse} from "axios";
import api from "@/src/services/index";

type Course = {
    id: number;
    name: string;
}

export type FetchCoursesByUserResponse = {
    facultyName: string,
    courses: Course[]
}


export const fetchCoursesByUser = async (userId: number): Promise<AxiosResponse<FetchCoursesByUserResponse>> =>
    api.get<FetchCoursesByUserResponse>(`/course/getCoursesByUser/${userId}`, {
        headers: {skipAuth: true}
    });