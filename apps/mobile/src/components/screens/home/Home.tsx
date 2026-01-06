import React, {useState} from "react";
import {View, Text, ScrollView, Pressable} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useUserDetails} from "@/src/queries/user.queries";
import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import UserAvatar from "@/src/components/ui/UserAvatar";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {cssInterop} from "nativewind";
import {router} from "expo-router";
import OutlineButton from "@/src/components/ui/OutlineButton";

cssInterop(LinearGradient, {
    className: "style",
});

function Home() {
    const {user, clearSession} = useAuthStore();
    const {data: userDetails, isPending} = useUserDetails(user!.id);
    const [showStory, setShowStory] = useState(false);

    if (isPending) {
        return <LoadingIndicator/>;
    }

    const quickActions = [
        {
            id: 1,
            title: "Documents",
            icon: "file-text" as const,
            route: "/(tabs)/document"
        },
        {
            id: 2,
            title: "Upload",
            icon: "upload" as const,
            route: "/(tabs)/document/upload"
        },
        {
            id: 3,
            title: "Profile",
            icon: "user" as const,
            route: "/(tabs)/user"
        },
    ];

    return (
        <GradientView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 24}}
            >
                <View className="mx-6">
                    {/* Minimal Header */}
                    <View className="mt-10 mb-8">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-gray-500 text-sm mb-1">Hello,</Text>
                                <Text className="text-xl font-bold text-gray-900">
                                    {userDetails?.username?.split(' ')[0] || 'Student'}
                                </Text>
                            </View>
                            <Pressable onPress={() => router.push("/(tabs)/user")}>
                                <UserAvatar
                                    avatarUrl={userDetails?.avatar || null}
                                    username={userDetails?.username || "User"}
                                    onAvatarUpdate={() => {
                                    }}
                                    size={56}
                                    showCamera={false}
                                    editable={false}
                                />
                            </Pressable>
                        </View>
                    </View>

                    {/* University Card */}
                    <Card className="mb-8 overflow-hidden">
                        <LinearGradient
                            colors={['#3A6FF8', '#8DDDD3']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            className="px-5 py-6"
                        >
                            <View className="flex-row items-center mb-2">
                                <Feather name="award" size={18} color="white"/>
                                <Text className="text-white/80 text-xs ml-2 uppercase tracking-wide">
                                    Your Faculty
                                </Text>
                            </View>
                            <Text className="text-white font-bold text-lg">
                                {userDetails?.faculty || 'Faculty of Computing'}
                            </Text>
                            <Text className="text-white/90 text-sm mt-1">
                                {userDetails?.university || 'University'}
                            </Text>
                        </LinearGradient>
                    </Card>

                    {/* Quick Actions */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-5">Quick Access</Text>
                        <View className="flex-row justify-between gap-4">
                            {quickActions.map((action) => (
                                <Pressable
                                    key={action.id}
                                    onPress={() => router.push(action.route as any)}
                                    className="flex-1"
                                >
                                    <Card className="items-center py-6">
                                        <View className="bg-blue-50 rounded-full p-4 mb-3">
                                            <Feather name={action.icon} size={24} color="#3A6FF8"/>
                                        </View>
                                        <Text className="text-sm font-medium text-gray-700">
                                            {action.title}
                                        </Text>
                                    </Card>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Logout Button */}
                    <OutlineButton
                        title={"Logout"}
                        onPress={clearSession}
                        variant={'secondary'}
                    />
                </View>
            </ScrollView>
        </GradientView>
    );
}

export default Home;