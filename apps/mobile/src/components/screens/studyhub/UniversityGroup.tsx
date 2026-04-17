import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {router} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

interface Group {
    id: number;
    name: string;
    hostName: string;
    memberCount: number;
}

export default function UniversityGroup({groups}: { groups: Group[] }) {
    if (groups.length === 0) return null;

    return (
        <View className="px-6 mb-6">
            <View className="flex-row items-center mb-4 px-1">
                <View style={{backgroundColor: '#E8F9F7', padding: 10, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#AAEAE3'}}>
                    <Feather name="globe" size={18} color="#6FD0C5"/>
                </View>
                <View>
                    <Text style={{color: '#22B5A6', fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase'}}>
                        Campus Wide
                    </Text>
                    <Text style={{color: '#1A2340', fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginTop: 1}}>
                        University Groups
                    </Text>
                </View>
            </View>

            <LinearGradient
                colors={["#E8F9F7", "#F5FFFE"]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{borderRadius: 32, padding: 6, borderWidth: 1, borderColor: '#AAEAE3'}}
            >
                {groups.map((group, index) => {
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
                                borderBottomColor: 'rgba(110,208,197,0.25)',
                            }}>
                                <View style={{
                                    backgroundColor: '#6FD0C5',
                                    width: 42,
                                    height: 42,
                                    borderRadius: 14,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                    flexShrink: 0,
                                }}>
                                    <Text style={{color: 'white', fontSize: 18, fontWeight: '900'}}>
                                        {group.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>

                                <View style={{flex: 1}}>
                                    <Text style={{color: '#1A2340', fontWeight: '700', fontSize: 14, lineHeight: 18, marginBottom: 3}} numberOfLines={1}>
                                        {group.name}
                                    </Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Feather name="users" size={9} color="#5A6275"/>
                                        <Text style={{color: '#5A6275', fontSize: 10, fontWeight: '600', marginLeft: 4, opacity: 0.65}}>
                                            {group.memberCount} members · {group.hostName}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#AAEAE3'}}>
                                    <Feather name="chevron-right" size={14} color="#6FD0C5"/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </LinearGradient>
        </View>
    );
}