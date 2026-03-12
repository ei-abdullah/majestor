import React from "react";
import {View, Text, ScrollView, Pressable, Platform} from "react-native";
import {useAuthStore} from "@/src/stores/authStore";
import {useUserDetails} from "@/src/queries/user.queries";
import GradientView from "@/src/components/ui/GradientView";
import UserAvatar from "@/src/components/ui/UserAvatar";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";

function Home() {
    const {user, clearSession} = useAuthStore();
    const {data: userDetails, isPending, isError, refetch} = useUserDetails(user!.id);

    const displayName = userDetails?.username?.split(' ')[0]
        ?? user?.username?.split(' ')[0]
        ?? 'Student';

    if (isPending) return <LoadingIndicator />;

    if (isError && !userDetails) {
        return (
            <GradientView>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 24}}>
                    <Feather name="wifi-off" size={48} color="#9CA3AF" />
                    <Text style={{fontSize: 18, fontWeight: '600', color: '#111827'}}>
                        Couldn't load your profile
                    </Text>
                    <Text style={{fontSize: 14, color: '#6B7280', textAlign: 'center'}}>
                        Check your connection and try again.
                    </Text>
                    <Pressable
                        onPress={() => refetch()}
                        style={{backgroundColor: '#3A6FF8', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center'}}
                    >
                        <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>Retry</Text>
                    </Pressable>
                    <Pressable
                        onPress={clearSession}
                        style={{borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center'}}
                    >
                        <Text style={{color: '#6B7280', fontWeight: '600', fontSize: 15}}>Logout</Text>
                    </Pressable>
                </View>
            </GradientView>
        );
    }

    const quickActions = [
        {id: 1, title: "Documents", icon: "file-text" as const, route: "/(tabs)/document"},
        {id: 2, title: "Upload",    icon: "upload"    as const, route: "/(tabs)/document/upload"},
        {id: 3, title: "Profile",   icon: "user"      as const, route: "/(tabs)/user"},
        {id: 4, title: "Carpool",   icon: "map"       as const, route: "/(tabs)/carpool"},
    ];

    return (
        <GradientView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 32}}
            >
                {/* ── Header Banner ────────────────────────────────────── */}
                <LinearGradient
                    colors={['#3A6FF8', '#5B8BFA']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                        paddingTop: Platform.OS === 'android' ? 52 : 64,
                        paddingBottom: 32,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 28,
                        borderBottomRightRadius: 28,
                    }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flex: 1}}>
                            <Text style={{color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4}}>
                                Welcome back
                            </Text>
                            <Text style={{color: 'white', fontSize: 26, fontWeight: '700', letterSpacing: 0.2}}>
                                {displayName}
                            </Text>
                        </View>
                        <Pressable onPress={() => router.push("/(tabs)/user")} style={{marginLeft: 12}}>
                            <UserAvatar
                                avatarUrl={userDetails?.avatar || null}
                                username={userDetails?.username || displayName}
                                onAvatarUpdate={() => {}}
                                size={60}
                                showCamera={false}
                                editable={false}
                            />
                        </Pressable>
                    </View>

                    {/* University pill */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        alignSelf: 'flex-start',
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 20,
                        gap: 6,
                    }}>
                        <Feather name="award" size={13} color="rgba(255,255,255,0.9)" />
                        <Text style={{color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '500'}}>
                            {userDetails?.university ?? 'University'}
                        </Text>
                    </View>
                </LinearGradient>

                <View style={{paddingHorizontal: 20, marginTop: 28}}>

                    {/* ── Quick Access ─────────────────────────────────── */}
                    <Text style={{fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14}}>
                        Quick Access
                    </Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 12}}>
                        {quickActions.map((action) => (
                            <Pressable
                                key={action.id}
                                onPress={() => router.push(action.route as any)}
                                style={{width: '47%'}}
                            >
                                {({pressed}) => (
                                    <View style={{
                                        backgroundColor: 'white',
                                        borderRadius: 16,
                                        paddingVertical: 20,
                                        paddingHorizontal: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 12,
                                        opacity: pressed ? 0.85 : 1,
                                        shadowColor: '#3A6FF8',
                                        shadowOffset: {width: 0, height: 2},
                                        shadowOpacity: 0.07,
                                        shadowRadius: 8,
                                        elevation: 2,
                                    }}>
                                        <View style={{
                                            backgroundColor: '#EEF2FF',
                                            borderRadius: 12,
                                            padding: 10,
                                        }}>
                                            <Feather name={action.icon} size={20} color="#3A6FF8" />
                                        </View>
                                        <Text style={{fontSize: 14, fontWeight: '600', color: '#1F2937'}}>
                                            {action.title}
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>

                    {/* ── Info Cards ───────────────────────────────────── */}
                    <Text style={{fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 28, marginBottom: 14}}>
                        Your Details
                    </Text>

                    {/* Faculty card */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 1,
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
                            <View style={{backgroundColor: '#F0FDF4', borderRadius: 12, padding: 10}}>
                                <Feather name="book-open" size={20} color="#16A34A" />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 11, color: '#9CA3AF', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2}}>
                                    Faculty
                                </Text>
                                <Text style={{fontSize: 14, fontWeight: '600', color: '#111827'}}>
                                    {userDetails?.faculty ?? '—'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* University card */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 1,
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
                            <View style={{backgroundColor: '#FFF7ED', borderRadius: 12, padding: 10}}>
                                <Feather name="home" size={20} color="#EA580C" />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 11, color: '#9CA3AF', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2}}>
                                    University
                                </Text>
                                <Text style={{fontSize: 14, fontWeight: '600', color: '#111827'}}>
                                    {userDetails?.university ?? '—'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Email card */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 1,
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
                            <View style={{backgroundColor: '#EFF6FF', borderRadius: 12, padding: 10}}>
                                <Feather name="mail" size={20} color="#3A6FF8" />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 11, color: '#9CA3AF', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2}}>
                                    University Email
                                </Text>
                                <Text style={{fontSize: 14, fontWeight: '600', color: '#111827'}} numberOfLines={1}>
                                    {userDetails?.email ?? '—'}
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </GradientView>
    );
}

export default Home;