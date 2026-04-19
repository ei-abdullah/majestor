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
                        title={options.title ?? "Notifications"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
                        rightIcon={navigation.getState().index > 0 ? "home" : undefined}
                        onRightPress={() => navigation.canGoBack() ? navigation.popToTop() : undefined}
                    />
                )
            }}
        >
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Notifications"
                }}
            />
        </Stack>
    )
}