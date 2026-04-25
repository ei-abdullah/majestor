import React from "react";
import {View, Text} from "react-native";

type Props = {
    message?: string;
    submessage?: string;
    className?: string;
};

function EmptyState({
    message = "No items found",
    submessage = "Check back later",
    className = "",
}: Props) {
    return (
        <View className={`flex-1 items-center justify-center py-12 px-6 ${className}`}>
            <Text className="text-base font-sans-semibold text-mj-text-main text-center mb-2">
                {message}
            </Text>
            <Text className="text-sm text-mj-text-secondary text-center">
                {submessage}
            </Text>
        </View>
    );
}

export default EmptyState;

