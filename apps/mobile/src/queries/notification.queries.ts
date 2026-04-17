import {useMutation, useQuery} from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {Platform} from "react-native";

import {getNotificationsApi, updatePushTokenApi} from "@/src/services/notification.api";

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

            if (finalStatus !== 'granted') return;

            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            const tokenData = await Notifications.getExpoPushTokenAsync({projectId});

            await updatePushTokenApi(userId, tokenData.data);
        },
        onError: (error: any) => {
            Sentry.captureException(error);
        }
    });
};