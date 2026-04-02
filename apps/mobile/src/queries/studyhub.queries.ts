import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";

import {
    getGroupDetailsApi,
    getStudyHubFeedApi,
    joinStudyGroupApi,
    rateStudyGroupApi,
    createStudyGroupApi
} from "@/src/services/studyhub.api";
import Toast from "react-native-toast-message";
import {CreateStudyGroup, CreateStudyGroupResponse, DocumentDestination, Filters} from "@/src/types/studyHub";
import {getVaultDocumentApi, likeDocumentApi, uploadDocumentApi} from "@/src/services/studyhub.api";
import React from "react";

export const useStudyHubFeed = (userId: number) => {
    return useQuery({
        queryKey: ["studyhub", "feed", userId],
        queryFn: () => getStudyHubFeedApi(userId),
        enabled: !!userId
    });
};

export const useCreateStudyGroup = (onCallback?: (data: CreateStudyGroupResponse) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, payload}: { userId: number, payload: CreateStudyGroup }) => createStudyGroupApi(userId, payload),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ["studyhub"]});
            Toast.show({
                type: "success",
                text1: "Group Created!",
                text2: `Successfully started ${data.name}`
            });
            onCallback?.(data);
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Creation Failed",
                text2: error?.response?.data?.message || "Check your tier limits.",
                position: "top"
            });
        }
    });
};

export const useGroupDetails = (groupId: number, userId: number) => {
    return useQuery({
        queryKey: ["studyhub", "group", groupId],
        queryFn: () => getGroupDetailsApi(groupId, userId),
        enabled: !!groupId && !!userId
    });
};

export const useJoinGroup = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({groupId, userId}: { groupId: number, userId: number }) => joinStudyGroupApi(groupId, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["studyhub"]});
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to Join Group",
                position: "top",
                visibilityTime: 4000,
            });
        }
    });
};

export const useRateGroup = (onCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({groupId, userId}: { groupId: number, userId: number }) => rateStudyGroupApi(groupId, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["studyhub"]});
            onCallback?.()
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: "error",
                text1: "Failed to rate group",
                position: "top",
                visibilityTime: 4000
            })
        }
    });
};


export const useVault = (userId: number, destination: DocumentDestination, filters: Filters) => {
    const query = useQuery({
        queryKey: ["document", userId, destination, filters],
        queryFn: () => getVaultDocumentApi(userId, destination, filters),
        enabled: !!userId,
    });

    // Show toast on error
    React.useEffect(() => {
        if (query.error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Load Documents'
            });
        }
    }, [query.error]);

    return query;
}

export const useUploadDocument = (onCallback?: () => void) => {
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
            onCallback?.();
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: error?.response?.data?.message || error?.message || 'There was an error uploading your document',
                position: 'top',
                visibilityTime: 4000,
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
            await queryClient.invalidateQueries({queryKey: ["document"]});
        },
        onError: (error: any) => {
            Sentry.captureException(error);
            Toast.show({
                type: 'error',
                text1: 'Like Failed',
                text2: error?.response?.data?.message || error?.message || 'There was an error liking the document',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    })
}