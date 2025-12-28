import React, {useState} from 'react';
import {TextInput, View, Pressable} from 'react-native';
import {Feather} from "@expo/vector-icons";

type Props = {
    value: string;
    placeholder: string;
    icon?: keyof typeof Feather.glyphMap;
    className?: string;
    onChangeText: (text: string) => void;
    iconSize?: number;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
};

const StyledTextInput = (
    {
        value,
        placeholder,
        icon,
        className = "",
        onChangeText,
        iconSize = 18,
        secureTextEntry = false,
        keyboardType = "default"
    }: Props) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View
            className={[
                `flex-row items-center justify-center rounded-xl px-4 h-16 py-2 bg-white ${className}`,
                focused
                    ? "border border-gray-400 shadow-authCard"
                    : "border border-gray-50",
            ].join(" ")}
            style={{elevation: focused ? 4 : 1}}
        >
            {icon && (
                <Feather
                    name={icon}
                    size={iconSize}
                    color={focused ? "#4CB8AD" : "#9ca3af"}
                />
            )}

            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor="#9CA3AF"
                className={`${icon ? "ml-3" : ""} flex-1 justify-center items-center text-base text-gray-900`}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                secureTextEntry={secureTextEntry && !showPassword}
                keyboardType={keyboardType}
            />

            {secureTextEntry && (
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={iconSize}
                        color={focused ? "#4CB8AD" : "#9ca3af"}
                    />
                </Pressable>
            )}
        </View>
    );
};

export default StyledTextInput;
