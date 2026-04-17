import api from "@/src/services/index";
import {Notification} from "@/src/types/notifications";
import {AxiosResponse} from "axios";

export const getNotificationsApi = async (userId: number): Promise<Notification[]> => {
    const res: AxiosResponse<Notification[]> = await api.get(`/notifications/user/${userId}`);
    return res.data;
};

export const updatePushTokenApi = async (userId: number, pushToken: string): Promise<void> => {
    await api.patch(`/user/update-push-token/${userId}`, null, {
        params: {pushToken}
    });
};