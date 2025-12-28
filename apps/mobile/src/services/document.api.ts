import api from "@/src/services/index";
import axios, {AxiosResponse} from "axios";

export type Filters = {
    courseTitle?: string;
    year?: string;
    docType?: string;
    sortByLikes?: string;
}

export type GetDocumentResponse = {
    id: number;
    title: string;
    year: number;
    documentType: string;
    semesterType: string;
    course: string;
    likesCount: number;
    imageUri: string;
}

export const getAllDocumentsApi = async (
    userId: number,
    filters: Filters
): Promise<GetDocumentResponse[]> => {
    const res: AxiosResponse<GetDocumentResponse[]> = await api.get(`/document/getAllDocuments/${userId}`, {
        params: filters,
    });

    return res.data;
}

export const likeDocumentApi = async (userId: number, documentId: number): Promise<void> =>
    api.patch(`/document/likeDocument/${userId}/${documentId}`, {
        userId,
        documentId
    })

export const downloadDocument = async (documentId: number): Promise<void> =>
    api.get(`/document/downloadDocument/${documentId}`)

export const getDownloadUrl = (documentId: number): string => {
    const baseUrl = api.defaults.baseURL || process.env.EXPO_PUBLIC_API_URL;
    return `${baseUrl}/document/downloadDocument/${documentId}`
}