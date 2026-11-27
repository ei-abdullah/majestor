import React, {useEffect} from "react";
import {Href, useRouter} from "expo-router";
import {useSelectedBookingStore} from "@/src/stores/selectedBookingStore";
import {useRideStore} from "@/src/stores/rideStore";
import {useGetBookingDetails} from "@/src/queries/booking.queries";
import BookingDetails from "@/src/components/screens/carpool/ride/BookingDetails";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";

export default function BookingDetailsScreen() {
    const router = useRouter();
    const {booking, setBooking} = useSelectedBookingStore();
    const {bookingId, id: rideId} = useRideStore();

    const {data: fetchedBooking, isPending, isError} = useGetBookingDetails(
        !booking && bookingId ? bookingId : 0
    );

    useEffect(() => {
        if (!booking && fetchedBooking) {
            setBooking(fetchedBooking);
        }
    }, [booking, fetchedBooking, setBooking]);

    useEffect(() => {
        if (!booking && (!bookingId || isError)) {
            if (rideId) {
                router.replace("/(tabs)/carpool/ride/bookingRequests" as Href);
            } else {
                router.replace("/(tabs)/carpool" as Href);
            }
        }
    }, [booking, bookingId, isError, rideId, router]);

    const activeBooking = booking ?? fetchedBooking;

    if (!activeBooking) {
        if (isPending && bookingId) return <LoadingIndicator/>;
        return null;
    }

    return <BookingDetails booking={activeBooking}/>;
}
