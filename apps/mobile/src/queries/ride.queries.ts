import {useMutation, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";

import {RecentRideResponse, UploadRideDetails, UploadRideResponse} from "@/src/types/ride";
import {
    cancelBookedRideApi,
    cancelPostedRideApi,
    completeRideApi,
    recentRidesApi,
    uploadRideApi
} from "@/src/services/ride.api";


export const useUploadRide = (onCallback?: (data: UploadRideResponse) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ride"],
        mutationFn: ({uploadRideDetails, userId}: {
            uploadRideDetails: UploadRideDetails, userId: number
        }) => uploadRideApi(uploadRideDetails, userId),
        onSuccess: async (data: UploadRideResponse) => {
            await queryClient.invalidateQueries({queryKey: ["ride"]})
            onCallback?.(data);
        },
        onError: (error: any) => {
            Sentry.captureException(error);
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

export const useCompleteRide = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ride"],
        mutationFn: ({rideId, bookingId}: {
            rideId: number,
            bookingId: number
        }) => completeRideApi(rideId, bookingId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["ride"]})
            Toast.show({
                type: "success",
                text1: "Ride Completed Successfully",
                position: "top"
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to Complete Ride",
                text2: error?.response?.data?.message || error?.message || "There was an error completing your ride",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}

export const useCancelRide = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ride"],
        mutationFn: ({rideId, bookingId}: {
            rideId: number,
            bookingId: number
        }) => cancelBookedRideApi(rideId, bookingId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["ride"]})
            Toast.show({
                type: "success",
                text1: "Ride Cancelled Successfully",
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to Cancel Ride",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}

export const useCancelPostedRide = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ride"],
        mutationFn: (rideId: number) => cancelPostedRideApi(rideId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["ride"]})
            Toast.show({
                type: "success",
                text1: "Ride Cancelled Successfully",
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to Cancel Ride",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}