import api from "@/src/services/index";
import {
    CreateStudyGroup,
    CreateStudyGroupResponse,
    FeedResponse,
    GetGroupDetails,
    JoinStudyGroupResponse,
    PendingInvite,
    UserSearchResult
} from "@/src/types/studyHub";
import {AxiosResponse} from "axios";
import {DocumentDestination, Filters, GetDocumentResponse} from "@/src/types/studyHub";

export const getStudyHubFeedApi = async (userId: number): Promise<FeedResponse> => {
    const res: AxiosResponse<FeedResponse> = await api.get(`/study-hub/feed/${userId}`)
    return res.data;
}

export const createStudyGroupApi = async (
    userId: number,
    payload: CreateStudyGroup
): Promise<CreateStudyGroupResponse> => {
    const res: AxiosResponse<CreateStudyGroupResponse> = await api.post(`/study-group/create-group/${userId}`, payload);
    return res.data;
}

export const joinStudyGroupApi = async (studyGroupId: number, userId: number): Promise<JoinStudyGroupResponse> => {
    const res: AxiosResponse<JoinStudyGroupResponse> = await api.post(`/study-group/join-group/${studyGroupId}/${userId}`);
    return res.data;
}

export const leaveStudyGroupApi = async (studyGroupId: number, userId: number): Promise<void> => {
    await api.patch(`/study-group/leave-group/${studyGroupId}/${userId}`);
}

export const getGroupDetailsApi = async (studyGroupId: number, userId: number): Promise<GetGroupDetails> => {
    const res: AxiosResponse<GetGroupDetails> = await api.get(`/study-group/details/${studyGroupId}/${userId}`);
    return res.data;
}

export const rateStudyGroupApi = async (studyGroupId: number, userId: number): Promise<void> => {
    await api.patch(`/study-group/rate/${studyGroupId}/${userId}`);
}


export const uploadDocumentApi = async (
    userId: number,
    formData: FormData
): Promise<void> => {
    await api.post(`/document/uploadDocument/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const getVaultDocumentApi = async (
    userId: number,
    destination: DocumentDestination,
    filters: Filters
): Promise<GetDocumentResponse[]> => {
    const res: AxiosResponse<GetDocumentResponse[]> = await api.get(`/document/vault/${userId}`, {
        params: {
            ...filters,
            destination
        },
    });
    return res.data;
}

export const likeDocumentApi = async (userId: number, documentId: number): Promise<void> => {
    await api.patch(`/document/likeDocument/${userId}/${documentId}`)
}

export const downloadDocument = async (documentId: number): Promise<void> => {
    await api.get(`/document/downloadDocument/${documentId}`)
}

export const getDownloadUrl = (userId: number, documentId: number): string => {
    const baseUrl = api.defaults.baseURL
    return `${baseUrl}/document/downloadDocument/${userId}/${documentId}`
}

export const sendInviteApi = async (groupId: number, inviterId: number, inviteeId: number): Promise<void> => {
    await api.post(`/study-group/invites/send/${groupId}/${inviterId}/${inviteeId}`);
}

export const getPendingInvitesApi = async (userId: number): Promise<PendingInvite[]> => {
    const res: AxiosResponse<PendingInvite[]> = await api.get(`/study-group/invites/pending/${userId}`);
    return res.data;
}

export const acceptInviteApi = async (inviteId: number): Promise<void> => {
    await api.patch(`/study-group/invites/accept/${inviteId}`);
}

export const rejectInviteApi = async (inviteId: number): Promise<void> => {
    await api.patch(`/study-group/invites/reject/${inviteId}`);
}

export const searchUsersApi = async (query: string, requestingUserId: number): Promise<UserSearchResult[]> => {
    const res: AxiosResponse<UserSearchResult[]> = await api.get(`/user/search`, {
        params: {query, requestingUserId}
    });
    return res.data;
}