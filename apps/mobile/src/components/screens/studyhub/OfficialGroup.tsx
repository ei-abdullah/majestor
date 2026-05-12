import React from "react";
import {View, Text, ScrollView, Pressable} from "react-native";
import {Href, router} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {useAuthStore} from "@/src/stores/authStore";
import {LinearGradient} from "expo-linear-gradient";

interface Group {
    id: number;
    name: string;
    courseName: string | null;
    hostName: string;
}

export default function OfficialGroup({groups}: { groups: Group[] }) {
    const {user} = useAuthStore();
    const filteredGroups = groups.filter(group => group.hostName !== user?.username);

    if (filteredGroups.length === 0) return null;

    return (
        <View className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-4 px-1">
                <View>
                    <Text style={{color: '#C6941F', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2, textTransform: 'uppercase'}}>
                        Verified
                    </Text>
                    <Text style={{color: '#1A2340', fontSize: 20, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.5, marginTop: 2}}>
                        Official Channels
                    </Text>
                </View>
                <Pressable
                    onPress={() => router.push("/(tabs)/studyhub/officialGroup" as Href)}
                    style={{backgroundColor: '#FFF8E1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#FFE082'}}
                >
                    <Text style={{color: '#C6941F', fontFamily: 'Inter_700Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5}}>
                        View All
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: 8}}
            >
                {filteredGroups.map((group) => (
                    <Pressable
                        key={group.id}
                        onPress={() => router.push({
                            pathname: "/(tabs)/studyhub/studyGroupDetail" as any,
                            params: {id: group.id}
                        })}
                        style={{marginRight: 12}}
                    >
                        <View style={{
                            borderRadius: 28,
                            width: 158,
                            minHeight: 172,
                            overflow: 'hidden',
                            shadowColor: '#C6941F',
                            shadowOffset: {width: 0, height: 6},
                            shadowOpacity: 0.12,
                            shadowRadius: 14,
                            elevation: 4,
                        }}>
                            <LinearGradient
                                colors={["#FFFDF5", "#FFF8E1"]}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{flex: 1, padding: 18, justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#FFE082', borderRadius: 28}}
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <View style={{backgroundColor: '#FBCB43', width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                        <Feather name="shield" size={22} color="white"/>
                                    </View>
                                    <View style={{backgroundColor: '#FFF3CD', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#FFE082'}}>
                                        <Text style={{color: '#C6941F', fontSize: 8, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 1}}>
                                            Official
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <Text style={{color: '#1A2340', fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 19, marginBottom: 6}} numberOfLines={2}>
                                        {group.name}
                                    </Text>
                                    <Text style={{color: '#5A6275', fontSize: 10, fontFamily: 'Inter_600SemiBold', opacity: 0.7}} numberOfLines={1}>
                                        {group.hostName}{group.courseName ? ` · ${group.courseName}` : ''}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </Pressable>
                ))}

                <Pressable
                    onPress={() => router.push("/(tabs)/studyhub/officialGroup" as Href)}
                    style={{justifyContent: 'center', marginLeft: 4}}
                >
                    <View style={{
                        width: 52,
                        height: 52,
                        backgroundColor: '#FFF8E1',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1.5,
                        borderStyle: 'dashed',
                        borderColor: '#FFE082',
                    }}>
                        <Feather name="arrow-right" size={18} color="#C6941F" opacity={0.7}/>
                    </View>
                </Pressable>
            </ScrollView>
        </View>
    );
}