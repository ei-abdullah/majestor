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
    disabled?: boolean;
    size?: 'default' | 'compact';
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
        keyboardType = "default",
        disabled = false,
        size = 'default'
    }: Props) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // For disabled fields, use min-height with more space to prevent clipping
    const heightClass = disabled
        ? (size === 'compact' ? 'min-h-[72px]' : 'min-h-[80px]')
        : (size === 'compact' ? 'h-16' : 'h-[70px]');

    return (
        <View
            className={[
                `flex-row rounded-xl px-4 ${heightClass} ${className}`,
                disabled
                    ? "border-0 bg-transparent py-2"
                    : "border border-gray-50 bg-white py-2 items-center",
                focused && !disabled && "border-gray-400 shadow-authCard",
            ].join(" ")}
            style={{elevation: disabled ? 0 : focused ? 4 : 1}}
        >
            {icon && (
                <View className="self-center">
                    <Feather
                        name={icon}
                        size={iconSize}
                        color={focused && !disabled ? "#4CB8AD" : "#9ca3af"}
                    />
                </View>
            )}

            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor="#9CA3AF"
                className={`${icon ? "ml-3" : ""} flex-1 ${disabled ? 'text-gray-600' : 'text-gray-900'} ${size === 'compact' ? 'text-sm' : 'text-base'}`}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                secureTextEntry={secureTextEntry && !showPassword}
                keyboardType={keyboardType}
                editable={!disabled}
                multiline={disabled}
                numberOfLines={disabled ? undefined : 1}
                textAlignVertical="center"
                style={disabled ? {paddingTop: 0, paddingBottom: 0} : undefined}
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
