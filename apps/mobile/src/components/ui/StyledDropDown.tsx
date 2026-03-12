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

// Generic type for dropdown options
type DropdownOption<T = any> = T & {
    [key: string]: any;
};

type Props<T = any> = {
    value?: string | number;
    onChange: (value: string | number, item?: T) => void;
    options: T[];
    className?: string;
    placeholder?: string;
    icon?: keyof typeof Feather.glyphMap;
    iconSize?: number;
    // Field configuration for custom data structures
    labelField?: string; // Field to display as label (default: 'name')
    valueField?: string; // Field to use as value (default: 'id')
    disabled?: boolean;
    size?: 'default' | 'compact';
};

const StyledDropDown = <T extends Record<string, any>>(
    {
        value,
        onChange,
        options,
        className = "",
        placeholder = "Select...",
        icon,
        iconSize = 16,
        labelField = 'name',
        valueField = 'id',
        disabled = false,
        size = 'default'
    }: Props<T>
) => {
    const [open, setOpen] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const buttonRef = useRef<View>(null);

    // Derive selectedOption from value prop using configurable fields
    const selectedOption = value
        ? options.find((opt) => opt[valueField] === value) || null
        : null;

    const toggleOpen = useCallback(() => {
        if (disabled) return;

        if (!open && buttonRef.current) {
            buttonRef.current.measureInWindow((x, y, width, height) => {
                setDropdownLayout({
                    top: y + height + 4,
                    left: x,
                    width: width,
                });
                setOpen(true);
            });
        } else {
            setOpen(false);
        }
    }, [open, disabled]);

    const onSelect = useCallback((option: T) => {
        onChange(option[valueField], option);
        setOpen(false);
    }, [onChange, valueField]);

    const heightClass = size === 'compact' ? 'h-16' : 'h-[70px]';

    return (
        <View
            ref={buttonRef}
            className={className}
        >
            {/* Styled container - Identical to StyledTextInput */}
            <Pressable
                onPress={toggleOpen}
                disabled={disabled}
            >
                <View
                    className={[
                        `flex-row items-center justify-center rounded-xl px-4 ${heightClass} bg-white`,
                        open
                            ? "border border-gray-400 shadow-authCard"
                            : "border border-gray-50",
                        disabled ? "opacity-50" : "",
                    ].join(" ")}
                    style={{elevation: open ? 4 : 1}}
                >
                    {/* Show icon always */}
                    {icon && (
                        <Feather
                            name={icon}
                            size={iconSize}
                            color={open ? "#9ca3af" : "#4CB8AD"}
                        />
                    )}

                    <Text
                        className={[
                            selectedOption ? "text-sm" : "ml-3 text-sm",
                            "flex-1 ml-3",
                            selectedOption ? "text-gray-900" : "text-gray-400",
                        ].join(" ")}
                    >
                        {selectedOption ? selectedOption[labelField] : placeholder}
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
                                    maxHeight: 180,
                                    elevation: 10,
                                }}
                            >
                                <FlatList
                                    data={options}
                                    keyExtractor={(item) => item[valueField]?.toString() || Math.random().toString()}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                    renderItem={({item: option}) => {
                                        const active = option[valueField] === selectedOption?.[valueField];

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
                                                    {option[labelField]}
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
