import {View, Text} from "react-native";
import {useRideStore} from "@/src/stores/rideStore";

export default function BookingRequests() {
    const ride = useRideStore();

    return (
        <View>
            <Text>Booking Request</Text>
        </View>
    )
}