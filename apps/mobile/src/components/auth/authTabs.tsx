import {View} from "react-native";
import {TabButton} from "@/src/components/TabButton";
import {useCallback} from "react";

type AuthTab = "Login" | "Signup";

export default function AuthTabs(
    {
        value,
        onChange
    }: {
        value: AuthTab;
        onChange: (tab: AuthTab) => void;
    }) {

    const handleLoginPress = useCallback(() => onChange("Login"), [onChange]);
    const handleSignupPress = useCallback(() => onChange("Signup"), [onChange])

    return (
        <View className={"flex-row bg-mj-bg-light rounded-2xl p-1"}>
            <TabButton
                label={"Login"}
                active={value === "Login"}
                onPress={handleLoginPress}
            />
            <TabButton
                label={"Signup"}
                active={value === "Signup"}
                onPress={handleSignupPress}
            />
        </View>
    )
}