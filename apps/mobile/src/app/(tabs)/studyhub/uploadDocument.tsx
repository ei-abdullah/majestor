import UploadDocument from "@/src/components/screens/studyhub/UploadDocument";
import { useLocalSearchParams } from "expo-router";

export default function UploadDocumentScreen() {
    const params = useLocalSearchParams<{ 
        destination?: string, 
        courseId?: string, 
        studyGroupId?: string 
    }>();

    return <UploadDocument 
        initialDestination={params.destination}
        initialCourseId={params.courseId ? parseInt(params.courseId) : undefined}
        initialStudyGroupId={params.studyGroupId ? parseInt(params.studyGroupId) : undefined}
    />
}

