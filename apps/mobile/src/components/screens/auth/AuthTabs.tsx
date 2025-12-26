import {View} from "react-native";
import {useCallback} from "react";

import TabButton from "@/src/components/TabButton";

type AuthTab = "Login" | "Signup";

type props = {
    value: AuthTab;
    loading: boolean;
    onChange: (tab: AuthTab) => void;
}

function AuthTabs({value, loading, onChange}: props) {

    const handleLoginPress = useCallback(() => onChange("Login"), [onChange]);
    const handleSignupPress = useCallback(() => onChange("Signup"), [onChange])

    return (
        <View className={"flex-row bg-mj-bg-light rounded-2xl p-1"}>
            <TabButton
                label={"Login"}
                disabled={loading}
                active={value === "Login"}
                onPress={handleLoginPress}
            />
            <TabButton
                label={"Signup"}
                disabled={loading}
                active={value === "Signup"}
                onPress={handleSignupPress}
            />
        </View>
    )
}

export default AuthTabs;