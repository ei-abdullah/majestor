import {Stack} from "expo-router";
import React from "react";

import "./global.css"

import {useAuthStore} from "@/src/stores/authStore";

export default function RootLayout() {

    const isLoggedIn = useAuthStore.getState().isLoggedIn;

    return <React.Fragment>
        <Stack>
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name={"(auth)"} options={{headerShown: false}}/>
            </Stack.Protected>

        </Stack>
    </React.Fragment>
}
