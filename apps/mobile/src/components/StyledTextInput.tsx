import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";


type props = {
    value: any;
    placeholder: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onChangeText: (text: string) => void;
    iconSize?: number;
}

const StyledTextInput = ({value, placeholder, icon, onChangeText, iconSize}: props) => {
    const [focused, setFocused] = useState(false);


    return (
        <View
            className={[
                "flex-row items-center rounded-xl px-4 py-[0.6rem] bg-white",
                focused
                    ? "border border-gray-400 shadow-authCard"
                    : "border border-gray-50",
            ].join(" ")}
            style={{elevation: focused ? 4 : 1}}
        >
            <Ionicons name={icon} size={iconSize ? iconSize : 18} color={
                focused ? " #9ca3af" : "#4CB8AD"
            }/>

            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor="#9CA3AF"
                className="ml-3 flex-1 text-base text-gray-900 "
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </View>
    );
};

export default StyledTextInput;