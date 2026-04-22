import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {Platform} from "react-native";

import {getNotificationsApi, hasUnreadNotificationsApi, markNotificationsReadApi, updatePushTokenApi} from "@/src/services/notification.api";

export const useNotifications = (userId: number) => {
    return useQuery({
        queryKey: ["notifications", userId],
        queryFn: () => getNotificationsApi(userId),
        enabled: !!userId,
    });
};

export const useRegisterPushToken = () => {
    return useMutation({
        mutationFn: async (userId: number) => {
            if (Platform.OS === 'web') return;

            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                return;
            }

            const projectId =
                Constants.easConfig?.projectId ??
                Constants.expoConfig?.extra?.eas?.projectId;

            const tokenData = await Notifications.getExpoPushTokenAsync({projectId});

            await updatePushTokenApi(userId, tokenData.data);
        },
        onError: (error: any) => {
            Sentry.captureException(error);
        }
    });
};

export const useMarkNotificationsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: number) => markNotificationsReadApi(userId),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['notifications']}),
    });
};

export const useHasUnread = (userId: number) => {
    return useQuery({
        queryKey: ['notifications', 'unread', userId],
        queryFn: () => hasUnreadNotificationsApi(userId),
        enabled: !!userId,
    });
};