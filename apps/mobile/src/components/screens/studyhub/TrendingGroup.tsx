import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {Href, router} from "expo-router";
import {Feather} from "@expo/vector-icons";

interface Group {
    id: number;
    name: string;
    courseName: string | null;
    hostName: string;
    memberCount: number;
    popularityScore: number;
}

const RANK_STYLES = [
    {bg: '#FFF3CD', text: '#C6941F', label: '1st'},
    {bg: '#F0F0F0', text: '#5A6275', label: '2nd'},
    {bg: '#FDE8D8', text: '#B5511A', label: '3rd'},
];

export default function TrendingGroup({groups}: { groups: Group[] }) {
    if (groups.length === 0) return null;

    return (
        <View className="px-6 mb-6">
            <View className="flex-row items-center mb-4 px-1">
                <View style={{backgroundColor: '#FFF0EB', padding: 10, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#FFD5C2'}}>
                    <Feather name="trending-up" size={18} color="#FF4500"/>
                </View>
                <View>
                    <Text style={{color: '#FF4500', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2, textTransform: 'uppercase'}}>
                        Hot Right Now
                    </Text>
                    <Text style={{color: '#1A2340', fontSize: 20, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.5, marginTop: 1}}>
                        Trending Hubs
                    </Text>
                </View>
            </View>

            <View style={{backgroundColor: 'white', borderRadius: 32, padding: 6, shadowColor: '#3A6FF8', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.08, shadowRadius: 24, elevation: 4}}>
                {groups.map((group, index) => {
                    const rank = RANK_STYLES[index] ?? {bg: '#F5F7FF', text: '#5A6275', label: `${index + 1}th`};
                    const isLast = index === groups.length - 1;
                    return (
                        <TouchableOpacity
                            key={group.id}
                            onPress={() => router.push({
                                pathname: "/(tabs)/studyhub/studyGroupDetail" as any,
                                params: {id: group.id}
                            })}
                            activeOpacity={0.7}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderBottomWidth: isLast ? 0 : 1,
                                borderBottomColor: '#F0F4FF',
                            }}>
                                {/* Rank badge */}
                                <View style={{
                                    backgroundColor: rank.bg,
                                    width: 38,
                                    height: 38,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                    flexShrink: 0,
                                }}>
                                    <Text style={{color: rank.text, fontSize: 10, fontFamily: 'Inter_800ExtraBold'}}>
                                        {rank.label}
                                    </Text>
                                </View>

                                {/* Info */}
                                <View style={{flex: 1}}>
                                    {group.courseName ? (
                                        <View style={{backgroundColor: '#EEF3FF', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4}}>
                                            <Text style={{color: '#3A6FF8', fontSize: 8, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 1}} numberOfLines={1}>
                                                {group.courseName}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{backgroundColor: '#E8F9F7', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4}}>
                                            <Text style={{color: '#22B5A6', fontSize: 8, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase', letterSpacing: 1}}>
                                                Global
                                            </Text>
                                        </View>
                                    )}
                                    <Text style={{color: '#1A2340', fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 18, marginBottom: 4}} numberOfLines={1}>
                                        {group.name}
                                    </Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Feather name="users" size={9} color="#5A6275"/>
                                        <Text style={{color: '#5A6275', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginLeft: 4, opacity: 0.65}}>
                                            {group.memberCount} members · {group.hostName}
                                        </Text>
                                    </View>
                                </View>

                                {/* Score */}
                                <View style={{
                                    backgroundColor: '#FFFBF0',
                                    borderRadius: 16,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    alignItems: 'center',
                                    marginLeft: 10,
                                    borderWidth: 1,
                                    borderColor: '#FFE082',
                                    minWidth: 50,
                                }}>
                                    <Feather name="star" size={12} color="#FBCB43"/>
                                    <Text style={{color: '#1A2340', fontFamily: 'Inter_800ExtraBold', fontSize: 12, marginTop: 2}}>
                                        {group.popularityScore?.toFixed(1) ?? '0.0'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/studyhub/trendingGroup" as Href)}
                    style={{paddingVertical: 14, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F4FF'}}
                >
                    <Text style={{color: '#3A6FF8', fontFamily: 'Inter_800ExtraBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5}}>
                        Discover All Trending
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}