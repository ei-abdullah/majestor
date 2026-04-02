export interface UserDetails {
    id: number,
    email: string,
    username: string,
    avatar: string,
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