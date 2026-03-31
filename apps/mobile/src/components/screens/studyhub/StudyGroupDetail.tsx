import React from "react";
import {View, Text, ScrollView, TouchableOpacity, RefreshControl} from "react-native";
import {useLocalSearchParams, router} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

import {useAuthStore} from "@/src/stores/authStore";
import {useGroupDetails, useJoinGroup, useRateGroup} from "@/src/queries/studyhub.queries";

import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import DocumentCard from "./DocumentCard";
import Card from "@/src/components/ui/Card";
import PrimaryButton from "@/src/components/ui/PrimaryButton";

export default function StudyGroupDetail() {
    const {id} = useLocalSearchParams();
    const {user} = useAuthStore();
    const groupId = Number(id);

    const {data: group, isPending, refetch} = useGroupDetails(groupId, user!.id);
    const {mutate: joinGroup, isPending: isJoining} = useJoinGroup();
    const {mutate: rateGroup} = useRateGroup();

    if (isPending) return <LoadingIndicator />;
    if (!group) return null;

    return (
        <GradientView>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
                contentContainerStyle={{paddingBottom: 100}}
            >
                {/* Hero Header */}
                <View className="px-6 pt-12 pb-6">
                    <TouchableOpacity onPress={() => router.back()} className="mb-4">
                        <Feather name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                            <Text className="text-3xl font-bold text-white">{group.name}</Text>
                            <Text className="text-white/60 text-sm mt-1">{group.courseName} • Host: {group.hostName}</Text>
                        </View>
                        {group.isOfficial && (
                            <View className="bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/30">
                                <Text className="text-yellow-500 text-[10px] font-bold uppercase">Official</Text>
                            </View>
                        )}
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row gap-4 mt-6">
                        <Card className="flex-1 bg-white/10 border-white/10 items-center py-3">
                            <Text className="text-white font-bold text-lg">{group.memberCount}</Text>
                            <Text className="text-white/40 text-[10px] uppercase font-bold">Members</Text>
                        </Card>
                        <Card className="flex-1 bg-white/10 border-white/10 items-center py-3">
                            <Text className="text-white font-bold text-lg">{group.documents.length}</Text>
                            <Text className="text-white/40 text-[10px] uppercase font-bold">Documents</Text>
                        </Card>
                    </View>
                </View>

                {/* Primary Actions */}
                <View className="px-6 flex-row gap-3 mb-8">
                    {group.isCurrentUserMember ? (
                        <PrimaryButton 
                            title="Open Chat" 
                            icon="message-square" 
                            onPress={() => {}} // TODO: Navigate to Chat
                            className="flex-1"
                        />
                    ) : (
                        <PrimaryButton 
                            title={isJoining ? "Joining..." : "Join Group"} 
                            icon="plus" 
                            onPress={() => joinGroup({groupId, userId: user!.id})}
                            className="flex-1"
                            disabled={isJoining}
                        />
                    )}
                    
                    <TouchableOpacity 
                        onPress={() => rateGroup({groupId, userId: user!.id})}
                        className="bg-white/10 w-14 h-14 rounded-2xl items-center justify-center border border-white/10"
                    >
                        <Feather name="thumbs-up" size={24} color={group.popularityScore > 0 ? "#FFA500" : "white"} />
                    </TouchableOpacity>
                </View>

                {/* Document Vault (The Meat) */}
                <View className="px-6">
                    <Text className="text-white font-bold text-lg mb-4 uppercase tracking-widest">Document Vault</Text>
                    
                    {group.documents.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                    ))}

                    {/* Teaser Overlay */}
                    {group.isPreview && (
                        <View className="mt-2">
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
                                style={{height: 200, marginTop: -150, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40, borderRadius: 20}}
                            >
                                <Feather name="lock" size={32} color="white" opacity={0.5} />
                                <Text className="text-white font-bold text-center mt-2">Join group to unlock all documents</Text>
                                <TouchableOpacity 
                                    onPress={() => joinGroup({groupId, userId: user!.id})}
                                    className="bg-primary px-6 py-2 rounded-full mt-4"
                                >
                                    <Text className="text-white font-bold">UNLOCK VAULT</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    )}
                </View>
            </ScrollView>
        </GradientView>
    );
}
