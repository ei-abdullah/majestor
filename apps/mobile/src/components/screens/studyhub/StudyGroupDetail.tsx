import React, {useState, useMemo, useRef} from "react";
import {View, Text, ScrollView, TouchableOpacity, RefreshControl, Pressable} from "react-native";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {router, useLocalSearchParams} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

import {useAuthStore} from "@/src/stores/authStore";
import {useGroupDetails, useJoinGroup, useRateGroup} from "@/src/queries/studyhub.queries";
import {type, years, filterByLike} from "@/src/constants";
import InviteModal from "./InviteModal";

import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import DocumentCard from "./DocumentCard";
import Card from "@/src/components/ui/Card";
import StyledDropDown from "@/src/components/ui/StyledDropDown";
import FloatingActionButton from "@/src/components/ui/FloatingActionButton";

export default function StudyGroupDetail() {
    const {id} = useLocalSearchParams();
    const {user} = useAuthStore();
    const groupId = Number(id);

    const {data: group, isPending, refetch} = useGroupDetails(groupId, user!.id);
    const {mutate: joinGroup, isPending: isJoining} = useJoinGroup();
    const {mutate: rateGroup} = useRateGroup();

    const inviteSheetRef = useRef<BottomSheetModal>(null);
    const isHost = group?.hostName === user?.username;

    // Local filter state for the Vault Card
    const [filters, setFilters] = useState({
        docType: '',
        year: '',
        sortByLikes: ''
    });

    // Client-side filtering logic for the group documents
    const visibleDocs = useMemo(() => {
        if (!group?.documents) return [];
        let docs = [...group.documents];

        if (filters.docType) docs = docs.filter(d => d.documentType === filters.docType);
        if (filters.year) docs = docs.filter(d => d.year.toString() === filters.year);
        
        if (filters.sortByLikes === 'true') {
            docs = docs.sort((a, b) => b.likesCount - a.likesCount);
        }

        return docs;
    }, [group?.documents, filters]);

    if (isPending) return <LoadingIndicator />;
    if (!group) return null;

    return (
        <GradientView>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8" />}
                contentContainerStyle={{paddingBottom: 140, paddingTop: 100}}
            >
                {/* 1. Header & Classroom Info Card */}
                <View className="px-6 mb-6">
                    <Card className="bg-white rounded-[32px] border-0 shadow-blue p-7">
                        <View className="flex-row justify-between items-end mb-6">
                            {group.isOfficial && (
                                <View className="bg-mj-yellow-500 px-3 py-1.5 rounded-xl shadow-sm">
                                    <Text className="text-mj-text-main text-[10px] font-black uppercase tracking-widest">Faculty Official</Text>
                                </View>
                            )}
                        </View>

                        <Text className="text-mj-text-main font-bold text-3xl leading-tight mb-4">{group.name}</Text>
                        
                        <View className="flex-row items-center bg-mj-bg-light p-4 rounded-2xl border border-mj-bg-blue mb-6">
                            <View className="bg-white p-2 rounded-xl shadow-sm mr-3">
                                <Feather name="user" size={16} color="#3A6FF8" />
                            </View>
                            <View>
                                <Text className="text-mj-text-secondary text-[10px] font-bold uppercase tracking-wider">Host & Course</Text>
                                <Text className="text-mj-text-main font-bold text-sm">{group.hostName} • {group.courseName}</Text>
                            </View>
                        </View>

                        {/* Stats Row */}
                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1 items-center py-4 bg-mj-blue-50 rounded-2xl border border-mj-blue-100">
                                <Text className="text-mj-blue-700 font-bold text-xl">{group.memberCount}</Text>
                                <Text className="text-mj-blue-400 text-[9px] font-black uppercase tracking-widest mt-1">Students</Text>
                            </View>
                            <View className="flex-1 items-center py-4 bg-mj-teal-50 rounded-2xl border border-mj-teal-100">
                                <Text className="text-mj-teal-700 font-bold text-xl">{group.documents?.length || 0}</Text>
                                <Text className="text-mj-teal-400 text-[9px] font-black uppercase tracking-widest mt-1">Resources</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center gap-4 ">
                            {group.isCurrentUserMember ? (
                                <Pressable
                                    onPress={() => router.push({
                                        pathname: "/groupchat" as any,
                                        params: {
                                            groupId: group.id,
                                            groupName: group.name
                                        }
                                    })}
                                    className="flex-1 bg-mj-blue-600 py-5 rounded-[28px] flex-row items-center justify-center shadow-blue"
                                >
                                    <Feather name="message-square" size={20} color="white" />
                                    <Text className="text-white font-bold ml-2 text-base">Open Chat</Text>
                                </Pressable>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => joinGroup({groupId, userId: user!.id})}
                                    disabled={isJoining}
                                    className="flex-1 bg-mj-blue-600 py-5 rounded-[28px] flex-row items-center justify-center shadow-blue"
                                >
                                    <Feather name={isJoining ? "loader" : "user-plus"} size={20} color="white" />
                                    <Text className="text-white font-bold ml-2 text-base">
                                        {isJoining ? "Joining..." : "Join Group"}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {isHost && (
                                <TouchableOpacity
                                    onPress={() => inviteSheetRef.current?.present()}
                                    className="bg-white w-16 h-16 rounded-[28px] items-center justify-center shadow-sm border border-mj-bg-blue"
                                >
                                    <Feather name="user-plus" size={22} color="#3A6FF8"/>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={() => rateGroup({groupId, userId: user!.id})}
                                className="bg-white w-16 h-16 rounded-[28px] items-center justify-center shadow-sm border border-mj-bg-blue"
                            >
                                <Feather name="thumbs-up" size={24} color={group.popularityScore > 0 ? "#FBCB43" : "#9E9E9E"} />
                            </TouchableOpacity>
                        </View>
                    </Card>

                    <InviteModal ref={inviteSheetRef} groupId={groupId} inviterId={user!.id}/>


                </View>

                {/* 2. Primary Actions Row */}


                {/* 3. Document Vault Card */}
                <View className="px-6">
                    <Card className="bg-white rounded-[32px] border-0 shadow-blue p-7">
                        <View className="flex-row items-center justify-between mb-8 px-1">
                            <View className="flex-row items-center">
                                <View className="bg-mj-teal-50 p-2.5 rounded-2xl mr-4 border border-mj-teal-100 shadow-sm">
                                    <Feather name="file-text" size={18} color="#6FD0C5" />
                                </View>
                                <View>
                                    <Text className="text-mj-text-main font-bold text-xl tracking-tighter uppercase">Vault</Text>
                                    <Text className="text-mj-text-secondary text-[10px] font-bold opacity-50 uppercase">{group.documents?.length} Resources Available</Text>
                                </View>
                            </View>
                        </View>

                        {/* Horizontal Filter Suite inside the Card */}
                        <View className="mb-8">
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{gap: 8, paddingHorizontal: 2}}
                            >
                                <StyledDropDown
                                    options={type}
                                    value={filters.docType}
                                    onChange={(v) => setFilters({...filters, docType: v.toString()})}
                                    placeholder="Type"
                                    size="compact"
                                    className="w-32 bg-white border-mj-bg-blue shadow-none"
                                    noShadow={true}
                                />
                                <StyledDropDown
                                    options={years}
                                    value={filters.year}
                                    onChange={(v) => setFilters({...filters, year: v.toString()})}
                                    placeholder="Year"
                                    size="compact"
                                    className="w-32 bg-white border-mj-bg-blue shadow-none"
                                    noShadow={true}
                                />
                                <StyledDropDown
                                    options={filterByLike}
                                    value={filters.sortByLikes}
                                    onChange={(v) => setFilters({...filters, sortByLikes: v.toString()})}
                                    placeholder="Sort"
                                    size="compact"
                                    className="w-32 bg-white border-mj-bg-blue shadow-none"
                                    noShadow={true}
                                />
                                {(filters.docType || filters.year || filters.sortByLikes) && (
                                    <TouchableOpacity 
                                        onPress={() => setFilters({docType: '', year: '', sortByLikes: ''})}
                                        className="bg-mj-blue-50 px-4 items-center justify-center rounded-xl border border-mj-blue-100"
                                    >
                                        <Text className="text-mj-blue font-black text-[10px] uppercase tracking-widest">Reset</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>
                        
                        {visibleDocs.length > 0 ? (
                            visibleDocs.map((doc) => (
                                <DocumentCard key={doc.id} document={doc} />
                            ))
                        ) : (
                            <View className="items-center py-10 opacity-30">
                                <Feather name="slash" size={40} color="#121826" />
                                <Text className="text-mj-text-main font-bold mt-2 uppercase tracking-widest text-xs text-center">No matches found</Text>
                            </View>
                        )}

                        {/* Teaser Overlay - Brand Refined */}
                        {group.isPreview && (
                            <View className="mt-4">
                                <LinearGradient
                                    colors={['transparent', 'rgba(255,255,255,0.95)', '#FFFFFF']}
                                    style={{height: 280, marginTop: -200, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20, borderRadius: 32}}
                                >
                                    <View className="bg-mj-blue-50 p-5 rounded-full mb-4 border border-mj-blue-100 shadow-sm">
                                        <Feather name="lock" size={32} color="#3A6FF8" />
                                    </View>
                                    <Text className="text-mj-text-main font-bold text-lg text-center px-10">Join group to unlock all resources</Text>
                                    <TouchableOpacity 
                                        onPress={() => joinGroup({groupId, userId: user!.id})}
                                        className="bg-mj-blue-600 px-12 py-4 rounded-[22px] mt-6 shadow-blue"
                                    >
                                        <Text className="text-white font-bold text-base uppercase">Unlock Vault</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        )}
                    </Card>
                </View>
            </ScrollView>

            {/* Floating Action Button positioned above tab bar */}
            <View style={{
                position: 'absolute',
                bottom: 130,
                left: 30,
                zIndex: 1000
            }}>
                <FloatingActionButton 
                    href={{
                        pathname: "/(tabs)/studyhub/uploadDocument" as any,
                        params: { 
                            destination: 'STUDY_GROUP',
                            studyGroupId: String(groupId),
                            courseId: String(group.courseId)
                        }
                    }} 
                    icon={"file-text"}
                />
            </View>
        </GradientView>
    );
}
