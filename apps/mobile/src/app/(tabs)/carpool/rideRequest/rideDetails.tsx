import React from "react";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";
import RideDetails from "@/src/components/screens/carpool/rideRequest/RideDetails";

export default function RideDetailsScreen() {
    const {ride} = useSelectedRideStore();

    if (!ride) return null;

    return <RideDetails ride={ride}/>;
}