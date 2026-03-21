import Toast from "react-native-toast-message";
import {useMutation, useQuery, useQueryClient, UseQueryOptions} from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";
import {
    acceptBookingApi,
    createBookingApi,
    getBookingsApi,
    getBookingStatusApi,
    rejectBookingApi
} from "@/src/services/booking.api";
import {
    CreateBookingDetails,
    CreateBookingResponse,
    GetBookingsResponse,
    GetBookingStatusResponse
} from "@/src/types/booking";

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
            onCallback?.(data);
        },
        onError: (error: any) => {
            Sentry.captureException(error);
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
        ...options,
    })
}

export const useGetBookingStatus = (bookingId: number, options?: Partial<UseQueryOptions<GetBookingStatusResponse>>) => {
    return useQuery({
        queryKey: ["bookingStatus", bookingId],
        queryFn: () => getBookingStatusApi(bookingId),
        enabled: Boolean(bookingId),
        ...options,
    })
}

export const useAcceptBooking = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["booking"],
        mutationFn: (bookingId: number) => acceptBookingApi(bookingId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["booking"]})
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
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
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to Reject Booking",
                text2: error?.response?.data?.message || error?.message || "There was an error rejecting your booking",
            })
        }
    })
}