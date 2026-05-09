import React, {useState} from "react";
import {View, Text} from "react-native";
import {Image} from "expo-image";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {Feather} from "@expo/vector-icons";

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
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAwareScrollView
                    bottomOffset={62}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 40}}
                >
                    {/* ── Branding ─────────────────────────────────────────── */}
                    <View style={{alignItems: 'center', paddingTop: 48, paddingBottom: 36}}>
                        <View style={{borderRadius: 22, overflow: 'hidden', marginBottom: 16}}>
                            <Image
                                source={require("@/assets/images/majestor-logo.png")}
                                style={{width: 68, height: 68}}
                            />
                        </View>
                        <Text style={{
                            fontSize: 28,
                            fontFamily: 'Inter_800ExtraBold',
                            color: '#1A2340',
                            letterSpacing: -0.8,
                            marginBottom: 6,
                        }}>
                            Majestor
                        </Text>
                    </View>

                    {/* ── Form card ─────────────────────────────────────────── */}
                    <Card className="p-6">
                        <Text style={{
                            fontSize: 17,
                            fontFamily: 'Inter_800ExtraBold',
                            color: '#1A2340',
                            marginBottom: 4,
                        }}>
                            {tab === "Login" ? "Welcome back" : "Create account"}
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            fontFamily: 'Inter_400Regular',
                            color: '#9CA3AF',
                            marginBottom: 20,
                        }}>
                            {tab === "Login"
                                ? "Sign in with your university email"
                                : "Join your university community"}
                        </Text>

                        <AuthTabs
                            value={tab}
                            loading={loading}
                            onChange={handleTabChange}
                        />

                        {/* Message banner */}
                        {message && (
                            <View style={{
                                marginTop: 16,
                                padding: 14,
                                borderRadius: 12,
                                backgroundColor: message.name === 'error' ? '#FEF2F2' : '#F0FDF4',
                                borderWidth: 1,
                                borderColor: message.name === 'error' ? '#FECACA' : '#BBF7D0',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                gap: 10,
                            }}>
                                <Feather
                                    name={message.name === 'error' ? 'alert-circle' : 'check-circle'}
                                    size={16}
                                    color={message.name === 'error' ? '#DC2626' : '#16A34A'}
                                    style={{marginTop: 1}}
                                />
                                <Text style={{
                                    flex: 1,
                                    fontSize: 13,
                                    fontFamily: 'Inter_500Medium',
                                    color: message.name === 'error' ? '#DC2626' : '#16A34A',
                                    lineHeight: 18,
                                }}>
                                    {message.message}
                                </Text>
                            </View>
                        )}

                        <View style={{marginTop: 24}}>
                            {tab === "Login" ? (
                                <LoginForm
                                    loading={loading}
                                    setLoading={setLoading}
                                    setMessage={setMessage}
                                />
                            ) : (
                                <SignupForm
                                    loading={loading}
                                    setLoading={setLoading}
                                    setMessage={setMessage}
                                    setTab={setTab}
                                />
                            )}
                        </View>
                    </Card>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </GradientView>
    );
}

export default Auth;