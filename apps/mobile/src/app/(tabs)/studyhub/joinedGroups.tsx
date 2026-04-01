import React from "react";
import {View, Text, ScrollView, TouchableOpacity, RefreshControl} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useStudyHubFeed} from "@/src/queries/studyhub.queries";
import GradientView from "@/src/components/ui/GradientView";
import JoinedGroups from "@/src/components/screens/studyhub/JoinedGroups";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function JoinedGroupsScreen() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    const {data: feedData, isPending, refetch} = useStudyHubFeed(user!.id);

    return (
        <GradientView>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingTop: insets.top + 20, paddingBottom: 40}}
                refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8" />}
            >
                <View className="px-6 mb-6">
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        className="bg-white/10 p-3 rounded-2xl border border-white/10 self-start mb-6"
                    >
                        <Feather name="arrow-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-white">Joined Groups</Text>
                    <Text className="text-white/50 text-sm mt-1">Your active academic communities</Text>
                </View>

                <JoinedGroups groups={feedData?.joinedGroups || []} />
            </ScrollView>
        </GradientView>
    );
}
