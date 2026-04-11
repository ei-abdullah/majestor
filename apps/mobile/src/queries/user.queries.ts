import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getUserDetailsApi, updateProfileImageApi, updateUserDetailsApi} from "@/src/services/user.api";
import {useEffect} from "react";
import {useAuthStore} from "@/src/stores/authStore";

export const useUserDetails = (userId: number) => {
    const updateUser = useAuthStore(state => state.updateUser);
    
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const data = await getUserDetailsApi(userId);
            updateUser(data);
            return data;
        },
        enabled: Boolean(userId),
    });
}

export const useUpdateProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["user"],
        mutationFn: ({userId, formData}: {
            userId: number,
            formData: FormData
        }) => updateProfileImageApi(userId, formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["user"]})
        }
    })
}

export const useUpdateUserDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["user"],
        mutationFn: ({userId, details}: {
            userId: number,
            details: {
                personalEmail: string;
                phone: string;
            }
        }) => updateUserDetailsApi(userId, details),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["user"]})
        }
    })
}