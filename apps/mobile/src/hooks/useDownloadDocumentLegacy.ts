import {useState, useCallback} from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import {getDownloadUrl} from "@/src/services/document.api";
import {Alert, Platform} from "react-native";
import {shareAsync} from "expo-sharing";
import {Document} from "@/src/types/document";

interface DownloadState {
    isDownloading: boolean,
    error: string | null,
    progress: number
}

const save = async (uri: string, filename: string, mimetype: string) => {
    if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
            const base64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64});
            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, base64, {encoding: FileSystem.EncodingType.Base64});
                })
        } else {
            await shareAsync(uri);
        }
    } else {
        await shareAsync(uri);
    }
};

function useDownloadDocumentLegacy() {
    const [state, setState] = useState<DownloadState>({
        isDownloading: false,
        error: null,
        progress: 0,
    });

    const download = useCallback(async (document: Document) => {
        setState({isDownloading: true, error: null, progress: 0});

        try {
            // Get download endpoint
            const downloadUrl = getDownloadUrl(document.id);

            // Create a unique filename with a timestamp to avoid conflicts
            const timestamp = Date.now();
            const sanitizedTitle = document.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
            const fileName = `${sanitizedTitle}-${document.documentType}-${timestamp}.zip`;

            // Majestor named folder
            const folderName = "majestor";
            const folderUri = FileSystem.documentDirectory + folderName + "/";

            // Ensure the folder exists
            const folderInfo = await FileSystem.getInfoAsync(folderUri);
            if (!folderInfo.exists) {
                await FileSystem.makeDirectoryAsync(folderUri, {intermediates: true});
            }

            // Update the file path
            const filePath = folderUri + fileName;

            // Download the file with progress callback
            const downloadResumable = FileSystem.createDownloadResumable(
                downloadUrl,
                filePath,
                {},
                (downloadProgress) => {
                    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                    setState(prev => ({...prev, progress}));
                }
            );

            const result = await downloadResumable.downloadAsync();

            if (result) {
                // Save a file to a device or share
                await save(result.uri, fileName, result.headers["Content-Type"]);
                setState({isDownloading: false, error: null, progress: 1});
            } else {
                const errorMessage = "Download failed - no result returned";
                setState({isDownloading: false, error: errorMessage, progress: 0});
                Alert.alert("Download Error", errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || "An error occurred while downloading the document.";
            setState({isDownloading: false, error: errorMessage, progress: 0});
            Alert.alert("Download Error", errorMessage);
        }
    }, []);

    const reset = useCallback(() => {
        setState({isDownloading: false, error: null, progress: 0});
    }, []);

    return {
        download,
        reset,
        isDownloading: state.isDownloading,
        error: state.error,
        progress: state.progress,
    };
}

export default useDownloadDocumentLegacy;