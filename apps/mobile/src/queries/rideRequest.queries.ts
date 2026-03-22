import {useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";

import {cancelRideRequestApi, uploadRideRequestApi} from "@/src/services/rideRequest.api";
import {UploadRideRequestDetails, UploadRideRequestResponse} from "@/src/types/rideRequest";


export const useUploadRideRequest = (onCallback?: (data:UploadRideRequestResponse) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["rideRequest"],
        mutationFn: ({uploadRideRequestDetails, userId}: {
            uploadRideRequestDetails: UploadRideRequestDetails, userId: number
        }) => uploadRideRequestApi(uploadRideRequestDetails, userId),
        onSuccess: async (data: UploadRideRequestResponse) => {
            await queryClient.invalidateQueries({queryKey: ["rideRequest"]})
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

export const useCancelRideRequest = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["rideRequest"],
        mutationFn: (rideRequestId: number) => cancelRideRequestApi(rideRequestId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["rideRequest"]})
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to cancel Ride Request",
                text2: error?.response?.data?.message || error?.message || "There was an error cancelling your ride request",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}