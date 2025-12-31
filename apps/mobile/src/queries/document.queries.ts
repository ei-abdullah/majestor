import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {
    getAllDocumentsApi,
    likeDocumentApi,
    Filters,
    downloadDocument,
    uploadDocumentApi
} from "@/src/services/document.api";

export const useDocument = (userId: number, filters: Filters) => {
    return useQuery({
        queryKey: ["document", userId, filters],
        queryFn: () => getAllDocumentsApi(userId, filters),
        enabled: Boolean(userId),
    })
}

export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["document"],
        mutationFn: ({userId, formData}: {
            userId: number,
            formData: FormData
        }) => uploadDocumentApi(userId, formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["document"]})
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