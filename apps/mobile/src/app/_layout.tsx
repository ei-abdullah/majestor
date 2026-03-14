import React, {useEffect, useState} from "react";
import {Stack} from "expo-router";
import Toast from "react-native-toast-message";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ActivityIndicator, View} from "react-native";

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

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Buffer = Buffer;

export default function RootLayout() {
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
