import React from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {router} from "expo-router";
import Card from "@/src/components/ui/Card";
import {Feather} from "@expo/vector-icons";

interface Group {
    id: number;
    name: string;
    courseName: string;
}

export default function JoinedGroups({groups}: { groups: Group[] }) {
    if (groups.length === 0) return null;

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center px-6 mb-3">
                <View className="flex-row items-center">
                    <Feather name="users" size={18} color="white"/>
                    <Text className="text-white font-bold text-lg ml-2">JOINED GROUPS</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/(tabs)/studyhub/joinedGroups")}>
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
                        onPress={() => router.push({
                                pathname: `/(tabs)/studyhub/studyGroupDetail`,
                                params: {id: group.id}
                            }
                        )}
                        activeOpacity={0.8}
                    >
                        <Card className="mr-4 w-40 bg-white/10 border-white/10 p-4">
                            <View className="bg-primary w-10 h-10 rounded-xl items-center justify-center mb-3">
                                <Feather name="book-open" size={20} color="white"/>
                            </View>
                            <Text className="text-white font-bold text-sm" numberOfLines={1}>
                                {group.name}
                            </Text>
                            <Text className="text-white/50 text-[10px] mt-1 font-semibold uppercase">
                                {group.courseName}
                            </Text>
                        </Card>
                    </TouchableOpacity>
                ))}

                {/* End of Scroll "View All" Tile */}
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/studyhub/joinedGroups")}
                    className="justify-center"
                >
                    <View
                        className="w-20 h-20 bg-white/5 rounded-2xl items-center justify-center border border-dashed border-white/20 mr-6">
                        <Feather name="arrow-right" size={20} color="white"/>
                        <Text className="text-white/40 text-[8px] font-bold mt-1">FULL LIST</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
