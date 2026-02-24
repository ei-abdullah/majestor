import {useMutation, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import {RecentRideResponse, UploadRideDetails, UploadRideResponse} from "@/src/types/ride";
import {recentRidesApi, uploadRideApi} from "@/src/services/ride.api";


export const useUploadRide = (onCallback?: (data:UploadRideResponse) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ride"],
        mutationFn: ({uploadRideDetails, userId,}: {
            uploadRideDetails: UploadRideDetails, userId: number
        }) => uploadRideApi(uploadRideDetails, userId),
        onSuccess: async (data: UploadRideResponse) => {
            await queryClient.invalidateQueries({queryKey: ["ride"]})
            Toast.show({
                type: "success",
                text1: "Ride Request Submitted Successfully",
                position: "top"
            })
            onCallback?.(data);
        },
        onError: (error: any) => {
            Toast.show({
                type: "error",
                text1: "Failed to Submit Ride Request",
                text2: error?.response?.data?.message || error?.message || "There was an error submitting your ride request",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}

export const useRecentRides = (options?: Partial<UseQueryOptions<RecentRideResponse[]>>) => {
    return useQuery({
        queryKey: ["ride"],
        queryFn: () => recentRidesApi(),
        enabled: true,
        ...options
    })
}