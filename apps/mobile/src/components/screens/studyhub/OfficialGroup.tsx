import React from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {router} from "expo-router";
import Card from "@/src/components/ui/Card";
import {Feather} from "@expo/vector-icons";

interface Group {
    id: number;
    name: string;
    courseName: string;
    hostName: string;
}

export default function OfficialGroup({groups}: { groups: Group[] }) {
    if (groups.length === 0) return null;

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center px-6 mb-3">
                <View className="flex-row items-center">
                    <Feather name="star" size={18} color="#FFD700" />
                    <Text className="text-white font-bold text-lg ml-2 uppercase tracking-tight">Official Faculty</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/(tabs)/studyhub/officialGroup")}>
                    <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest">View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft: 24, paddingRight: 8}}
            >
                {groups.map((group) => (
                    <TouchableOpacity 
                        key={group.id} 
                        onPress={() => {}}
                        activeOpacity={0.8}
                    >
                        <Card className="mr-4 w-48 bg-white/10 border-white/10 p-4">
                            <View className="bg-yellow-500/20 w-10 h-10 rounded-xl items-center justify-center mb-3 border border-yellow-500/30">
                                <Feather name="award" size={20} color="#FFD700" />
                            </View>
                            <Text className="text-white font-bold text-sm" numberOfLines={1}>
                                {group.name}
                            </Text>
                            <Text className="text-white/50 text-[10px] mt-1 font-semibold uppercase">
                                {group.hostName} • {group.courseName}
                            </Text>
                        </Card>
                    </TouchableOpacity>
                ))}
                
                <TouchableOpacity 
                    onPress={() => router.push("/(tabs)/studyhub/officialGroup")}
                    className="justify-center"
                >
                    <View className="w-20 h-20 bg-yellow-500/5 rounded-2xl items-center justify-center border border-dashed border-yellow-500/20 mr-6">
                        <Feather name="shield" size={20} color="#FFD700" opacity={0.5} />
                        <Text className="text-yellow-500/40 text-[8px] font-bold mt-1 uppercase">Full List</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
