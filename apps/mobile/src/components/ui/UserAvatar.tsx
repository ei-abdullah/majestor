import React, {useState, useEffect} from "react";
import {View, Text, Pressable, Image, Alert} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';

type Props = {
    avatarUrl: string | null;
    username: string;
    onAvatarUpdate: (formData: FormData) => void;
    size?: number;
    showCamera?: boolean;
    editable?: boolean;
};

const UserAvatar = ({
    avatarUrl,
    username,
    onAvatarUpdate,
    size = 128,
    showCamera = true,
    editable = true
}: Props) => {
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [imageLoadError, setImageLoadError] = useState(false);

    // Update avatarUri when avatarUrl prop changes
    useEffect(() => {
        if (avatarUrl) {
            setAvatarUri(avatarUrl);
            setImageLoadError(false);
        }
    }, [avatarUrl]);

    // Get user initials
    const getInitials = () => {
        if (!username) return "U";
        const names = username.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return username.substring(0, 2).toUpperCase();
    };

    const handleAvatarUpload = async () => {
        if (!editable) return;

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setAvatarUri(imageUri);

            try {
                // Create FormData with proper file structure
                const formData = new FormData();

                // Get file extension from URI or default to jpg
                const uriParts = imageUri.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('profileImage', {
                    uri: imageUri,
                    name: `profile_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`
                } as any);

                onAvatarUpdate(formData);
            } catch (error) {
                console.error('Error preparing upload:', error);
                Alert.alert('Error', 'Failed to prepare image for upload');
                setAvatarUri(avatarUrl);
            }
        }
    };


    return (
        <Pressable
            onPress={handleAvatarUpload}
            className="relative"
            disabled={!editable}
        >
            {avatarUri && !imageLoadError ? (
                <View
                    className="rounded-full overflow-hidden border-4 border-white shadow-lg"
                    style={{width: size, height: size}}
                >
                    <Image
                        source={{uri: avatarUri}}
                        style={{width: '100%', height: '100%'}}
                        onError={() => setImageLoadError(true)}
                    />
                </View>
            ) : (
                <LinearGradient
                    colors={['#5B9FED', '#8DDDD3']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    className="rounded-full items-center justify-center border-4 border-white shadow-lg"
                    style={{width: size, height: size}}
                >
                    <Text
                        className="text-white font-bold"
                        style={{fontSize: size / 3.2}}
                    >
                        {getInitials()}
                    </Text>
                </LinearGradient>
            )}

            {/* Camera Icon */}
            {showCamera && editable && (
                <View
                    className="absolute bottom-0 right-0 bg-mj-blue rounded-full border-3 border-white"
                    style={{padding: size / 12.8}}
                >
                    <AntDesign name="camera" size={size / 7.1} color="white"/>
                </View>
            )}
        </Pressable>
    );
};

export default UserAvatar;

