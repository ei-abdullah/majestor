import React from "react";
import {
    View,
    Modal,
    TouchableOpacity,
    Image,
    Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
    visible: boolean;
    imageUri: string;
    onClose: () => void;
};

const ImageModal = ({ visible, imageUri, onClose }: Props) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable
                onPress={onClose}
                className="flex-1 justify-center items-center bg-black/90 px-4"
            >
                <View className="w-full h-[80%]">
                    {/* Image */}
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full rounded-xl"
                        resizeMode="contain"
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

export default ImageModal;
