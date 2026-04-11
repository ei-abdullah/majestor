import api from "@/src/services/index";
import {AuthUser} from "@/src/types/auth";

export const getUserDetailsApi = async (userId: number): Promise<AuthUser> => {
    const res = await api.get<AuthUser>(`/user/getUserDetails/${userId}`);
    return res.data;
}

export const updateProfileImageApi = async (userId: number, formData: FormData): Promise<void> => {
    await api.patch(`/user/updateProfileImage/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        transformRequest: (data) => data,
    });
};

export const updateUserDetailsApi = async (userId: number, details: {
    personalEmail: string,
    phone: string,
}): Promise<void> => {
    await api.patch(`/user/updateUserDetails/${userId}`, details);
}

export const markOnboarded = async (userId: number): Promise<void> =>
    api.patch(`/user/markOnboarded/${userId}`)