import { TextEncoder, TextDecoder } from "text-encoding"
import { Buffer } from 'buffer';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Buffer = Buffer;

import React, {useEffect, useState} from "react";
import {Stack} from "expo-router";
import Toast from "react-native-toast-message";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ActivityIndicator, View} from "react-native";
import * as Sentry from "@sentry/react-native"

import "./global.css"
import {useAuthStore} from "@/src/stores/authStore";

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60,
        }
    }
});

Sentry.init({
    dsn: 'https://955f5849bf09988aeed526b5b587d901@o4511044632903680.ingest.de.sentry.io/4511044954423376',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
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

    useEffect(() => {
        const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
        return unsub;
    }, []);

    if (!hydrated) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <React.Fragment>
            <QueryClientProvider client={client}>
                <Stack>
                    <Stack.Protected guard={!isLoggedIn}>
                        <Stack.Screen name={"(auth)"} options={{headerShown: false}}/>
                    </Stack.Protected>

                    <Stack.Protected guard={isLoggedIn}>
                        <Stack.Screen name={"(tabs)"} options={{headerShown: false}}/>
                    </Stack.Protected>

                </Stack>
            </QueryClientProvider>
            <Toast
                position={'top'}
            />
        </React.Fragment>
    )
}

export default Sentry.wrap(RootLayout);