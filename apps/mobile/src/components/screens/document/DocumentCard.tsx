import React from "react";
import {View, Text, ImageBackground, TouchableOpacity, Pressable, Animated} from "react-native";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

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
    } = useLikeDocument();

    const {download, isDownloading} = useDownloadDocumentLegacy();

    const [showImageModal, setShowImageModal] = React.useState(false);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 20
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20
        }).start();
    };

    const handleLike = async (userId: number, documentId: number) => {
        likeDocument({userId, documentId});
    }

    const handleDownload = async () => {
        await download(document);
    }

    if (document.id === null || document.id === undefined) {
        return null;
    }

    return (
        <React.Fragment>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable 
                    onPress={() => setShowImageModal(true)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    className="mb-4"
                >
                    <Card className="py-0 px-0 overflow-hidden elevation-3 border border-white/10">
                        <ImageBackground
                            source={{uri: imageUri}}
                            style={{width: '100%', height: 150}}
                            imageStyle={{ borderRadius: 16 }}
                            blurRadius={10}
                            resizeMode="cover"
                        >
                            <LinearGradient
                                colors={['rgba(58,111,248,0.3)', 'rgba(58,111,248,0.7)']}
                                style={{ flex: 1, padding: 14, borderRadius: 16, justifyContent: 'space-between' }}
                            >
                                {/* Top row - Name and DocType */}
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 mr-3">
                                        <Text 
                                            className="text-lg font-bold text-white leading-tight" 
                                            numberOfLines={2}
                                            style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                                        >
                                            {document.title}
                                        </Text>
                                        <View className="bg-white/20 self-start px-2 py-0.5 rounded-md mt-1 border border-white/20">
                                            <Text className="text-[10px] text-white font-bold uppercase tracking-wider">
                                                {document.documentType.toLowerCase().replace("_", " ")}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Actions */}
                                    <View className="items-end gap-2">
                                        <TouchableOpacity 
                                            onPress={() => handleLike(user!.id, document.id)}
                                            className="bg-red-500/80 w-10 h-10 rounded-full flex-row items-center justify-center border border-white/10 shadow-sm"
                                        >
                                            <View className="items-center">
                                                <Text className="text-white text-[10px]">❤️</Text>
                                                <Text className="text-white text-[9px] font-bold -mt-0.5">
                                                    {document.likesCount || 0}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            disabled={isDownloading}
                                            onPress={handleDownload}
                                            className="bg-white/25 w-10 h-10 rounded-full items-center justify-center border border-white/20 shadow-sm"
                                        >
                                            <Feather 
                                                name={isDownloading ? "loader" : "download"} 
                                                size={16} 
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Bottom row - Metadata */}
                                <View className="flex-row justify-between items-end">
                                    <View className="flex-1">
                                        <Text className="text-white/90 text-xs font-semibold">
                                            {document.year} • {document.semesterType}
                                        </Text >
                                        <Text 
                                            className="text-white text-[13px] font-bold mt-0.5"
                                            numberOfLines={1}
                                        >
                                            {document.course}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </Card>
                </Pressable>
            </Animated.View>

            <ImageModal
                visible={showImageModal}
                imageUri={document.imageUri}
                onClose={() => setShowImageModal(false)}
            />
        </React.Fragment>
    );
}

export default DocumentCard;