import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {getAllDocumentsApi, likeDocumentApi, Filters, downloadDocument} from "@/src/services/document.api";

export const useDocument = (userId: string, filters: Filters) => {
    return useQuery({
        queryKey: ["document"],
        queryFn: () => getAllDocumentsApi(userId, filters),
        enabled: Boolean(userId),
    })
}

export const useLikeDocument = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["document"],
        mutationFn: ({userId, documentId} : {userId: number, documentId: number}) => likeDocumentApi(userId, documentId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["document"]})
        }
    })
}