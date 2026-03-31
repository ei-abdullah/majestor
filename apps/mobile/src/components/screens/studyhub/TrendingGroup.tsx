import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {router} from "expo-router";
import Card from "@/src/components/ui/Card";
import {Feather} from "@expo/vector-icons";

interface Group {
    id: number;
    name: string;
    courseName: string;
    hostName: string;
    memberCount: number;
    popularityScore: number;
}

export default function TrendingGroup({groups}: { groups: Group[] }) {
    if (groups.length === 0) return null;

    return (
        <View className="mb-8 px-6">
            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                    <Feather name="trending-up" size={18} color="#FF4500"/>
                    <Text className="text-white font-bold text-lg ml-2 uppercase">Trending Peer Groups</Text>
                </View>
            </View>

            {groups.map((group) => (
                <TouchableOpacity
                    key={group.id}
                    onPress={() => router.push({
                            pathname: `/studyhub/studyGroupDetail`,
                            params: {id: group.id}
                        }
                    )}
                    activeOpacity={0.8}
                    className="mb-3"
                >
                    <Card className="bg-white/5 border-white/5 p-4 flex-row items-center justify-between">
                        <View className="flex-1 mr-4">
                            <View className="flex-row items-center">
                                <Text className="text-white font-bold text-base mr-2" numberOfLines={1}>
                                    {group.name}
                                </Text>
                                <View className="bg-white/10 px-1.5 py-0.5 rounded">
                                    <Text className="text-white/60 text-[8px] font-bold uppercase">
                                        {group.courseName}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center mt-1 gap-3">
                                <View className="flex-row items-center">
                                    <Feather name="user" size={10} color="#3A6FF8"/>
                                    <Text className="text-white/40 text-[10px] ml-1">{group.hostName}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Feather name="users" size={10} color="#3A6FF8"/>
                                    <Text className="text-white/40 text-[10px] ml-1">{group.memberCount} members</Text>
                                </View>
                            </View>
                        </View>

                        <View className="items-end">
                            <View
                                className="flex-row items-center bg-orange-500/20 px-2 py-1 rounded-lg border border-orange-500/30">
                                <Feather name="star" size={12} color="#FFA500"/>
                                <Text className="text-orange-500 font-bold text-xs ml-1">
                                    {group.popularityScore?.toFixed(1) || "0.0"}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                onPress={() => router.push("/(tabs)/studyhub/trendingGroup")}
                className="bg-white/5 py-3 rounded-xl items-center border border-white/10 mt-2"
            >
                <Text className="text-white/60 text-xs font-bold uppercase tracking-widest">View All Trending</Text>
            </TouchableOpacity>
        </View>
    );
}
