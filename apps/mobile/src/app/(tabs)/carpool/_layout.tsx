import {Stack} from "expo-router";
import CustomHeader from "@/src/components/ui/CustomHeader";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                header: ({options, navigation}) => (
                    <CustomHeader
                        title={options.title ?? "Carpool"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}

                        rightIcon={navigation.getState().index > 1 ? "home" : undefined}
                        onRightPress={() => navigation.canGoBack() ? navigation.popToTop() : undefined}
                    />
                )
            }}
        >
            {/* Home Screen */}
            <Stack.Screen
                name={"index"}
                options={{headerShown: false}}
            />

            {/* Book a Ride Screen */}
            <Stack.Screen
                name={"bookRide"}
                options={{title: "Book Ride"}}
            />

            {/*  Post a Ride Screen */}
            <Stack.Screen
                name={"postRide"}
                options={{title: "Post Ride"}}
            />

            {/* Ride Details Screen */}
            <Stack.Screen
            name={"rideDetails"}
            options={{title: "Ride Details"}}
            />

            {/* Rides List Screen */}
            <Stack.Screen
            name={"ridesList"}
            options={{title: "Rides List"}}
            />
        </Stack>
    );
}