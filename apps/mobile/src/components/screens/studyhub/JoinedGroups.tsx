import React from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {Href, router} from "expo-router";
import {Feather} from "@expo/vector-icons";

interface Group {
    id: number;
    name: string;
    courseName: string | null;
    memberCount: number;
}

const AVATAR_PALETTES = [
    {bg: '#EEF3FF', border: '#C7D7FD', text: '#3A6FF8'},
    {bg: '#E8F9F7', border: '#AAEAE3', text: '#22B5A6'},
    {bg: '#FFF8E1', border: '#FFE082', text: '#C6941F'},
    {bg: '#FCE4EC', border: '#F48FB1', text: '#C2185B'},
    {bg: '#F3E5F5', border: '#CE93D8', text: '#7B1FA2'},
    {bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0'},
];

function palette(name: string) {
    return AVATAR_PALETTES[(name.charCodeAt(0) || 0) % AVATAR_PALETTES.length];
}

export default function JoinedGroups({groups}: { groups: Group[] }) {
    if (groups.length === 0) return null;

    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4 px-7">
                <View>
                    <Text style={{color: '#3A6FF8', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2, textTransform: 'uppercase'}}>
                        Your Space
                    </Text>
                    <Text style={{color: '#1A2340', fontSize: 20, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.5, marginTop: 2}}>
                        Joined Groups
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/studyhub/joinedGroups" as Href)}
                    style={{backgroundColor: '#EEF3FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12}}
                >
                    <Text style={{color: '#3A6FF8', fontFamily: 'Inter_700Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5}}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft: 24, paddingRight: 16}}
            >
                {groups.map((group) => {
                    const p = palette(group.name);
                    return (
                        <TouchableOpacity
                            key={group.id}
                            onPress={() => router.push({
                                pathname: "/(tabs)/studyhub/studyGroupDetail" as any,
                                params: {id: group.id}
                            })}
                            activeOpacity={0.75}
                            style={{marginRight: 12}}
                        >
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 28,
                                padding: 18,
                                width: 158,
                                minHeight: 168,
                                justifyContent: 'space-between',
                                borderWidth: 1.5,
                                borderColor: p.border,
                                shadowColor: p.text,
                                shadowOffset: {width: 0, height: 6},
                                shadowOpacity: 0.1,
                                shadowRadius: 14,
                                elevation: 4,
                            }}>
                                <View style={{
                                    backgroundColor: p.bg,
                                    width: 46,
                                    height: 46,
                                    borderRadius: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: p.border,
                                }}>
                                    <Text style={{color: p.text, fontSize: 22, fontFamily: 'Inter_800ExtraBold'}}>
                                        {group.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={{color: '#1A2340', fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 19, marginBottom: 8}} numberOfLines={2}>
                                        {group.name}
                                    </Text>
                                    {group.courseName ? (
                                        <View style={{backgroundColor: p.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6}}>
                                            <Text style={{color: p.text, fontSize: 8, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 1}} numberOfLines={1}>
                                                {group.courseName}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{backgroundColor: '#E8F9F7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6}}>
                                            <Text style={{color: '#22B5A6', fontSize: 8, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 1}}>
                                                Global
                                            </Text>
                                        </View>
                                    )}
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Feather name="users" size={9} color="#5A6275"/>
                                        <Text style={{color: '#5A6275', fontSize: 9, fontFamily: 'Inter_700Bold', marginLeft: 4, opacity: 0.7}}>
                                            {group.memberCount} members
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/studyhub/joinedGroups" as Href)}
                    style={{justifyContent: 'center', marginLeft: 4}}
                >
                    <View style={{
                        width: 52,
                        height: 52,
                        backgroundColor: '#EEF3FF',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1.5,
                        borderStyle: 'dashed',
                        borderColor: '#C7D7FD',
                    }}>
                        <Feather name="arrow-right" size={18} color="#3A6FF8"/>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}