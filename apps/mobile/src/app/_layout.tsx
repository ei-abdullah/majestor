import React from "react";
import {Stack} from "expo-router";
import Toast from "react-native-toast-message";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

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

export default function RootLayout() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

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
