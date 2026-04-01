import React from "react";
import {View, Text, ScrollView, TouchableOpacity, RefreshControl} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useStudyHubFeed} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import TrendingGroup from "@/src/components/screens/studyhub/TrendingGroup";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function TrendingGroupScreen() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    const {data: feedData, isPending, refetch} = useStudyHubFeed(user!.id);

    return (
        <GradientView>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingTop: insets.top + 20, paddingBottom: 60}}
                refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8" />}
            >
                <View className="px-6 mb-8">
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        className="bg-white/10 p-3.5 rounded-2xl border border-white/10 self-start mb-6 shadow-sm"
                    >
                        <Feather name="arrow-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-mj-teal text-[10px] font-black uppercase tracking-[3px]">Discover</Text>
                    <Text className="text-3xl font-bold text-white mt-1">Trending Peer Groups</Text>
                    <Text className="text-white/50 text-xs mt-2 leading-5">The most active course communities in your faculty right now.</Text>
                </View>

                <TrendingGroup groups={feedData?.trendingGroups || []} />
            </ScrollView>
        </GradientView>
    );
}
