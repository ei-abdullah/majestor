import * as FileSystem from 'expo-file-system/legacy';
import {getDownloadUrl} from "@/src/services/document.api";
import {Alert, Platform} from "react-native";
import {shareAsync} from "expo-sharing";

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

async function useDownloadDocumentLegacy({document}: { document: any }) {

    try {
        // Get download endpoint
        const downloadUrl = getDownloadUrl(document!.id);

        // Create unique filename with timestamp to avoid conflicts
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

        // Unique localhosts for Android and iOS
        // const localhost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";

        // Download the file
        const result = await FileSystem.downloadAsync(
            downloadUrl,
            filePath,
            {
                headers: {
                    // Add any required headers here
                }
            }
        )

        // Save a file to a device or share
        await save(result.uri, fileName, result.headers["Content-Type"]);
    } catch (error: any) {
        Alert.alert("Download Error", error.message || "An error occurred while downloading the document.");
    }
}

export default useDownloadDocumentLegacy;