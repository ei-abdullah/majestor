export interface UserDetails {
    id: number,
    username: string,
    avatar: string,
    email: string,
    phone?: string,
    personalEmail?: string,
    university: string,
    faculty: string,
    roles: [string]
}

export interface PersonalDetailsBody {
    personalEmail?: string,
    phone?: string,
}