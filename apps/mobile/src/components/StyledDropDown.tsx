import React, {useState} from "react";
import {Pressable, View, Text, TouchableOpacity, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Option = {
    id: string | number;
    name: string;
};

type Props = {
    value?: string | number;
    onChange: (value: string | number) => void;
    options: Option[];
    placeholder?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
};

const StyledDropDown = (
    {
        value,
        onChange,
        options,
        placeholder = "Select",
        icon,
        iconSize
    }: Props
) => {
    const [open, setOpen] = useState(false);

    const selected = options.find((o) => o.id === value);

    return (
        <View className="relative" style={{zIndex: open ? 100 : 1}}>
            {/* Styled container - Identical to StyledTextInput */}
            <View
                className={[
                    "flex-row items-center rounded-xl px-4 py-[1.4rem] bg-white",
                    open
                        ? "border border-gray-400 shadow-authCard"
                        : "border border-gray-50",
                ].join(" ")}
                style={{elevation: open ? 4 : 1}}
            >
                {/* Icon logic matches StyledTextInput */}
                {icon && (
                    <Ionicons
                        name={icon}
                        size={iconSize ? iconSize : 18}
                        color={open ? "#9ca3af" : "#4CB8AD"}
                    />
                )}

                {/* Clickable area */}
                <Pressable
                    onPress={() => setOpen((v) => !v)}
                    className="flex-row items-center flex-1"
                >
                    <Text
                        className={[
                            "ml-3 flex-1 text-base",
                            selected ? "text-gray-900" : "text-gray-400",
                        ].join(" ")}
                    >
                        {selected?.name ?? placeholder}
                    </Text>

                    <Ionicons
                        name={open ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#9ca3af"
                    />
                </Pressable>
            </View>

            {/* Dropdown list */}
            {open && (
                    <ScrollView
                        alwaysBounceVertical={false}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        bounces={false}
                        style={{elevation: 10, maxHeight: 200}}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-authCard overflow-hidden"
                    >
                        {options.map((option) => {
                            const active = option.id === value;

                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => {
                                        onChange(option.id);
                                        setOpen(false);
                                    }}
                                    className={`px-4 py-3 ${active ? "bg-gray-50" : "bg-white"}`}
                                >
                                    <Text
                                        className={[
                                            "text-base",
                                            active ? "text-gray-900 font-semibold" : "text-gray-900",
                                        ].join(" ")}
                                    >
                                        {option.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
            )}
        </View>
    );
};

export default StyledDropDown;