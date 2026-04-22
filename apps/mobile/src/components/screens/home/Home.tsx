import React from "react";
import {View, Text, ScrollView, Pressable, Platform} from "react-native";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {Href, router} from "expo-router";


import {useAuthStore} from "@/src/stores/authStore";
import {useUserDetails, useUserStats} from "@/src/queries/user.queries";
import {useHasUnread} from "@/src/queries/notification.queries";
import GradientView from "@/src/components/ui/GradientView";
import UserAvatar from "@/src/components/ui/UserAvatar";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function getDayLabels(): string[] {
    const abbr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const labels: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(i === 0 ? 'Today' : abbr[d.getDay()]);
    }
    return labels;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: number | undefined;
    iconBg: string;
    iconColor: string;
}

function StatCard({icon, label, value, iconBg, iconColor}: StatCardProps) {
    return (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 18,
            marginRight: 12,
            width: 110,
        }}>
            <View style={{
                backgroundColor: iconBg,
                width: 38,
                height: 38,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
            }}>
                <Feather name={icon} size={18} color={iconColor}/>
            </View>
            <Text style={{color: '#1A2340', fontWeight: '800', fontSize: 22, letterSpacing: -0.5}}>
                {value ?? '—'}
            </Text>
            <Text style={{color: '#9CA3AF', fontSize: 11, fontWeight: '600', marginTop: 2}}>
                {label}
            </Text>
        </View>
    );
}

function ActivityChart({data}: { data: number[] | undefined }) {
    const values = data ?? [0, 0, 0, 0, 0, 0, 0];
    const max = Math.max(...values, 1);
    const labels = getDayLabels();

    return (
        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 90}}>
            {values.map((v, i) => {
                const isToday = i === 6;
                const barH = Math.max((v / max) * 64, v > 0 ? 10 : 4);
                return (
                    <View key={i} style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <View style={{width: '100%', height: barH, borderRadius: 6, overflow: 'hidden'}}>
                            {isToday || v > 0 ? (
                                <LinearGradient
                                    colors={isToday ? ['#3A6FF8', '#8DDDD3'] : ['#C7D7FD', '#EEF3FF']}
                                    start={{x: 0, y: 0}} end={{x: 0, y: 1}}
                                    style={{flex: 1}}
                                />
                            ) : (
                                <View style={{flex: 1, backgroundColor: '#F0F4FF'}}/>
                            )}
                        </View>
                        <Text style={{
                            fontSize: 9,
                            fontWeight: '700',
                            color: isToday ? '#3A6FF8' : '#9CA3AF',
                            marginTop: 5,
                        }}>
                            {labels[i]}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}


export default function Home() {
    const {user, clearSession} = useAuthStore();
    const {data: userDetails, isPending, isError, refetch} = useUserDetails(user!.id);
    const {data: stats} = useUserStats(user!.id);
    const {data: hasUnread} = useHasUnread(user!.id);

    const displayName = userDetails?.username?.split(' ')[0]
        ?? user?.username?.split(' ')[0]
        ?? 'Student';

    if (isPending) return <LoadingIndicator/>;

    if (isError && !userDetails) {
        return (
            <GradientView>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 24}}>
                    <Feather name="wifi-off" size={48} color="#9CA3AF"/>
                    <Text style={{fontSize: 18, fontWeight: '600', color: '#111827'}}>Couldn't load your profile</Text>
                    <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center'}}>Check your connection and try again.</Text>
                    <Pressable onPress={() => refetch()} style={{backgroundColor: '#3A6FF8', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>Retry</Text>
                    </Pressable>
                    <Pressable onPress={clearSession} style={{borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center'}}>
                        <Text style={{color: '#6B7280', fontWeight: '600', fontSize: 15}}>Logout</Text>
                    </Pressable>
                </View>
            </GradientView>
        );
    }

    return (
        <GradientView>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 130}}>

                <LinearGradient
                    colors={['#1A3A8A', '#3A6FF8']}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={{
                        paddingTop: Platform.OS === 'android' ? 52 : 64,
                        paddingBottom: 36,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32,
                    }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                        <View style={{flex: 1}}>
                            <Text style={{color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '500', marginBottom: 4}}>
                                {getGreeting()}
                            </Text>
                            <Text style={{color: 'white', fontSize: 28, fontWeight: '800', letterSpacing: -0.5}}>
                                {displayName}
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10}}>
                                <View style={{backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                    <Feather name="award" size={11} color="rgba(255,255,255,0.8)"/>
                                    <Text style={{color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600'}}>
                                        {userDetails?.university ?? 'University'}
                                    </Text>
                                </View>
                                {userDetails?.roles?.includes('FACULTY') && (
                                    <View style={{backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20}}>
                                        <Text style={{color: 'white', fontSize: 10, fontWeight: '800'}}>FACULTY</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <Pressable
                                onPress={() => router.push("/notifications" as Href)}
                                style={{backgroundColor: 'rgba(255,255,255,0.15)', width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)'}}
                            >
                                <Feather name="bell" size={19} color="white"/>
                                {hasUnread && (
                                    <View style={{position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4444', borderWidth: 1.5, borderColor: '#3A6FF8'}}/>
                                )}
                            </Pressable>
                            <Pressable onPress={() => router.push("/(tabs)/user" as Href)}>
                                <UserAvatar
                                    avatarUrl={userDetails?.avatar || null}
                                    username={userDetails?.username || displayName}
                                    onAvatarUpdate={() => {}}
                                    size={48}
                                    showCamera={false}
                                    editable={false}
                                />
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{paddingHorizontal: 20, marginTop: 24, gap: 20}}>

                    {/* ── Stats Row ─────────────────────────────────────── */}
                    <View>
                        <Text style={{fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14}}>
                            Your Activity
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
                            <StatCard icon="upload-cloud" label="Uploads"   value={stats?.documentsUploaded} iconBg="#EEF3FF" iconColor="#3A6FF8"/>
                            <StatCard icon="users"        label="Groups"    value={stats?.groupsJoined}      iconBg="#F3E5F5" iconColor="#7B1FA2"/>
                            <StatCard icon="navigation"   label="Rides"     value={stats?.ridesPosted}       iconBg="#FFF3E0" iconColor="#E65100"/>
                            <StatCard icon="check-circle" label="Completed" value={stats?.ridesCompleted}    iconBg="#E8F5E9" iconColor="#2E7D32"/>
                        </ScrollView>
                    </View>

                    <View style={{backgroundColor: 'white', borderRadius: 24, padding: 20}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                            <Text style={{color: '#1A2340', fontWeight: '800', fontSize: 15}}>This week</Text>
                            <Text style={{color: '#9CA3AF', fontSize: 11, fontWeight: '600'}}>
                                {(stats?.activityLast7Days ?? []).reduce((a, b) => a + b, 0)} actions
                            </Text>
                        </View>
                        <ActivityChart data={stats?.activityLast7Days}/>
                    </View>


                </View>
            </ScrollView>
        </GradientView>
    );
}