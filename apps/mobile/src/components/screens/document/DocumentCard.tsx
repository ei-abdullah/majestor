import React from "react";
import {View, Text, ImageBackground, TouchableOpacity, Alert} from "react-native";
import {Feather} from "@expo/vector-icons";
import {File, Directory, Paths} from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";

import {useAuthStore} from "@/src/stores/authStore";
import {useLikeDocument} from "@/src/queries/document.queries";
import {getDownloadUrl} from "@/src/services/document.api";

import Card from "@/src/components/Card";

function DocumentCard({document}: { document: any }) {
    const imageUri = document.imageUri;
    const {user} = useAuthStore();
    const {mutate: likeDocument, isPending: isDownloading} = useLikeDocument();

    const handleLike = async (userId: number, documentId: number) => {
        likeDocument({userId, documentId});
    }

    const handleDownload = async (document: any) => {
        // const url = `${process.env.NEXT_PUBLIC_API_URL}/document/downloadDocument/${documentId}`;
        //
        // const destination = new Directory(Paths.document, 'majestor-downloads');
        //
        // try {
        //     if (!destination.exists) destination.create();
        //
        //     const zipFileName = `majestor-${document.title}-${document.documentType}.zip`;
        //
        //     const zipFile = new File(destination, zipFileName)
        //
        //     const result = await File.downloadFileAsync(
        //         url,
        //         zipFile
        //     );
        //     console.log("ZIP file saved to: ", result.uri);
        //
        //     return result.uri;
        // } catch (error: any) {
        //     console.log("Download Failed", error.message);
        //     throw new Error(error.message);
        // }
        // try {
        //     const url = getDownloadUrl(documentId);
        //     console.log(url);
        //
        //     const destination = new Directory(Paths.cache, 'majestor-downloads')
        //     if (!destination.exists) destination.create();
        //
        //     const timestamp = Date.now();
        //     const fileName = `majestor-${document.title}-${timestamp}.zip`;
        //
        //     const output = await File.downloadFileAsync(url, destination, {
        //         headers: {
        //             'Accept': 'application/zip',
        //             // 'Authorization': `Bearer ${user?.accessToken}`
        //         }
        //     })
        //
        //     console.log(output.uri);
        // } catch (error: any) {
        //
        // }

        try {
            // Request permission
            const {status} = await MediaLibrary.requestPermissionsAsync();
            if(status !== 'granted') {
                Alert.alert('Permission required', 'Please allow access to save files');
                return;
            }

            const url = getDownloadUrl(document.id);
            const destination = new Directory(Paths.document, 'majestor-downloads');
            destination.create();

            const fileName = `${document.title} - ${document.documentType}.zip`;

            const output = await File.downloadFileAsync(url, destination);

            const asset = await MediaLibrary.createAssetAsync(output.uri);
            Alert.alert('File saved', `File saved to ${asset.uri}`);
        } catch (error: any) {
            console.error("Download Failed:", error);
            Alert.alert('Error', 'Download failed. Please try again.');
        }
    }

    return (
        <Card className={"mb-4 overflow-hidden py-6"}>
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
                        <View className={"flex-1 mr-4"}>
                            <Text className={"text-lg font-bold text-white mb-1"}>
                                {document.title}
                            </Text>
                            <Text className={"text-sm text-gray-200"}>
                                {document.documentType}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View className={"flex-row items-center"}>
                            <View className={"bg-white bg-opacity-20 px-3 py-1 rounded-full mr-2"}>
                                <TouchableOpacity
                                    disabled={isDownloading}
                                    onPress={() => handleDownload(document.id)}>

                                    <Feather name={"download"} size={16} color={'rgba(58,111,248,0.59)'}/>
                                </TouchableOpacity>
                            </View>
                            <View className={"bg-red-500 bg-opacity-80 px-3 py-1 rounded-full"}>
                                <TouchableOpacity>
                                    <Text className={"text-white text-sm"}>
                                        ❤️ {document.likesCount || 0}
                                    </Text>
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
    );
}

export default DocumentCard;