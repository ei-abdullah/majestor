import React from "react";
import {View, Text} from "react-native";

type Props = {
    originalDistance: number;
    newDistance: number;
    unit?: "km" | "miles";
    className?: string;
};

function DeviationCard({
    originalDistance,
    newDistance,
    unit = "km",
    className = "",
}: Props) {
    const deviation = newDistance - originalDistance;

    return (
        <View className={`bg-white rounded-2xl p-5 border border-gray-100 ${className}`}>
            {/* Header */}
            <Text className="text-sm text-mj-text-secondary mb-3">
                Route Analysis
            </Text>

            {/* Distance Info - Minimal */}
            <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-mj-text-secondary">
                        Driver's route
                    </Text>
                    <Text className="text-sm font-sans-medium text-mj-text-main">
                        {originalDistance.toFixed(1)} {unit}
                    </Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-mj-text-secondary">
                        With your stops
                    </Text>
                    <Text className="text-sm font-sans-medium text-mj-text-main">
                        {newDistance.toFixed(1)} {unit}
                    </Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-100 my-1" />

                {/* Deviation Highlight */}
                <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-sans-medium text-mj-text-secondary">
                        Driver detours
                    </Text>
                    <Text className="text-base font-sans-bold text-mj-teal">
                        +{deviation.toFixed(1)} {unit}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default DeviationCard;

