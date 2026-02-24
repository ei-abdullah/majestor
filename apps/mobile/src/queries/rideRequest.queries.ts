import {useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import {uploadRideRequestApi} from "@/src/services/rideRequest.api";
import {UploadRideRequestDetails, UploadRideRequestResponse} from "@/src/types/rideRequest";
import {UploadRideResponse} from "@/src/types/ride";


export const useUploadRideRequest = (onCallback?: (data:UploadRideRequestResponse) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["rideRequest"],
        mutationFn: ({uploadRideRequestDetails, userId}: {
            uploadRideRequestDetails: UploadRideRequestDetails, userId: number
        }) => uploadRideRequestApi(uploadRideRequestDetails, userId),
        onSuccess: async (data: UploadRideRequestResponse) => {
            await queryClient.invalidateQueries({queryKey: ["rideRequest"]})
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