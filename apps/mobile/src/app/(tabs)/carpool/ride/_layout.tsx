import {Stack} from "expo-router";
import CustomHeader from "@/src/components/ui/CustomHeader";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                header: ({options, navigation}) => (
                    <CustomHeader
                        title={options.title ?? "Ride"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
                        rightIcon={navigation.getState().index > 1 ? "home" : undefined}
                        onRightPress={() => navigation.canGoBack() ? navigation.popToTop() : undefined}
                    />
                )
            }}
        >
            <Stack.Screen
                name={"postRide"}
                options={{
                    title: "Post a Ride"
                }}
            />
            <Stack.Screen
                name={"bookingRequests"}
                options={{
                    title: "Booking Requests"
                }}
            />
            <Stack.Screen
                name={"bookingDetails"}
                options={{
                    title: "Booking Details"
                }}
            />
        </Stack>
    );
}