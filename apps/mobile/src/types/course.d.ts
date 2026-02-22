export interface Course {
    id: number,
    name: string,
}

export interface FetchCoursesByUserResponse {
    facultyName: string,
    courses: Course[]
}