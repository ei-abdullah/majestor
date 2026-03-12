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
                        title={options.title ?? "Ride Request"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
                        rightIcon={navigation.getState().index > 1 ? "home" : undefined}
                        onRightPress={() => navigation.canGoBack() ? navigation.popToTop() : undefined}
                    />
                )
            }}
        >
            <Stack.Screen
                name={"bookRide"}
                options={{
                    title: "Book a Ride"
                }}
            />
            <Stack.Screen
                name={"availableRides"}
                options={{
                    title: "Available Rides"
                }}
            />
            <Stack.Screen
                name={"rideDetails"}
                options={{
                    title: "Ride Details"
                }}
            />
        </Stack>
    );
}