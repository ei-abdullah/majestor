import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getUserDetailsApi, updateProfileImageApi, updateUserDetailsApi} from "@/src/services/user.api";

export const useUserDetails = (userId: number) => {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => getUserDetailsApi(userId),
        enabled: Boolean(userId),
    })
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