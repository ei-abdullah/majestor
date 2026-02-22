import {AxiosResponse} from "axios";

import api from "@/src/services/index";
import {UploadRideRequestDetails, UploadRideRequestResponse} from "@/src/types/rideRequest";


export const uploadRideRequestApi = async (
    uploadRideRequestDetails: UploadRideRequestDetails, userId: number
): Promise<UploadRideRequestResponse> => {
    const res: AxiosResponse<UploadRideRequestResponse> = await api.post(`/rideRequest/uploadRideRequest/${userId}`, uploadRideRequestDetails);
    return res.data!;
}
