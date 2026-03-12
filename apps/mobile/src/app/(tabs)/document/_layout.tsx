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
                        title={options.title ?? "Settings"}

                        // Left Arrow Icon: go back to the previous screen
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}

                        // Home Icon: go to the home page of the document stack
                        rightIcon={navigation.getState().index > 1 ? "home" : undefined}
                        onRightPress={() => navigation.canGoBack() ? navigation.popToTop() : undefined}
                    />
                )
            }}
        >
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Document"
                }}
            />
            <Stack.Screen
                name={"upload"}
                options={{
                    title: "Upload Document"
                }}
            />
        </Stack>
    )
}