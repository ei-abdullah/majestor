import React, {useEffect} from "react";
import {Pressable, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import {useAuthStore} from "@/src/stores/authStore";
import GradientView from "@/src/components/GradientView";

export default function DocumentUploadScreen() {
    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 justify-start">
                <Text>Upload Screen and will be able to upload documents</Text>
            </SafeAreaView>
        </GradientView>
    );
}

