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
        <View className="px-6 mb-6">
            <Card className="bg-white rounded-[32px] border-0 shadow-teal p-6">
                <View className="flex-row justify-between items-center mb-6 px-1">
                    <View>
                        <Text className="text-mj-yellow-600 font-black text-[10px] uppercase tracking-[2px]">Verified</Text>
                        <Text className="text-mj-text-main font-bold text-xl tracking-tight mt-1">Official Channels</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/officialGroup")}
                        className="bg-mj-yellow-50 px-4 py-2 rounded-xl"
                    >
                        <Text className="text-mj-yellow-900 font-bold text-xs uppercase tracking-tighter">View All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingLeft: 0, paddingRight: 8}}
                >
                    {groups.map((group) => (
                        <TouchableOpacity 
                            key={group.id} 
                            onPress={() => router.push({
                                pathname: "/(tabs)/studyhub/studyGroupDetail",
                                params: {id: group.id}
                            })}
                            activeOpacity={0.7}
                            className="mr-4"
                        >
                            <View className="bg-mj-bg-light p-5 rounded-[28px] border border-mj-yellow-100 w-44 min-h-[160px] justify-between">
                                <View className="bg-mj-yellow-500 w-10 h-10 rounded-xl items-center justify-center shadow-sm">
                                    <Feather name="shield" size={20} color="white" />
                                </View>
                                
                                <View>
                                    <Text className="text-mj-text-main font-bold text-sm leading-tight" numberOfLines={2}>
                                        {group.name}
                                    </Text>
                                    <Text className="text-mj-text-secondary text-[10px] font-bold mt-2 uppercase tracking-tighter" numberOfLines={1}>
                                        {group.hostName} • {group.courseName}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/studyhub/officialGroup")}
                        className="justify-center ml-2"
                    >
                        <View className="w-16 h-16 bg-mj-yellow-50 rounded-[24px] items-center justify-center border border-dashed border-mj-yellow-200">
                            <Feather name="arrow-right" size={20} color="#C6941F" opacity={0.5} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </Card>
        </View>
    );
}
