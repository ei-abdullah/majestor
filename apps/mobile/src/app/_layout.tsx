import {Stack} from "expo-router";
import React from "react";

import "./global.css"

import {useAuthStore} from "@/src/stores/authStore";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

export default function RootLayout() {

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 2,
                staleTime: 1000 * 60,
            }
        }
    });

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
        </React.Fragment>
    )
}
