import {useMutation, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";

import {RecentRideResponse, UploadRideDetails, UploadRideResponse} from "@/src/types/ride";
import {FareConfig} from "@/src/utils/fare.utils";
import {
    cancelBookedRideApi,
    cancelPostedRideApi,
    completeRideApi,
    getFareConfigApi,
    getRideByIdApi,
    recentRidesApi,
    RecentRidesQueryParams,
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
                text1: "Failed to Post Ride",
                text2: error?.response?.data?.message || error?.message || "There was an error posting your ride",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}

export const useGetRideById = (rideId: number, options?: Partial<UseQueryOptions<RecentRideResponse>>) => {
    return useQuery({
        queryKey: ["ride", "detail", rideId],
        queryFn: () => getRideByIdApi(rideId),
        enabled: Boolean(rideId),
        ...options
    });
}

export const useRecentRides = (
    params?: RecentRidesQueryParams,
    options?: Partial<UseQueryOptions<RecentRideResponse[]>>
) => {
    return useQuery({
        queryKey: ["ride", params],
        queryFn: () => recentRidesApi(params),
        enabled: true,
        refetchInterval: 30_000,
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
            await queryClient.invalidateQueries({queryKey: ["ride"]});
            await queryClient.invalidateQueries({queryKey: ["booking"]});
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
            await queryClient.invalidateQueries({queryKey: ["ride"]});
            await queryClient.invalidateQueries({queryKey: ["booking"]});
            Toast.show({
                type: "success",
                text1: "Booking Cancelled Successfully",
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to Cancel Booking",
                text2: error?.response?.data?.message || error?.message || "There was an error cancelling the booking",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}

export const useFareConfig = () => {
    return useQuery<FareConfig>({
        queryKey: ['fareConfig'],
        queryFn: getFareConfigApi,
        staleTime: 60 * 60 * 1000,
    });
}

export const useCancelPostedRide = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ride"],
        mutationFn: (rideId: number) => cancelPostedRideApi(rideId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["ride"]});
            await queryClient.invalidateQueries({queryKey: ["booking"]});
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
                text2: error?.response?.data?.message || error?.message || "There was an error cancelling your ride",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}
