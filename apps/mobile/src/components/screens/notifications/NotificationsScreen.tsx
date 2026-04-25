import React, {useEffect} from "react";
import {View, Text, ScrollView, RefreshControl, TouchableOpacity} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";
import {router} from "expo-router";
import CustomHeader from "@/src/components/ui/CustomHeader";

import {useAuthStore} from "@/src/stores/authStore";
import {useMarkNotificationsRead, useNotifications} from "@/src/queries/notification.queries";
import {useAcceptInvite, useRejectInvite} from "@/src/queries/studyhub.queries";
import {Notification, NotificationType} from "@/src/types/notifications";
import GradientView from "@/src/components/ui/GradientView";
import LoadingIndicator from "@/src/components/ui/LoadingIndicator";

interface NotificationMeta {
    icon: keyof typeof Feather.glyphMap;
    bg: string;
    iconColor: string;
}

function getNotificationMeta(type: NotificationType): NotificationMeta {
    switch (type) {
        case 'RIDE_BOOKED':
            return {icon: 'user-plus', bg: '#EEF3FF', iconColor: '#3A6FF8'};
        case 'RIDE_ACCEPTED':
            return {icon: 'check-circle', bg: '#E8F5E9', iconColor: '#2E7D32'};
        case 'RIDE_REJECTED':
            return {icon: 'x-circle', bg: '#FFEBEE', iconColor: '#C62828'};
        case 'RIDE_COMPLETED':
            return {icon: 'flag', bg: '#E8F9F7', iconColor: '#22B5A6'};
        case 'RIDE_CANCELLED':
            return {icon: 'alert-circle', bg: '#FFF3E0', iconColor: '#E65100'};
        case 'STUDY_GROUP_INVITE':
            return {icon: 'users', bg: '#F3E5F5', iconColor: '#7B1FA2'};
        default:
            return {icon: 'bell', bg: '#F5F7FF', iconColor: '#5A6275'};
    }
}

function timeAgo(isoString: string): string {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationItem({notification}: { notification: Notification }) {
    const meta = getNotificationMeta(notification.notificationType);
    const {mutate: acceptInvite, isPending: isAccepting} = useAcceptInvite();
    const {mutate: rejectInvite, isPending: isRejecting} = useRejectInvite();
    const isInvite = notification.notificationType === 'STUDY_GROUP_INVITE';

    return (
        <View style={{
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F4FF',
        }}>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <View style={{
                    backgroundColor: meta.bg,
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    flexShrink: 0,
                }}>
                    <Feather name={meta.icon} size={20} color={meta.iconColor}/>
                </View>

                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3}}>
                        <Text style={{color: '#1A2340', fontFamily: 'Inter_700Bold', fontSize: 14, flex: 1, marginRight: 8}} numberOfLines={1}>
                            {notification.title}
                        </Text>
                        <Text style={{color: '#5A6275', fontSize: 10, fontFamily: 'Inter_600SemiBold', opacity: 0.6, flexShrink: 0}}>
                            {timeAgo(notification.createdAt)}
                        </Text>
                    </View>
                    <Text style={{color: '#5A6275', fontSize: 13, lineHeight: 18}} numberOfLines={2}>
                        {notification.message}
                    </Text>
                    {notification.senderName ? (
                        <Text style={{color: '#3A6FF8', fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 4}}>
                            from {notification.senderName}
                        </Text>
                    ) : null}
                </View>
            </View>

            {isInvite && notification.relatedId && (
                notification.response ? (
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginLeft: 58}}>
                        <Feather
                            name={notification.response === 'ACCEPTED' ? 'check-circle' : 'x-circle'}
                            size={14}
                            color={notification.response === 'ACCEPTED' ? '#2E7D32' : '#C62828'}
                        />
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Inter_600SemiBold',
                            color: notification.response === 'ACCEPTED' ? '#2E7D32' : '#C62828',
                        }}>
                            {notification.response === 'ACCEPTED' ? 'You accepted this invite' : 'You declined this invite'}
                        </Text>
                    </View>
                ) : (
                    <View style={{flexDirection: 'row', gap: 10, marginTop: 12, marginLeft: 58}}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                onPress={() => acceptInvite(notification.relatedId!)}
                                disabled={isAccepting || isRejecting}
                                style={{backgroundColor: '#E8F5E9', borderRadius: 12, paddingVertical: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#A5D6A7'}}
                            >
                                <Feather name="check" size={14} color="#2E7D32"/>
                                <Text style={{color: '#2E7D32', fontFamily: 'Inter_700Bold', fontSize: 12}}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                onPress={() => rejectInvite(notification.relatedId!)}
                                disabled={isAccepting || isRejecting}
                                style={{backgroundColor: '#FFEBEE', borderRadius: 12, paddingVertical: 9, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#FFCDD2'}}
                            >
                                <Feather name="x" size={14} color="#C62828"/>
                                <Text style={{color: '#C62828', fontFamily: 'Inter_700Bold', fontSize: 12}}>Decline</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            )}
        </View>
    );
}

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const {user} = useAuthStore();
    const {data: notifications, isPending, refetch} = useNotifications(user!.id);
    const {mutate: markRead} = useMarkNotificationsRead();

    useEffect(() => {
        markRead(user!.id);
    }, []);

    if (isPending) return <LoadingIndicator/>;

    return (
        <GradientView>
            <CustomHeader
                title="Notifications"
                leftIcon="arrow-left"
                onLeftPress={() => router.back()}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingTop: insets.top + 70, paddingBottom: 40}}
                refreshControl={
                    <RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#3A6FF8"/>
                }
            >
                {!notifications || notifications.length === 0 ? (
                    <View style={{alignItems: 'center', marginTop: 80, paddingHorizontal: 40}}>
                        <View style={{backgroundColor: '#EEF3FF', padding: 24, borderRadius: 32, marginBottom: 20}}>
                            <Feather name="bell-off" size={40} color="#3A6FF8" opacity={0.4}/>
                        </View>
                        <Text style={{color: '#1A2340', fontFamily: 'Inter_800ExtraBold', fontSize: 18, marginBottom: 8}}>
                            All Caught Up
                        </Text>
                        <Text style={{color: '#5A6275', fontSize: 14, textAlign: 'center', lineHeight: 20}}>
                            You have no notifications yet. They'll show up here when something happens.
                        </Text>
                    </View>
                ) : (
                    <View style={{backgroundColor: 'white', borderRadius: 32, marginHorizontal: 16, overflow: 'hidden', shadowColor: '#3A6FF8', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.07, shadowRadius: 24, elevation: 4}}>
                        {notifications.map((notification, index) => (
                            <NotificationItem
                                key={notification.id}
                                notification={{
                                    ...notification,
                                    // last item: remove bottom border via a wrapper trick
                                } as Notification}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </GradientView>
    );
}