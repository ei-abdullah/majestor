import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import {
    getAllDocumentsApi,
    likeDocumentApi,
    Filters,
    uploadDocumentApi
} from "@/src/services/document.api";

export const useDocument = (userId: number, filters: Filters) => {
    return useQuery({
        queryKey: ["document", userId, filters],
        queryFn: () => getAllDocumentsApi(userId, filters),
        enabled: Boolean(userId),
    })
}

export const useUploadDocument = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["document"],
        mutationFn: ({userId, formData}: {
            userId: number,
            formData: FormData
        }) => uploadDocumentApi(userId, formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["document"]});
            Toast.show({
                type: 'success',
                text1: 'Upload Successful',
            });
            onSuccessCallback?.();
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: error?.response?.data?.message || error?.message || 'There was an error uploading your document',
            });
        }
    })
}

export const useLikeDocument = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["document"],
        mutationFn: ({userId, documentId}: {
            userId: number,
            documentId: number
        }) => likeDocumentApi(userId, documentId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["document"]})
        }
    })
}