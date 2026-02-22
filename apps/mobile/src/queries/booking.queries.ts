import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    acceptBookingApi,
    createBookingApi,
    getBookingsApi,
    getBookingStatusApi,
    rejectBookingApi
} from "@/src/services/booking.api";
import {CreateBookingDetails} from "@/src/types/booking";
import Toast from "react-native-toast-message";

export const useCreateBooking = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    useMutation({
        mutationKey: ["booking"],
        mutationFn: ({createBookingDetails, rideRequestId, rideId}: {
            createBookingDetails: CreateBookingDetails,
            rideRequestId: number,
            rideId: number
        }) => createBookingApi(createBookingDetails, rideRequestId, rideId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["booking"]})
            Toast.show({
                type: "success",
                text1: "Booking Submitted Successfully",
                position: "top"
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Toast.show({
                type: "error",
                text1: "Failed to Submit Booking",
                text2: error?.response?.data?.message || error?.message || "There was an error submitting your booking",
                position: "top",
                visibilityTime: 4000,
            })
        }
    })
}

export const useGetBookings = (rideId: number) => {
    return useQuery({
        queryKey: ["booking"],
        queryFn: () => getBookingsApi(rideId),
        enabled: Boolean(rideId),
    })
}

export const useGetBookingStatus = (bookingId: number, onCallback?: () => void) => {
    return useQuery({
        queryKey: ["bookingStatus", bookingId],
        queryFn: () => getBookingStatusApi(bookingId),
        enabled: Boolean(bookingId),
    })
}

export const acceptBooking = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    useMutation({
        mutationKey: ["booking"],
        mutationFn: (bookingId: number) => acceptBookingApi(bookingId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["booking"]})
            Toast.show({
                type: "success",
                text1: "Booking Accepted Successfully",
                position: "top"
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Toast.show({
                type: "error",
                text1: "Failed to Accept Booking",
                text2: error?.response?.data?.message || error?.message || "There was an error accepting your booking",
            })
        }
    })
}

export const useRejectBooking = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    useMutation({
        mutationKey: ["booking"],
        mutationFn: (bookingId: number) => rejectBookingApi(bookingId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["booking"]})
            Toast.show({
                type: "success",
                text1: "Booking Rejected Successfully",
                position: "top"
            })
            onCallback?.();
        },
        onError: (error: any) => {
            Toast.show({
                type: "error",
                text1: "Failed to Reject Booking",
                text2: error?.response?.data?.message || error?.message || "There was an error rejecting your booking",
            })
        }
    })
}