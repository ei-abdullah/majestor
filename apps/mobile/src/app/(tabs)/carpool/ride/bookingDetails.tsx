import React from "react";
import {useSelectedBookingStore} from "@/src/stores/selectedBookingStore";
import BookingDetails from "@/src/components/screens/carpool/ride/BookingDetails";

export default function BookingDetailsScreen() {
    const {booking} = useSelectedBookingStore();

    if (!booking) return null;

    return <BookingDetails booking={booking}/>;
}
