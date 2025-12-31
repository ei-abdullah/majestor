import {useQuery} from "@tanstack/react-query";
import {fetchCoursesByUser} from "@/src/services/course.api";

export const useCourse = (userId: number) => {
    return useQuery({
        queryKey: ["course", userId],
        queryFn: () => fetchCoursesByUser(userId),
    })
}