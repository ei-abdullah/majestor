import {TextEncoder, TextDecoder} from "text-encoding";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React, {useEffect, useState} from "react";
import {ActivityIndicator, View, Platform} from "react-native";
import {Stack, usePathname} from "expo-router";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient as client} from "@/src/lib/queryClient";
import * as Sentry from "@sentry/react-native"

import "./global.css"
import {
    useFonts as useInter,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import {
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {useAuthStore} from "@/src/stores/authStore";
import {isRunningInExpoGo} from "expo";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {KeyboardProvider} from "react-native-keyboard-controller";
import PremiumModal from "@/src/components/ui/PremiumModal";
import {useRegisterPushToken} from "@/src/queries/notification.queries";
import NetworkErrorScreen from "@/src/components/ui/NetworkErrorScreen";

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        });
    },
});

if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3A6FF8',
    });
}


const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo()
})

Sentry.init({
    dsn: 'https://955f5849bf09988aeed526b5b587d901@o4511044632903680.ingest.de.sentry.io/4511044954423376',
    sendDefaultPii: false,
    integrations: [navigationIntegration, Sentry.feedbackIntegration()],
});

function PushTokenRegistrar() {
    const user = useAuthStore((state) => state.user);
    const {mutate: registerPushToken} = useRegisterPushToken();

    useEffect(() => {
        if (user?.id) {
            registerPushToken(user.id);
        }
    }, [user?.id]);

    return null;
}

function RootLayout() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());
    const pathname = usePathname();

    const [fontsLoaded] = useInter({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
        PlusJakartaSans_800ExtraBold,
    });

    useEffect(() => {
        Sentry.addBreadcrumb({
            category: "navigation",
            message: `Route changed to ${pathname}`,
            level: "info",
        });
    }, [pathname]);

    useEffect(() => {
        return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    }, []);

    if (!hydrated || !fontsLoaded) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
                <BottomSheetModalProvider>
                    <QueryClientProvider client={client}>
                        <PushTokenRegistrar/>
                        <NetworkErrorScreen queryClient={client}/>
                        <Stack screenOptions={{animation: 'fade'}}>
                            <Stack.Protected guard={!isLoggedIn}>
                                <Stack.Screen name={"(auth)"} options={{headerShown: false}}/>
                            </Stack.Protected>

                            <Stack.Protected guard={isLoggedIn}>
                                <Stack.Screen name={"(tabs)"} options={{headerShown: false}}/>
                                <Stack.Screen name={"chat"} options={{headerShown: false}}/>
                                <Stack.Screen name={"groupchat"} options={{headerShown: false}}/>
                                <Stack.Screen name={"notification"} options={{headerShown: false}}/>
                            </Stack.Protected>

                        </Stack>
                    </QueryClientProvider>
                    <Toast
                        position={'top'}
                    />
                    <PremiumModal />
                </BottomSheetModalProvider>
            </KeyboardProvider>
        </GestureHandlerRootView>
    )
}

export default Sentry.wrap(RootLayout);
