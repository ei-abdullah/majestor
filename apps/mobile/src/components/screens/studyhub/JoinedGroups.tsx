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
        <View className="px-6 mb-6">
            <Card className="bg-white rounded-[32px] border-0 shadow-blue p-6">
                <View className="flex-row justify-between items-center mb-6 px-1">
                    <View>
                        <Text className="text-mj-blue font-black text-[10px] uppercase tracking-[2px]">Your Space</Text>
                        <Text className="text-mj-text-main font-bold text-xl tracking-tight mt-1">Joined Groups</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/joinedGroups")}
                        className="bg-mj-blue-50 px-4 py-2 rounded-xl"
                    >
                        <Text className="text-mj-blue font-bold text-xs uppercase tracking-tighter">View All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingRight: 8}}
                >
                    {groups.map((group) => (
                        <TouchableOpacity
                            key={group.id}
                            onPress={() => router.push({
                                pathname: `/(tabs)/studyhub/studyGroupDetail`,
                                params: {id: group.id}
                            })}
                            activeOpacity={0.7}
                            className="mr-4"
                        >
                            <View className="bg-mj-bg-light p-5 rounded-[28px] border border-mj-blue-100 w-44 min-h-[160px] justify-between">
                                <View className="bg-mj-blue-600 w-10 h-10 rounded-xl items-center justify-center shadow-sm">
                                    <Feather name="book-open" size={20} color="white" />
                                </View>
                                
                                <View>
                                    <Text className="text-mj-text-main font-bold text-sm leading-tight" numberOfLines={2}>
                                        {group.name}
                                    </Text>
                                    <Text className="text-mj-text-secondary text-[9px] font-bold mt-2 uppercase tracking-tighter" numberOfLines={1}>
                                        {group.courseName}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/studyhub/joinedGroups")}
                        className="justify-center ml-2"
                    >
                        <View className="w-16 h-16 bg-mj-bg-light rounded-[24px] items-center justify-center border border-dashed border-mj-blue-200">
                            <Feather name="arrow-right" size={20} color="#3A6FF8" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </Card>
        </View>
    );
}
