import {useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import {uploadRideRequestApi} from "@/src/services/rideRequest.api";
import {UploadRideRequestDetails} from "@/src/types/rideRequest";


export const useUploadRideRequest = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    useMutation({
        mutationKey: ["rideRequest"],
        mutationFn: ({uploadRideRequestDetails, userId}: {
            uploadRideRequestDetails: UploadRideRequestDetails, userId: number
        }) => uploadRideRequestApi(uploadRideRequestDetails, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["rideRequest"]})
            Toast.show({
                type: "success",
                text1: "Ride Request Submitted Successfully",
                position: "top"
            })
            onCallback?.();
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