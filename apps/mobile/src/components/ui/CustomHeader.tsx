import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";
import {BlurView} from "expo-blur";

type Props = {
    title: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    leftIcon?: keyof typeof Feather.glyphMap;
    rightIcon?: keyof typeof Feather.glyphMap;
}

function CustomHeader(
    {
        title,
        onLeftPress,
        onRightPress,
        leftIcon,
        rightIcon
    }: Props
) {
    const insets = useSafeAreaInsets();

    return (
        <BlurView 
            intensity={80}
            style={{
                paddingTop: insets.top,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
        >
            <View className={"h-16 flex-row items-center justify-between px-4"}>
                {/* Left Action Area */}
                <View className={"w-1/5 items-start"}>
                    {
                        leftIcon && onLeftPress && (
                            <TouchableOpacity onPress={onLeftPress} className={"p-1"}>
                                <Feather name={leftIcon} size={22} color={"#333"}/>
                            </TouchableOpacity>
                        )
                    }
                </View>

                {/* Centered Title */}
                <View className={"w-3/5 items-center"}>
                    <Text className="text-base font-bold text-gray-800">{title}</Text>
                </View>

                {/* Right Action Area */}
                <View className={"w-1/5 items-end"}>
                    {rightIcon && onRightPress && (
                        <TouchableOpacity onPress={onRightPress} className="p-1">
                            <Feather name={rightIcon} size={22} color={"#333"}/>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </BlurView>
    )

}

export default CustomHeader;