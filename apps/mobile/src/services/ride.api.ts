import {AxiosResponse} from "axios";

import api from "@/src/services/index";
import {RecentRideResponse, UploadRideDetails, UploadRideResponse} from "@/src/types/ride";


export const uploadRideApi = async ({userId, uploadRideDetails}: {
    userId: number,
    uploadRideDetails: UploadRideDetails
}): Promise<UploadRideResponse> => {
    const res: AxiosResponse<UploadRideResponse> = await api.post(`/ride/uploadRide/${userId}`, uploadRideDetails);
    return res.data!;
}

export const recentRidesApi = async (userId: number): Promise<RecentRideResponse[]> => {
    const res: AxiosResponse<RecentRideResponse[]> = await api.get(`/ride/recentRides/${userId}`);
    return res.data;
}