import {useState} from "react";
import {View, Text} from "react-native";
import {Image} from "expo-image";
import {SafeAreaView} from "react-native-safe-area-context";

import AuthTabs from "@/src/components/auth/authTabs";
import LoginForm from "@/src/components/auth/LoginForm";
import SignupForm from "@/src/components/auth/SignupForm";
import Card from "@/src/components/Card";


export default function AuthScreen() {
    const [tab, setTab] = useState<"Login" | "Signup">("Login");

    return (
        <SafeAreaView className="flex-1 bg-mj-bg-light px-6 pt-8 justify-start">
            <View className={"flex-row items-center mb-16 gap-4"}>
                <View>
                    <Image source={require("@/assets/images/icon.png")} style={{width: 60, height: 60}}/>
                </View>
                <View>
                    <Text className={"font-bold text-2xl"}>Majestor</Text>
                    <Text className={"font-normal text-sm text-mj-text-secondary"}>Your campus life, unified</Text>
                </View>
            </View>
            <Card className={"px-8"}>
                <AuthTabs value={tab} onChange={setTab}/>

                <View className="mt-8">
                    {tab === "Login" ? <LoginForm/> : <SignupForm/>}
                </View>
            </Card>
        </SafeAreaView>
    );
}