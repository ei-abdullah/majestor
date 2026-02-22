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
    imageUri: string
}

export interface Document {
    id: number,
    title: string,
    documentType: string
}