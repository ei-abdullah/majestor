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
                        title={options.title ?? "Studyhub"}
                        leftIcon={navigation.canGoBack() ? "arrow-left" : undefined}
                        onLeftPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
                        rightIcon={navigation.getState().index > 0 ? "home" : undefined}
                        onRightPress={() => navigation.canGoBack() ? navigation.popToTop() : undefined}
                    />
                )
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Study Hub",
                }}
            />
            <Stack.Screen
                name="joinedGroups"
                options={{
                    title: "Joined Groups",
                }}
            />
            <Stack.Screen
                name="officialGroup"
                options={{
                    title: "Official Groups",
                }}
            />
            <Stack.Screen
                name="trendingGroup"
                options={{
                    title: "Trending",
                }}
            />
            <Stack.Screen
                name="personalVault"
                options={{
                    title: "My Vault",
                }}
            />
            <Stack.Screen
                name="publicVault"
                options={{
                    title: "Public Vault",
                }}
            />
            <Stack.Screen
                name="studyGroupDetail"
                options={{
                    title: "Group Details",
                }}
            />
            <Stack.Screen
                name="uploadDocument"
                options={{
                    title: "Upload",
                }}
            />
        </Stack>
    )
}
