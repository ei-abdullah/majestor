import {AxiosResponse} from "axios";

import api from "@/src/services/index";
import {CreateBookingDetails, GetBookingsResponse, GetBookingStatusResponse} from "@/src/types/booking";

export const createBookingApi = async (
    rideRequestId: number,
    rideId: number,
    createBookingDetails: CreateBookingDetails
): Promise<void> => {
    await api.post(`/booking/createBooking/${rideRequestId}/${rideId}`, createBookingDetails);
}

export const getBookingsApi = async (
    rideId: number
): Promise<GetBookingsResponse[]> => {
    const res: AxiosResponse<GetBookingsResponse[]> = await api.get(`/booking/getBookings/${rideId}`);
    return res.data;
}

export const getBookingStatusApi = async (bookingId: number): Promise<GetBookingStatusResponse> => {
    const res: AxiosResponse<GetBookingStatusResponse> = await api.get(`/booking/getBookingStatus/${bookingId}`);
    return res.data;
}

export const acceptBookingApi = async (bookingId: number): Promise<void> => {
    await api.patch(`/booking/acceptBooking/${bookingId}`);
}

export const rejectBookingApi = async (bookingId: number): Promise<void> => {
    await api.patch(`/booking/rejectBooking/${bookingId}`);
}