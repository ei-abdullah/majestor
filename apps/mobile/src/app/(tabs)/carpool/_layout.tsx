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
                options={{
                    title: "Carpool",
                    headerShown: false,
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