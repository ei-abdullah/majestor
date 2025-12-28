import React from "react";
import {View, Text, ImageBackground, TouchableOpacity, Pressable} from "react-native";
import {Feather} from "@expo/vector-icons";

import {useAuthStore} from "@/src/stores/authStore";
import {useLikeDocument} from "@/src/queries/document.queries";

import useDownloadDocumentLegacy from "@/src/hooks/useDownloadDocumentLegacy";
import Card from "@/src/components/ui/Card";
import ImageModal from "@/src/components/ui/ImageModal";


function DocumentCard({document}: { document: any }) {
    const imageUri = document.imageUri;
    const {user} = useAuthStore();
    const {
        mutate: likeDocument,
        isPending: isDownloading
    } = useLikeDocument();

    const [showImageModal, setShowImageModal] = React.useState(false);

    const handleLike = async (userId: number, documentId: number) => {
        likeDocument({userId, documentId});
    }

    const handleDownload = async (document: any) => {
        await useDownloadDocumentLegacy({document});
    }

    if (document.id === null || document.id === undefined) {
        return null;
    }

    return (
        <React.Fragment>
            <Pressable onPress={() => setShowImageModal(true)}>
                <Card className={"mb-4 py-6"}>
                    <ImageBackground
                        source={{uri: imageUri}}
                        style={{width: '100%', height: 120}}
                        blurRadius={8}
                        resizeMode="cover"
                    >
                        <View style={{
                            backgroundColor: 'rgba(58,111,248,0.59)',
                            flex: 1,
                            padding: 16,
                            justifyContent: 'space-between'
                        }}>
                            {/* Top row - Name and DocType */}
                            <View className={"flex-row justify-between items-start"}>
                                <View className={"flex-1"}>
                                    <Text className={"text-lg font-bold text-white mb-1"}>
                                        {document.title}
                                    </Text>
                                    <Text className={"text-sm text-gray-200 font-semibold"}>
                                        {document.documentType.toLowerCase().replace("_", " ")}
                                    </Text>
                                </View>

                                {/* Actions */}
                                <View className={"flex-col items-center gap-1"}>

                                    <View className={"bg-red-500 bg-opacity-80 px-3 py-1 rounded-full mr-2"}>
                                        <TouchableOpacity onPress={() => handleLike(user!.id, document.id)}>
                                            <Text className={"text-white text-sm"}>
                                                ❤️ {document.likesCount || 0}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className={"bg-white bg-opacity-20 px-5 py-1 rounded-full mr-2"}>
                                        <TouchableOpacity
                                            disabled={isDownloading}
                                            onPress={() => handleDownload(document)}>
                                            <Feather name={"download"} size={16} color={'rgba(58,111,248,0.59)'}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Bottom row - Year, Course, SemType */}
                            <View className={"flex-row"}>
                                <Text className={"text-white text-sm font-medium"}>
                                    {document.year} • {document.semesterType}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </Card>
            </Pressable>

            <ImageModal
                visible={showImageModal}
                imageUri={document.imageUri}
                onClose={() => setShowImageModal(false)}
            />
        </React.Fragment>
    );
}

export default DocumentCard;