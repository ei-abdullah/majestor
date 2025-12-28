import {Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import GradientView from "@/src/components/ui/GradientView";
import {useAuthStore} from "@/src/stores/authStore";

function UserSettings() {
    const {user} = useAuthStore();

    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 justify-start">
                <Text>User settings</Text>
                <Text>{user!.id}</Text>
            </SafeAreaView>
        </GradientView>
    );

}

export default UserSettings;