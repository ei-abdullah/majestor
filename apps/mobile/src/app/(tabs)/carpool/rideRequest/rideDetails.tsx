import React, {useEffect} from "react";
import {Href, useRouter} from "expo-router";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import RideDetails from "@/src/components/screens/carpool/rideRequest/RideDetails";

export default function RideDetailsScreen() {
    const router = useRouter();
    const {ride} = useSelectedRideStore();
    const {id: rideRequestId} = useRideRequestStore();

    useEffect(() => {
        if (!ride) {
            if (rideRequestId) {
                router.replace("/(tabs)/carpool/rideRequest/availableRides" as Href);
            } else {
                router.replace("/(tabs)/carpool" as Href);
            }
        }
    }, [ride, rideRequestId, router]);

    if (!ride) return null;

    return <RideDetails ride={ride}/>;
}
