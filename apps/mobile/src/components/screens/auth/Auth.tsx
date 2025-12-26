import React, {useState} from "react";
import {View, Text, ScrollView} from "react-native";
import {Image} from "expo-image";
import {SafeAreaView} from "react-native-safe-area-context";

import AuthTabs from "@/src/components/screens/auth/AuthTabs";
import LoginForm from "@/src/components/screens/auth/LoginForm";
import SignupForm from "@/src/components/screens/auth/SignupForm";
import Card from "@/src/components/Card";
import GradientView from "@/src/components/GradientView";

type option = {
    name: "error" | "success";
    message: string;
}

function Auth() {
    const [tab, setTab] = useState<"Login" | "Signup">("Login");
    const [message, setMessage] = useState<option | null>({
        name: "error",
        message: "We're currently implementing forgot password feature. Please remember yours for time being."
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleTabChange = (tab: "Login" | "Signup") => {
        setMessage(null);
        setTab(tab);
    }

    return (
        <GradientView>

            <SafeAreaView className="flex-1 px-6 pt-8 justify-start">
                <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View className={"flex-row items-center mb-16 gap-4"}>
                        <View>
                            <Image source={require("@/assets/images/icon.png")} style={{width: 60, height: 60}}/>
                        </View>
                        <View>
                            <Text className={"font-bold text-2xl"}>Majestor</Text>
                            <Text className={"font-normal text-sm text-mj-text-secondary"}>Your campus life,
                                unified</Text>
                        </View>
                    </View>
                    {message && (
                        <Card className={"bg-red-50 border border-red-200 mb-4 p-2"}>
                            <View>
                                <Text
                                    className={`text-center font-medium ${message.name === "error" ? "text-red-600" : "text-green-600"}`}
                                >
                                    {message.message}
                                </Text>
                            </View>
                        </Card>
                    )}
                    <Card className={"px-8"}>
                        <AuthTabs
                            value={tab}
                            loading={loading}
                            onChange={handleTabChange}
                        />

                        <View className="mt-8">
                            {tab === "Login" ?
                                <LoginForm
                                    loading={loading}
                                    setLoading={setLoading}
                                    setMessage={setMessage}
                                /> :
                                <SignupForm
                                    loading={loading}
                                    setLoading={setLoading}
                                    setMessage={setMessage}
                                    setTab={setTab}
                                />
                            }
                        </View>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </GradientView>
    );
}

export default Auth;