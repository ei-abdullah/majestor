import {Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import GradientView from "@/src/components/GradientView";


function UserSettings() {
    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 justify-start">
                <Text>User settings</Text>
            </SafeAreaView>
        </GradientView>
    );

}

export default UserSettings;