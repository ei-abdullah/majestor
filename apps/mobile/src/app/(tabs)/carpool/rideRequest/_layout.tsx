import {Stack, useRouter} from "expo-router";
import {Href} from "expo-router";
import CustomHeader from "@/src/components/ui/CustomHeader";

export default function Layout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
                header: ({options, navigation}) => (
                    <CustomHeader
                        title={options.title ?? "Ride Request"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => router.replace("/(tabs)/carpool" as Href)}
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