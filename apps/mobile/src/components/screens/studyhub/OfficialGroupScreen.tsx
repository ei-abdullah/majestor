import React from "react";
import {View, Text, FlatList, TouchableOpacity, RefreshControl, Pressable} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";

import {useAuthStore} from "@/src/stores/authStore";
import {useStudyHubFeed} from "@/src/queries/studyhub.queries";

import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import Card from "@/src/components/ui/Card";

export default function OfficialGroupScreen() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    const {data: feedData, isPending, refetch} = useStudyHubFeed(user!.id);

    if (isPending) return <LoadingIndicator />;

    const groups = (feedData?.officialGroups || []).filter(group => group.hostName !== user?.username);

    return (
        <GradientView>
            <View className="flex-1 px-6">
                <Card 
                    className="flex-1 bg-white rounded-t-[40px] border-0 shadow-teal mt-28 mb-0 p-0 overflow-hidden"
                >
                    <FlatList
                        data={groups}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ 
                            paddingTop: 32, 
                            paddingBottom: 140,
                            paddingHorizontal: 24 
                        }}
                        refreshControl={
                            <RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8" />
                        }
                        renderItem={({item}) => (
                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/(tabs)/studyhub/studyGroupDetail",
                                    params: {id: item.id}
                                })}
                                className="mb-5"
                            >
                                <View className="bg-mj-bg-light rounded-[32px] border border-mj-yellow-100 p-6 shadow-sm">
                                    <View className="flex-row items-start mb-4">
                                        <View className="bg-mj-yellow-500 w-14 h-14 rounded-2xl items-center justify-center mr-4 shadow-sm">
                                            <Feather name="award" size={24} color="white" />
                                        </View>
                                        <View className="flex-1">
                                            <View className="bg-mj-yellow-100 self-start px-2 py-0.5 rounded-md mb-1.5 border border-mj-yellow-200">
                                                <Text className="text-mj-yellow-900 text-[8px] font-black uppercase tracking-widest">Official Faculty Channel</Text>
                                            </View>
                                            <Text className="text-mj-text-main font-bold text-lg leading-tight">
                                                {item.name}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View className="h-px bg-mj-yellow-200/50 w-full mb-4" />
                                    
                                    <View className="flex-row justify-between items-center px-1">
                                        <View className="flex-row gap-4">
                                            <View className="flex-row items-center">
                                                <Feather name="user-check" size={12} color="#C6941F" />
                                                <Text className="text-mj-text-secondary text-[10px] font-bold uppercase ml-1.5">{item.hostName}</Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <Feather name="book" size={12} color="#C6941F" />
                                                <Text className="text-mj-text-secondary text-[10px] font-bold uppercase ml-1.5">{item.courseName}</Text>
                                            </View>
                                        </View>
                                        <View className="bg-mj-yellow-500 p-2 rounded-xl shadow-sm">
                                            <Feather name="arrow-right" size={14} color="white" />
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-24 opacity-30">
                                <Feather name="shield" size={48} color="#121826" />
                                <Text className="text-mj-text-main font-bold mt-4 uppercase tracking-[2px] text-[10px]">No official groups</Text>
                            </View>
                        }
                    />
                </Card>
            </View>
        </GradientView>
    );
}
