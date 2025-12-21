import React, {useEffect} from "react";
import {Pressable, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {useAuthStore} from "@/src/stores/authStore";
import GradientView from "@/src/components/GradientView";
import {Link} from "expo-router";

export default function UserSettingsScreen() {
    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 justify-start">
                <Text>User settings</Text>
            </SafeAreaView>
        </GradientView>
    );
}

