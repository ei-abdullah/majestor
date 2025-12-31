import api from "@/src/services/index";

export type UserDetails = {
    id: number;
    username: string;
    avatar: string;
    email: string;
    phone?: string;
    personalEmail?: string;
    university: string
    faculty: string;
    roles: [string];
}

type PersonalDetailsBody = {
    personalEmail?: string;
    phone?: string;
}

export const getUserDetailsApi = async (userId: number): Promise<UserDetails> => {
    const res = await api.get<UserDetails>(`/user/getUserDetails/${userId}`, {
        headers: {
            requiresAuth: true,
        }
    });
    return res.data;
}

export const updateProfileImageApi = async (userId: number, formData: FormData): Promise<void> => {
    await api.patch(`/user/updateProfileImage/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            requiresAuth: true,
        },
        transformRequest: (data) => data,
    });
};

export const updateUserDetailsApi = async (userId: number, details: {
    personalEmail: string,
    phone: string,
}): Promise<void> => {
    await api.patch(`/user/updateUserDetails/${userId}`, details, {
        headers: {
            requiresAuth: true,
        }
    });
}