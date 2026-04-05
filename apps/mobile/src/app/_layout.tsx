import {TextEncoder, TextDecoder} from "text-encoding";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React, {useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";
import {Stack, usePathname} from "expo-router";
import Toast from "react-native-toast-message";
import {QueryClientProvider, QueryClient, QueryCache, MutationCache} from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native"

import "./global.css"
import {useAuthStore} from "@/src/stores/authStore";
import {isRunningInExpoGo} from "expo";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import PremiumModal from "@/src/components/ui/PremiumModal";

const client = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: any, query) => {
            if (error?._sentryReported) return;
            // Ignore 401/403 as they are handled by auth flow
            if (error?.response?.status === 401 || error?.response?.status === 403) return;

            Sentry.captureException(error, {
                extra: {
                    queryKey: query.queryKey,
                }
            });
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: any, _variables, _context, mutation) => {
            if (error?._sentryReported) return;
            if (error?.response?.status === 401 || error?.response?.status === 403) return;

            Sentry.captureException(error, {
                extra: {
                    mutationKey: mutation.options.mutationKey,
                }
            });
        },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60,
        }
    }
});

const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo()
})

Sentry.init({
    dsn: 'https://955f5849bf09988aeed526b5b587d901@o4511044632903680.ingest.de.sentry.io/4511044954423376',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    // enableLogs: __DEV__,
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

function RootLayout() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());
    const pathname = usePathname();

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

    if (!hydrated) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <QueryClientProvider client={client}>
                    <Stack>
                        <Stack.Protected guard={!isLoggedIn}>
                            <Stack.Screen name={"(auth)"} options={{headerShown: false}}/>
                        </Stack.Protected>

                        <Stack.Protected guard={isLoggedIn}>
                            <Stack.Screen name={"(tabs)"} options={{headerShown: false}}/>
                            <Stack.Screen name={"chat"} options={{headerShown: false}}/>
                        </Stack.Protected>

                    </Stack>
                </QueryClientProvider>
                <Toast
                    position={'top'}
                />
                <PremiumModal />
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default Sentry.wrap(RootLayout);
