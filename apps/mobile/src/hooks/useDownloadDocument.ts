import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing"
import * as Sentry from "@sentry/react-native";

import {getDownloadUrl} from "@/src/services/studyhub.api";
import {Alert} from "react-native";

async function useDownloadDocument({userId, document}: { userId: number, document: any }) {
    try {
        const downloadUrl: string = getDownloadUrl(userId, document.id);

        // Let the user pick a directory
        // const userDir = await FileSystem.Directory.pickDirectoryAsync();
        // if (!userDir) return;

        const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache, 'majestor-downloads');
        if (!cacheDir.exists) {
            cacheDir.create();
        }

        // Create a unique filename with a timestamp to avoid conflicts
        const timestamp = Date.now();
        const sanitizedTitle = document.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
        const fileName = `${sanitizedTitle}-${document.documentType}-${timestamp}.zip`;

        // Properly construct a file using File constructor with directory object and filename
        // const destinationFile = new FileSystem.File(userDir.uri + '/' + 'majestor' + '/' + fileName);
        const destinationFile = new FileSystem.File(cacheDir, fileName);

        // // Check if a file exists and delete if it does (make it async)
        // const fileInfo = destinationFile.info();
        // if(destinationFile.exists) {
        //     destinationFile.delete();
        // }

        // Download the file
        const result = await FileSystem.File.downloadFileAsync(downloadUrl, destinationFile);

        // 🎉 NEW: Immediately share so user can save anywhere they want
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(result.uri, {
                mimeType: "application/zip",
                dialogTitle: "Save Document to Your Device",
                UTI: "public.zip-archive" // 📱 Better iOS support
            });

            Alert.alert(
                'Success! 🎉',
                'File downloaded! Use the share dialog to save it to your preferred location.',
            );
        } else {
            Alert.alert('Success', `File downloaded to app cache: ${fileName}`);
        }
    } catch (error: any) {
        Sentry.captureException(error);
        Alert.alert('Error', 'Download failed. Please try again.');
    }
}

export default useDownloadDocument;