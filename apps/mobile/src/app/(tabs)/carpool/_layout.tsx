import {Stack} from "expo-router";
import CustomHeader from "@/src/components/ui/CustomHeader";
import {useLocationPermissions} from "@/src/hooks/useLocationPermissions";

export default function Layout() {
    useLocationPermissions();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
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
                options={{
                    title: "Carpool",
                }}
            />
            <Stack.Screen
                name={"ride"}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={"rideRequest"}
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}