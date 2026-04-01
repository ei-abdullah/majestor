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
        <View className="px-6 mb-6">
            <Card className="bg-white rounded-[32px] border-0 shadow-blue p-6">
                <View className="flex-row items-center mb-6 px-1">
                    <View className="bg-orange-50 p-2.5 rounded-2xl mr-4 shadow-sm border border-orange-100">
                        <Feather name="trending-up" size={18} color="#FF4500" />
                    </View>
                    <Text className="text-mj-text-main font-bold text-xl tracking-tighter uppercase">Trending Hubs</Text>
                </View>

                {groups.map((group) => (
                    <TouchableOpacity
                        key={group.id}
                        onPress={() => router.push({
                            pathname: "/(tabs)/studyhub/studyGroupDetail",
                            params: {id: group.id}
                        })}
                        className="mb-5"
                        activeOpacity={0.7}
                    >
                        <View className="bg-mj-bg-light p-6 rounded-[28px] flex-row items-center justify-between border border-mj-bg-blue shadow-sm min-h-[110px]">
                            <View className="flex-1 mr-4">
                                <View className="bg-mj-blue-100 self-start px-2 py-0.5 rounded-md mb-2">
                                    <Text className="text-mj-blue-700 text-[8px] font-black uppercase tracking-widest">
                                        {group.courseName}
                                    </Text>
                                </View>
                                
                                <Text className="text-mj-text-main font-bold text-base leading-tight mb-2" numberOfLines={1}>
                                    {group.name}
                                </Text>
                                
                                <View className="flex-row items-center">
                                    <Feather name="users" size={10} color="#5A6275" />
                                    <Text className="text-mj-text-secondary text-[10px] font-bold uppercase tracking-tighter ml-1.5 opacity-60">
                                        {group.memberCount} Members • {group.hostName}
                                    </Text>
                                </View>
                            </View>

                            <View className="bg-white p-3 rounded-[22px] shadow-sm border border-mj-yellow-100 items-center justify-center min-w-[55px]">
                                <Feather name="star" size={14} color="#FBCB43" />
                                <Text className="text-mj-text-main font-black text-xs mt-1">
                                    {group.popularityScore?.toFixed(1) || "0.0"}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity 
                    onPress={() => router.push("/(tabs)/studyhub/trendingGroup")}
                    className="mt-2 py-3 items-center"
                >
                    <Text className="text-mj-blue font-bold text-xs uppercase tracking-widest">Discover All Trending</Text>
                </TouchableOpacity>
            </Card>
        </View>
    );
}
