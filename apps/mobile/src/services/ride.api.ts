import {AxiosResponse} from "axios";

import api from "@/src/services/index";
import {RecentRideResponse, UploadRideDetails, UploadRideResponse} from "@/src/types/ride";


export const uploadRideApi = async (
    uploadRideDetails: UploadRideDetails,
    userId: number
): Promise<UploadRideResponse> => {
    const res: AxiosResponse<UploadRideResponse> = await api.post(`/ride/uploadRide/${userId}`, uploadRideDetails);
    return res.data!;
}

export const recentRidesApi = async (): Promise<RecentRideResponse[]> => {
    const res: AxiosResponse<RecentRideResponse[]> = await api.get(`/ride/recentRides`);
    return res.data;
}