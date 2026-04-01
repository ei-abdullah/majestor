import React from "react";
import {View, Text, ScrollView, RefreshControl, TouchableOpacity} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";

import {useAuthStore} from "@/src/stores/authStore";
import {useStudyHubFeed} from "@/src/queries/studyhub.queries";

import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import SearchBar from "@/src/components/ui/SearchBar";
import JoinedGroups from "./JoinedGroups";
import OfficialGroup from "./OfficialGroup";
import TrendingGroup from "./TrendingGroup";
import Card from "@/src/components/ui/Card";

export default function StudyHubFeed() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    const {data: feedData, isPending, refetch} = useStudyHubFeed(user!.id);

    if (isPending) return <LoadingIndicator />;

    return (
        <GradientView>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                    paddingTop: insets.top + 80, // Account for CustomHeader height
                    paddingBottom: 140 
                }}
                refreshControl={
                    <RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8" />
                }
            >
                {/* Aggregated Sections */}
                <JoinedGroups groups={feedData?.joinedGroups || []} />
                <OfficialGroup groups={feedData?.officialGroups || []} />
                <TrendingGroup groups={feedData?.trendingGroups || []} />

                {/* Vault Entry Points - Using Brand Cards with proper contrast */}
                <View className="px-6 mt-4 flex-row gap-4">
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/personalVault")}
                        className="flex-1"
                        activeOpacity={0.9}
                    >
                        <Card className="items-center py-8 bg-white shadow-sm rounded-[32px] border border-mj-bg-blue">
                            <View className="bg-mj-blue-50 p-4 rounded-2xl mb-3">
                                <Feather name="folder" size={28} color="#3A6FF8" />
                            </View>
                            <Text className="text-mj-text-main font-bold text-base">PERSONAL</Text>
                            <Text className="text-mj-text-secondary text-[10px] font-black tracking-widest uppercase mt-0.5">Private Vault</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/publicVault")}
                        className="flex-1"
                        activeOpacity={0.9}
                    >
                        <Card className="items-center py-8 bg-white shadow-sm rounded-[32px] border border-mj-bg-blue">
                            <View className="bg-mj-teal-50 p-4 rounded-2xl mb-3">
                                <Feather name="unlock" size={28} color="#6FD0C5" />
                            </View>
                            <Text className="text-mj-text-main font-bold text-base">OPEN</Text>
                            <Text className="text-mj-text-secondary text-[10px] font-black tracking-widest uppercase mt-0.5">Faculty Vault</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Create Group Action */}
                <View className="px-6 mt-8">
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/uploadDocument")}
                        className="bg-mj-blue-600 py-5 rounded-[32px] flex-row items-center justify-center shadow-blue"
                        activeOpacity={0.8}
                    >
                        <Feather name="plus-circle" size={22} color="white" />
                        <Text className="text-white font-bold ml-3 text-lg">Create New Group</Text>
                    </TouchableOpacity>
                    <Text className="text-center text-mj-text-secondary text-[9px] font-black mt-4 tracking-[2px] uppercase">
                        {user?.premiumUntil ? "Elite Access Active" : "Standard Tier • 1 Slot Available"}
                    </Text>
                </View>

            </ScrollView>
        </GradientView>
    );
}
