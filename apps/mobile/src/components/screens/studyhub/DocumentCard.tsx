import React from "react";
import {View, Text, ImageBackground, TouchableOpacity, Pressable, Animated} from "react-native";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

import {useAuthStore} from "@/src/stores/authStore";
import {useLikeDocument} from "@/src/queries/studyhub.queries";
import {usePremiumModalStore} from "@/src/stores/premiumModalStore";

import useDownloadDocumentLegacy from "@/src/hooks/useDownloadDocumentLegacy";
import Card from "@/src/components/ui/Card";
import ImageModal from "@/src/components/ui/ImageModal";


function DocumentCard({document}: { document: any }) {
    const imageUri = document.imageUri;
    const {user} = useAuthStore();
    const openPremiumModal = usePremiumModalStore(state => state.open);
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
        await download(user!.id, document);
    }

    const handlePress = () => {
        if (isLocked) {
            openPremiumModal("This document is exclusive to Majestor Elite members.");
        } else {
            setShowImageModal(true);
        }
    };

    if (!document || !document.id) {
        return null;
    }

    // Check if user has an active elite subscription
    const isElite = user?.premiumUntil ? new Date(user.premiumUntil).getTime() > Date.now() : false;

    // A document is locked if it's premium-only AND the user is neither Elite nor Faculty
    // Defensive check for both 'isPremiumOnly' and 'premiumOnly' from Jackson serialization
    const isPremium = document.isPremiumOnly ?? (document as any).premiumOnly;
    const isLocked = isPremium && !isElite && !user?.isFaculty;

    return (
        <React.Fragment>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable 
                    onPress={handlePress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    className="mb-5"
                >
                    <Card className="py-0 px-0 overflow-hidden shadow-blue rounded-3xl border-0 bg-white">
                        <ImageBackground
                            source={imageUri ? {uri: imageUri} : require("@/assets/images/majestor-logo.png")}
                            style={{width: '100%', height: 160}}
                            imageStyle={{ borderRadius: 24 }}
                            blurRadius={isLocked ? 20 : 0}
                            resizeMode="cover"
                        >
                            <LinearGradient
                                colors={['rgba(18,24,38,0.1)', 'rgba(18,24,38,0.8)']}
                                style={{ flex: 1, padding: 16, borderRadius: 24, justifyContent: 'space-between' }}
                            >
                                {/* Top row - Name and DocType */}
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 mr-3">
                                        <Text 
                                            className="text-lg font-bold text-white leading-tight" 
                                            numberOfLines={2}
                                        >
                                            {document.title}
                                        </Text>
                                        <View className="bg-mj-teal/30 self-start px-2 py-0.5 rounded-md mt-2 border border-mj-teal/20">
                                            <Text className="text-[10px] text-mj-teal-50 font-black uppercase tracking-widest">
                                                {document.documentType.toLowerCase().replace("_", " ")}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Actions */}
                                    <View className="items-end gap-2">
                                        <TouchableOpacity 
                                            onPress={() => handleLike(user!.id, document.id)}
                                            className="bg-white/20 w-10 h-10 rounded-2xl items-center justify-center border border-white/20"
                                        >
                                            <View className="items-center">
                                                <Text className="text-white text-[10px]">❤️</Text>
                                                <Text className="text-white text-[9px] font-black">
                                                    {document.likesCount || 0}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        
                                        {isLocked ? (
                                            <TouchableOpacity
                                                onPress={() => openPremiumModal("Upgrade to Elite to download premium resources.")}
                                                className="bg-mj-yellow-500 w-10 h-10 rounded-2xl items-center justify-center shadow-sm"
                                            >
                                                <Feather name="lock" size={16} color="#121826" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                disabled={isDownloading}
                                                onPress={handleDownload}
                                                className="bg-mj-blue-600 w-10 h-10 rounded-2xl items-center justify-center shadow-blue"
                                            >
                                                <Feather 
                                                    name={isDownloading ? "loader" : "download"} 
                                                    size={16} 
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                {/* Bottom row - Metadata */}
                                <View className="flex-row justify-between items-end">
                                    <View className="flex-1">
                                        <Text className="text-white/70 text-[10px] font-bold uppercase tracking-tighter">
                                            {document.year} • {document.semesterType}
                                        </Text >
                                        <Text 
                                            className="text-white text-sm font-bold mt-0.5"
                                            numberOfLines={1}
                                        >
                                            {document.course}
                                        </Text>
                                    </View>
                                    
                                    {isLocked && (
                                        <View className="bg-mj-yellow-500 px-3 py-1.5 rounded-xl flex-row items-center">
                                            <Feather name="lock" size={12} color="#121826" />
                                            <Text className="text-mj-text-main text-[10px] font-black ml-1 uppercase">ELITE</Text>
                                        </View>
                                    )}
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
