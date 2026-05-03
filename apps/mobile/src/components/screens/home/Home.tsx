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
    gradientColors: [string, string];
}

function StatCard({icon, label, value, gradientColors}: StatCardProps) {
    return (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 22,
            padding: 18,
            marginRight: 12,
            width: 120,
        }}>
            <LinearGradient
                colors={gradientColors}
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                }}
            >
                <Feather name={icon} size={19} color="white"/>
            </LinearGradient>
            <Text style={{color: '#1A2340', fontFamily: 'Inter_800ExtraBold', fontSize: 24, letterSpacing: -0.5}}>
                {value ?? '—'}
            </Text>
            <Text style={{color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 2}}>
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
        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 100}}>
            {values.map((v, i) => {
                const isToday = i === 6;
                const barH = Math.max((v / max) * 72, v > 0 ? 12 : 6);
                return (
                    <View key={i} style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <View style={{width: '100%', height: barH, borderRadius: 8, overflow: 'hidden'}}>
                            {isToday || v > 0 ? (
                                <LinearGradient
                                    colors={isToday ? ['#3A6FF8', '#8DDDD3'] : ['#C7D7FD', '#EEF3FF']}
                                    start={{x: 0, y: 0}} end={{x: 0, y: 1}}
                                    style={{flex: 1}}
                                />
                            ) : (
                                <View style={{flex: 1, backgroundColor: '#F3F4F6'}}/>
                            )}
                        </View>
                        <Text style={{
                            fontSize: 9,
                            fontFamily: 'Inter_700Bold',
                            color: isToday ? '#3A6FF8' : '#9CA3AF',
                            marginTop: 6,
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

    const isPremium = userDetails?.premiumUntil
        ? new Date(userDetails.premiumUntil) > new Date()
        : false;

    const totalActions = (stats?.activityLast7Days ?? []).reduce((a, b) => a + b, 0);

    const storageUsed = userDetails?.storageUsed ?? 0;
    const storageLimit = userDetails?.storageLimit ?? 1;
    const storagePct = Math.min(storageUsed / storageLimit, 1);
    const formatStorage = (bytes: number) => {
        if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
        return `${(bytes / 1024).toFixed(0)} KB`;
    };

    if (isPending) return <LoadingIndicator/>;

    if (isError && !userDetails) {
        return (
            <GradientView>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 24}}>
                    <Feather name="wifi-off" size={48} color="#9CA3AF"/>
                    <Text style={{fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#111827'}}>Couldn't load your profile</Text>
                    <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center'}}>Check your connection and try again.</Text>
                    <Pressable onPress={() => refetch()} style={{backgroundColor: '#3A6FF8', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontFamily: 'Inter_600SemiBold', fontSize: 15}}>Retry</Text>
                    </Pressable>
                    <Pressable onPress={clearSession} style={{borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center'}}>
                        <Text style={{color: '#6B7280', fontFamily: 'Inter_600SemiBold', fontSize: 15}}>Logout</Text>
                    </Pressable>
                </View>
            </GradientView>
        );
    }

    return (
        <GradientView>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 130}}>

                {/* ── Hero Header ──────────────────────────────────────────── */}
                <LinearGradient
                    colors={isPremium ? ['#1A1A2E', '#2D1B69', '#3A6FF8'] : ['#1A3A8A', '#3A6FF8']}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={{
                        paddingTop: Platform.OS === 'android' ? 52 : 64,
                        paddingBottom: 44,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 36,
                        borderBottomRightRadius: 36,
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative background circles */}
                    <View style={{position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)'}}/>
                    <View style={{position: 'absolute', top: 30, right: 70, width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.04)'}}/>
                    <View style={{position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.04)'}}/>

                    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                        <View style={{flex: 1}}>
                            <Text style={{color: 'rgba(255,255,255,0.55)', fontSize: 14, fontFamily: 'Inter_500Medium', marginBottom: 6, letterSpacing: 0.2}}>
                                {getGreeting()}
                            </Text>
                            <Text style={{color: 'white', fontSize: 30, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.8, lineHeight: 36}}>
                                {displayName}
                            </Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap'}}>
                                <View style={{backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}}>
                                    <Feather name="award" size={11} color="rgba(255,255,255,0.75)"/>
                                    <Text style={{color: 'rgba(255,255,255,0.75)', fontSize: 11, fontFamily: 'Inter_600SemiBold'}}>
                                        {userDetails?.university ?? 'University'}
                                    </Text>
                                </View>
                                {userDetails?.roles?.includes('FACULTY') && (
                                    <View style={{backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'}}>
                                        <Text style={{color: 'white', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5}}>FACULTY</Text>
                                    </View>
                                )}
                                {isPremium && (
                                    <View style={{backgroundColor: 'rgba(251,191,36,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: 'rgba(251,191,36,0.45)'}}>
                                        <Feather name="star" size={11} color="#FCD34D"/>
                                        <Text style={{color: '#FCD34D', fontSize: 11, fontFamily: 'Inter_700Bold'}}>Elite</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <Pressable
                                onPress={() => router.push("/notification" as Href)}
                                style={{backgroundColor: 'rgba(255,255,255,0.12)', width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)'}}
                            >
                                <Feather name="bell" size={19} color="white"/>
                                {hasUnread && (
                                    <View style={{position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4444', borderWidth: 1.5, borderColor: 'rgba(26,58,138,0.8)'}}/>
                                )}
                            </Pressable>
                            <Pressable onPress={() => router.push("/(tabs)/user" as Href)}>
                                <View style={isPremium ? {padding: 2.5, borderRadius: 50, borderWidth: 2, borderColor: '#FCD34D'} : undefined}>
                                    <UserAvatar
                                        avatarUrl={userDetails?.avatar || null}
                                        username={userDetails?.username || displayName}
                                        onAvatarUpdate={() => {}}
                                        size={48}
                                        showCamera={false}
                                        editable={false}
                                    />
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{paddingHorizontal: 20, marginTop: 28, gap: 24}}>


                    {/* ── Stats Row ─────────────────────────────────────────── */}
                    <View>
                        <Text style={{fontSize: 12, fontFamily: 'Inter_700Bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14}}>
                            Your Activity
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
                            <StatCard icon="upload-cloud" label="Uploads"   value={stats?.documentsUploaded} gradientColors={['#3A6FF8', '#6B93FF']}/>
                            <StatCard icon="users"        label="Groups"    value={stats?.groupsJoined}      gradientColors={['#7B1FA2', '#AB47BC']}/>
                            <StatCard icon="navigation"   label="Rides"     value={stats?.ridesPosted}       gradientColors={['#E65100', '#FF7043']}/>
                            <StatCard icon="check-circle" label="Completed" value={stats?.ridesCompleted}    gradientColors={['#2E7D32', '#43A047']}/>
                        </ScrollView>
                    </View>

                    {/* ── Activity Chart ────────────────────────────────────── */}
                    <View style={{backgroundColor: 'white', borderRadius: 24, padding: 22}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22}}>
                            <View>
                                <Text style={{color: '#1A2340', fontFamily: 'Inter_800ExtraBold', fontSize: 16}}>This week</Text>
                                <Text style={{color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2}}>
                                    {totalActions} total actions
                                </Text>
                            </View>
                            <View style={{backgroundColor: '#EEF3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12}}>
                                <Text style={{color: '#3A6FF8', fontSize: 12, fontFamily: 'Inter_700Bold'}}>7 days</Text>
                            </View>
                        </View>
                        <ActivityChart data={stats?.activityLast7Days}/>
                    </View>

                    {/* ── Storage (Premium only) ────────────────────────────── */}
                    {isPremium && userDetails?.storageLimit != null && (
                        <View style={{backgroundColor: 'white', borderRadius: 24, padding: 22}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                    <View style={{backgroundColor: '#FEF3C7', width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                        <Feather name="database" size={17} color="#D97706"/>
                                    </View>
                                    <View>
                                        <Text style={{color: '#1A2340', fontFamily: 'Inter_700Bold', fontSize: 14}}>Storage</Text>
                                        <Text style={{color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 1}}>Elite cloud storage</Text>
                                    </View>
                                </View>
                                <Text style={{color: '#D97706', fontFamily: 'Inter_700Bold', fontSize: 13}}>
                                    {Math.round(storagePct * 100)}%
                                </Text>
                            </View>
                            <View style={{height: 8, backgroundColor: '#F3F4F6', borderRadius: 8, overflow: 'hidden'}}>
                                <LinearGradient
                                    colors={['#F59E0B', '#FCD34D']}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                    style={{height: '100%', width: `${storagePct * 100}%`, borderRadius: 8}}
                                />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                                <Text style={{color: '#6B7280', fontSize: 11, fontFamily: 'Inter_500Medium'}}>
                                    {formatStorage(storageUsed)} used
                                </Text>
                                <Text style={{color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_500Medium'}}>
                                    {formatStorage(storageLimit)} total
                                </Text>
                            </View>
                        </View>
                    )}

                </View>
            </ScrollView>
        </GradientView>
    );
}