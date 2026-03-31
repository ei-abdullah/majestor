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
                    paddingTop: insets.top + 20, 
                    paddingBottom: 120 
                }}
                refreshControl={
                    <RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8" />
                }
            >
                {/* Header Section */}
                <View className="px-6 mb-6">
                    <Text className="text-3xl font-bold text-white mb-4">Study Hub</Text>
                    <SearchBar 
                        onChange={() => {}}
                    />
                </View>

                {/* 1. Joined Groups - Horizontal Scroll */}
                <JoinedGroups groups={feedData?.joinedGroups || []} />

                {/* 2. Official Faculty Groups - Horizontal Scroll */}
                <OfficialGroup groups={feedData?.officialGroups || []} />

                {/* 3. Trending Peer Groups - Vertical List */}
                <TrendingGroup groups={feedData?.trendingGroups || []} />

                {/* 4. Vault Gateway Tiles */}
                <View className="px-6 mt-8 flex-row gap-4">
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/personalVault")}
                        className="flex-1"
                    >
                        <Card className="items-center py-6 bg-white/10 border-white/20">
                            <Feather name="folder" size={28} color="white" />
                            <Text className="text-white font-bold mt-2">PERSONAL</Text>
                            <Text className="text-white/60 text-[10px]">PRIVATE VAULT</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/publicVault")}
                        className="flex-1"
                    >
                        <Card className="items-center py-6 bg-primary/20 border-primary/30">
                            <Feather name="unlock" size={28} color="#3A6FF8" />
                            <Text className="text-primary font-bold mt-2">OPEN</Text>
                            <Text className="text-primary/60 text-[10px]">FACULTY VAULT</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* 5. Create Group Action */}
                <View className="px-6 mt-6">
                    <TouchableOpacity
                        // Open a beautiful modal that would create group based on small inputs like group name, course, and maybe a toggle for official/unofficial if user is faculty.
                        onPress={() => {}}
                        className="bg-white py-4 rounded-2xl flex-row items-center justify-center shadow-lg"
                    >
                        <Feather name="plus-circle" size={20} color="#3A6FF8" />
                        <Text className="text-primary font-bold ml-2 text-base">CREATE NEW GROUP</Text>
                    </TouchableOpacity>
                    <Text className="text-center text-white/40 text-[9px] mt-2 tracking-widest uppercase">
                        {user?.isFaculty ? "Unlimited Creation Active" : "Free Student: 1 Group Slot"}
                        //TODO: ADD isElite and Premium until to user's state
                    </Text>
                </View>

            </ScrollView>
        </GradientView>
    );
}
