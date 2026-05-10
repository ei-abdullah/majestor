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
                        title={options.title ?? "Ride"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => router.replace("/(tabs)/carpool" as Href)}
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