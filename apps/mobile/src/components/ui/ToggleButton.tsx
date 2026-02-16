import React from "react";
import {View, Text, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Card from "./Card";

type ToggleOption<T> = {
    value: T;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
};

type Props<T> = {
    options: ToggleOption<T>[];
    selectedValue: T;
    onSelect: (value: T) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
};

function ToggleButton<T extends string | number>({
    options,
    selectedValue,
    onSelect,
    label,
    className = "",
    disabled = false,
}: Props<T>) {
    return (
        <Card className="px-4">
            <View className={`${className} w-full`}>
                {/* Label - Match NumberStepper style */}
                {label && (
                    <Text className="text-base font-semibold text-mj-text-main">
                        {label}
                    </Text>
                )}

                {/* Toggle Container */}
                <View className="flex-row items-stretch mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    {options.map((option, index) => {
                        const isSelected = option.value === selectedValue;
                        const isLast = index === options.length - 1;

                        return (
                            <React.Fragment key={String(option.value)}>
                                {/* Option Button */}
                                <Pressable
                                    onPress={() => !disabled && onSelect(option.value)}
                                    className={`flex-1 items-center justify-center py-4 ${
                                        disabled ? "opacity-50" : ""
                                    }`}
                                    style={({pressed}) => ({
                                        opacity: pressed && !disabled ? 0.7 : 1,
                                    })}
                                    disabled={disabled}
                                >
                                    {/* Icon */}
                                    {option.icon && (
                                        <Ionicons
                                            name={option.icon}
                                            size={32}
                                            color={isSelected ? "#3A6FF8" : "#9CA3AF"}
                                            style={{marginBottom: 6}}
                                        />
                                    )}
                                </Pressable>

                                {/* Vertical Divider */}
                                {!isLast && (
                                    <View className="w-px bg-gray-200" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </View>
            </View>
        </Card>
    );
}

export default ToggleButton;

