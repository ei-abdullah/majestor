import Toast from "react-native-toast-message";
import {useIsFocused} from "@react-navigation/core";
import {useMutation, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import {
    acceptBookingApi,
    createBookingApi,
    getBookingsApi,
    getBookingStatusApi,
    rejectBookingApi
} from "@/src/services/booking.api";
import {CreateBookingDetails, CreateBookingResponse, GetBookingsResponse} from "@/src/types/booking";
import {RecentRideResponse} from "@/src/types/ride";

export const useCreateBooking = (onCallback?: (data: CreateBookingResponse) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["booking"],
        mutationFn: ({createBookingDetails, rideRequestId, rideId}: {
            createBookingDetails: CreateBookingDetails,
            rideRequestId: number,
            rideId: number
        }) => createBookingApi(createBookingDetails, rideRequestId, rideId),
        onSuccess: async (data: CreateBookingResponse) => {
            await queryClient.invalidateQueries({queryKey: ["booking"]})
            Toast.show({
                type: "success",
                text1: "Booking Submitted Successfully",
                position: "top"
            })
            onCallback?.(data);
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

export const useGetBookings = (rideId: number, options?: Partial<UseQueryOptions<GetBookingsResponse[]>>) => {
    return useQuery({
        queryKey: ["booking"],
        queryFn: () => getBookingsApi(rideId),
        enabled: Boolean(rideId),
    })
}

export const useGetBookingStatus = (bookingId: number | undefined, onCallback?: () => void) => {
    const isFocused = useIsFocused();

    return useQuery({
        queryKey: ["bookingStatus", bookingId],
        queryFn: () => getBookingStatusApi(bookingId!),
        enabled: Boolean(bookingId) && isFocused,
        refetchInterval: (query) => {
            if (!isFocused) return false;            // stop polling when the screen is not focused
            const status = query.state.data?.status;
            if (status === "ACCEPTED" || status === "REJECTED") return false; // stop on terminal status
            return 10000;
        },
        refetchIntervalInBackground: false,
    })
}

export const useAcceptBooking = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
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

    return useMutation({
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