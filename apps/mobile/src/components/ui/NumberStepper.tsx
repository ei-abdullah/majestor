import React from "react";
import {View, Text, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Card from "@/src/components/ui/Card";

type Props = {
    value: number;
    onValueChange: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    step?: number;
    label?: string;
    className?: string;
    disabled?: boolean;
};

function NumberStepper(
    {
        value,
        onValueChange,
        minValue = 1,
        maxValue = 4,
        step = 1,
        label,
        className = "",
        disabled = false,
    }: Props) {
    const handleDecrement = () => {
        if (value > minValue) {
            onValueChange(value - step);
        }
    };

    const handleIncrement = () => {
        if (value < maxValue) {
            onValueChange(value + step);
        }
    };

    const canDecrement = value > minValue && !disabled;
    const canIncrement = value < maxValue && !disabled;

    return (
        <Card className={"p-6"}>
            {label && (
                <Text className="text-base font-semibold">
                    {label}
                </Text>
            )}
            <View className={`${className} w-full items-center mt-6`}>
                <View className="flex-row items-center justify-between w-5/6 border border-gray-200 rounded-lg px-4 py-2">
                    {/* Decrement Button */}
                    <View>
                        <Pressable
                            onPress={handleDecrement}
                            disabled={!canDecrement}
                            style={({pressed}) => ({
                                opacity: pressed && canDecrement ? 0.7 : 1,
                            })}
                        >
                            <Ionicons
                                name="remove"
                                size={24}
                                color={canDecrement ? "#3A6FF8" : "#9CA3AF"}
                            />
                        </Pressable>
                    </View>

                    {/* Value Display */}
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-mj-text-main">
                            {value}
                        </Text>
                    </View>

                    {/* Increment Button */}
                    <View>
                        <Pressable
                            onPress={handleIncrement}
                            disabled={!canIncrement}
                            style={({pressed}) => ({
                                opacity: pressed && canIncrement ? 0.7 : 1,
                            })}
                        >
                            <Ionicons
                                name="add"
                                size={24}
                                color={canIncrement ? "#3A6FF8" : "#9CA3AF"}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Card>
    );
}

export default NumberStepper;

