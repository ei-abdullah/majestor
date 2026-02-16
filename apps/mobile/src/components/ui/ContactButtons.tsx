import React from "react";
import {View, Text, Pressable, Linking, Alert} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    phoneNumber: string;
    className?: string;
};

function ContactButtons({phoneNumber, className = ""}: Props) {
    const handleCall = () => {
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.canOpenURL(phoneUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(phoneUrl);
                } else {
                    Alert.alert("Error", "Unable to make phone calls on this device");
                }
            })
            .catch((err) => console.error("Error opening phone:", err));
    };

    const handleWhatsApp = () => {
        // Remove all non-numeric characters and add country code if needed
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        const whatsappUrl = `whatsapp://send?phone=${cleanNumber}`;

        Linking.canOpenURL(whatsappUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(whatsappUrl);
                } else {
                    Alert.alert(
                        "WhatsApp Not Installed",
                        "Please install WhatsApp to use this feature"
                    );
                }
            })
            .catch((err) => console.error("Error opening WhatsApp:", err));
    };

    return (
        <View className={`flex-row gap-3 ${className}`}>
            {/* Call Button */}
            <Pressable
                onPress={handleCall}
                className="flex-1 flex-row items-center justify-center bg-mj-blue py-4 px-4 rounded-xl"
                style={({pressed}) => ({
                    opacity: pressed ? 0.85 : 1,
                })}
            >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                    CALL
                </Text>
            </Pressable>

            {/* WhatsApp Button */}
            <Pressable
                onPress={handleWhatsApp}
                className="flex-1 flex-row items-center justify-center bg-[#25D366] py-4 px-4 rounded-xl"
                style={({pressed}) => ({
                    opacity: pressed ? 0.85 : 1,
                })}
            >
                <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                    WHATSAPP
                </Text>
            </Pressable>
        </View>
    );
}

export default ContactButtons;

