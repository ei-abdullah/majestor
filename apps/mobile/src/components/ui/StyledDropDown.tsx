import React, {useCallback, useRef, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    Pressable,
} from "react-native";
import {Feather} from "@expo/vector-icons";

export type Option = {
    id: string | number;
    name: string;
};

type Props = {
    value?: string | number;
    onChange: (value: string | number) => void;
    options: Option[];
    className?: string;
    placeholder?: string;
    icon?: keyof typeof Feather.glyphMap;
    iconSize?: number;
};

const StyledDropDown = (
    {
        value,
        onChange,
        options,
        className = "",
        placeholder = "",
        icon,
        iconSize = 16
    }: Props
) => {
    const [open, setOpen] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const buttonRef = useRef<View>(null);

    // Derive selectedOption from value prop
    const selectedOption = value
        ? options.find(opt => opt.id === value) || null
        : null;

    const toggleOpen = useCallback(() => {
        if (!open && buttonRef.current) {
            buttonRef.current.measureInWindow((x, y, width, height) => {
                setDropdownLayout({
                    top: y + height + 8, // 8px gap (mt-2)
                    left: x,
                    width: width,
                });
                setOpen(true);
            });
        } else {
            setOpen(false);
        }
    }, [open]);

    const onSelect = useCallback((option: Option) => {
        onChange(option.id);
        setOpen(false);
    }, [onChange]);

    return (
        <View
            ref={buttonRef}
            className={className}
        >
            {/* Styled container - Identical to StyledTextInput */}
            <Pressable
                onPress={toggleOpen}
            >
                <View
                    className={[
                        "flex-row items-center justify-center rounded-xl px-4 h-16 bg-white",
                        open
                            ? "border border-gray-400 shadow-authCard"
                            : "border border-gray-50",
                    ].join(" ")}
                    style={{elevation: open ? 4 : 1}}
                >
                    {/* Show icon only when no option is selected */}
                    {icon && !selectedOption && (
                        <Feather
                            name={icon}
                            size={iconSize}
                            color={open ? "#9ca3af" : "#4CB8AD"}
                        />
                    )}

                    <Text
                        className={[
                            selectedOption ? "text-sm" : "ml-3 text-sm",
                            "flex-1",
                            selectedOption ? "text-gray-900" : "text-gray-400",
                        ].join(" ")}
                    >
                        {selectedOption?.name ?? placeholder}
                    </Text>

                    <Feather
                        name={open ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#9ca3af"
                    />
                </View>
            </Pressable>

            {/* Dropdown Modal */}
            {open && (
                <Modal visible={open} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                        <View className="flex-1">
                            <View
                                className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-authCard"
                                style={{
                                    position: 'absolute',
                                    top: dropdownLayout.top,
                                    left: dropdownLayout.left,
                                    width: dropdownLayout.width,
                                    maxHeight: 250,
                                    elevation: 10,
                                }}
                            >
                                <FlatList
                                    data={options}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                    renderItem={({item: option}) => {
                                        const active = option.id === selectedOption?.id;

                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => onSelect(option)}
                                                className={`px-2 py-3 rounded-lg ${active ? "bg-gray-50" : "bg-white"}`}
                                            >
                                                <Text
                                                    className={[
                                                        "text-sm text-center",
                                                        active ? "text-gray-900 font-semibold" : "text-gray-900",
                                                    ].join(" ")}
                                                >
                                                    {option.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    ItemSeparatorComponent={() => (
                                        <View className="h-1"/>
                                    )}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

export default StyledDropDown;

