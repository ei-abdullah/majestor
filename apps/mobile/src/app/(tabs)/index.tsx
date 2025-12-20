import React, {useEffect} from "react";
import {Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {useAuthStore} from "@/src/stores/authStore";
import GradientView from "@/src/components/GradientView";

export default function Index() {
    const {user} = useAuthStore();

    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 pt-8 justify-start">
                <Text>{user?.username}</Text>
            </SafeAreaView>
        </GradientView>
    );
}

