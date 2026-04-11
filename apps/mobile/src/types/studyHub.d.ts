export type DocumentDestination = 'PERSONAL_VAULT' | 'PUBLIC_VAULT' | 'STUDY_GROUP';

export interface Filters {
    searchQuery?: string,
    year?: string,
    docType?: string,
    sortByLikes?: string
}

export interface GetDocumentResponse {
    id: number,
    title: string,
    year: number,
    documentType: string,
    semesterType: string,
    course: string,
    likesCount: number,
    imageUri: string,
    isPremiumOnly: boolean
}

export interface Document {
    id: number,
    title: string,
    documentType: string
}

export interface StudyHubBase {
    id: number;
    name: string;
    hostName: string;
    courseName: string;
    memberCount: number;
}

export interface JoinedGroup extends StudyHubBase {}
export interface OfficialGroup extends StudyHubBase {}
export interface TrendingGroup extends StudyHubBase {
    popularityScore: number;
}

export interface FeedResponse {
    joinedGroups: JoinedGroup[];
    officialGroups: OfficialGroup[];
    trendingGroups: TrendingGroup[];
}

export interface CreateStudyGroup {
    name: string;
    courseId: number;

}

export interface CreateStudyGroupResponse {
    id: number;
    name: string;
    courseName: string;
    hostName: string;
    isOfficial: boolean;
    createdAt: string;
}

export interface StudyGroupDocuments {
    id: number;
    title: string;
    year: number;
    documentType: string;
    semesterType: string;
    course: string;
    imageUri: string;
    likesCount: number;
    isPremiumOnly: boolean;
}

export interface GetGroupDetails {
    id: number;
    name: string;
    hostName: string;
    courseId: number;
    courseName: string;
    memberCount: number;
    isCurrentUserMember: boolean;
    popularityScore: number,
    isPreview: boolean;
    isOfficial: boolean;
    documents: StudyGroupDocuments[];
}

export interface JoinStudyGroupResponse {
    id: number;
}