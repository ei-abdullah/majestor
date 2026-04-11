import React, {useState} from "react";
import {View, Text} from "react-native";
import {Image} from "expo-image";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

import AuthTabs from "@/src/components/screens/auth/AuthTabs";
import LoginForm from "@/src/components/screens/auth/LoginForm";
import SignupForm from "@/src/components/screens/auth/SignupForm";
import Card from "@/src/components/ui/Card";
import GradientView from "@/src/components/ui/GradientView";

interface Option {
    name: "error" | "success",
    message: string,
}

function Auth() {
    const [tab, setTab] = useState<"Login" | "Signup">("Login");
    const [message, setMessage] = useState<Option | null>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleTabChange = (tab: "Login" | "Signup") => {
        setMessage(null);
        setTab(tab);
    }

    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 pt-8 justify-start">
                <KeyboardAwareScrollView
                    bottomOffset={62}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    <View className={"flex-row items-center mb-16 gap-4"}>
                        <View style={{borderRadius: 20, overflow: "hidden"}}>
                            <Image
                                source={require("@/assets/images/majestor-logo.png")}
                                style={{width: 60, height: 60}}
                            />
                        </View>
                        <View>
                            <Text className={"font-bold text-2xl"}>Majestor</Text>
                            <Text className={"font-normal text-sm text-mj-text-secondary"}>Your campus life,
                                unified</Text>
                        </View>
                    </View>
                    {message && (
                        <Card className={"bg-red-50 border border-red-200 mb-4 p-8"}>
                            <View>
                                <Text
                                    className={`text-center font-medium ${message.name === "error" ? "text-red-600" : "text-green-600"}`}
                                >
                                    {message.message}
                                </Text>
                            </View>
                        </Card>
                    )}
                    <Card className={"p-8"}>
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
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </GradientView>
    );
}

export default Auth;