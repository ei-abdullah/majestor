import {Stack} from "expo-router";

export default function AuthLayout() {
    return <Stack>
        <Stack.Screen name={"authScreen"} options={{headerShown: false}}/>
        <Stack.Screen name={"forgotPassword"} options={{headerShown: false}}/>
    </Stack>;
}

