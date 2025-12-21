import React from "react";
import {View, Text, TouchableOpacity, Touchable} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather} from "@expo/vector-icons";

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
        <View
            style={{paddingTop: insets.top}}
            className={"h-24 flex-row items-center justify-between bg-gray-50 border-b border-gray-200 px-4"}
        >

            {/* Left Action Area */}
            <View className={"w-1/5 items-start"}>
                {
                    leftIcon && onLeftPress && (
                        <TouchableOpacity onPress={onLeftPress} className={"p-2"}>
                            <Feather name={leftIcon} size={26} color={"#333"}/>
                        </TouchableOpacity>
                    )
                }
            </View>

            {/* Centered Title */}
            <View className={"w-3/5 items-center"}>
                <Text className="text-lg font-bold text-gray-800">{title}</Text>
            </View>

            {/* Right Action Area */}
            <View className={"w-1/5 items-end"}>
                {rightIcon && onRightPress && (
                    <TouchableOpacity onPress={onRightPress} className="p-2">
                        <Feather name={rightIcon} size={26} color={"#333"}/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )

}

export default CustomHeader;