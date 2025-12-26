import React, { useState, useMemo } from "react";
import {
    Pressable,
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {Feather} from "@expo/vector-icons";
import StyledTextInput from "@/src/components/StyledTextInput";


type option = {
    id: string | number;
    name: string;
}

type props = {
    value?: string | number;
    onChange: (value: string | number) => void;
    options: option[];
    placeholder?: string;
    icon?: keyof typeof Feather.glyphMap;
    label?: string;
}

const StyledAuthModal = (
    {
        value,
        onChange,
        options,
        placeholder = "Select",
        icon,
        label
    }
    : props) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const selected = options.find((option) => option.id === value)

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const handleSelect = (option: option) => {
        onChange(option.id);
        setIsVisible(false);
        setSearchQuery("");
    };

    return (
        <View>
            {/* The "Input" field appearance */}
            <Pressable
                onPress={() => setIsVisible(true)}
                className={[
                    "flex-row items-center rounded-xl px-6 py-[1.4rem] bg-white border border-gray-50",
                    isVisible ? "border-mj-primary shadow-authCard" : ""
                ].join(" ")}
                style={{ elevation: 1 }}
            >
                {icon && (
                    <Feather
                        name={icon}
                        size={18}
                        color={selected ? "#4CB8AD" : "#9ca3af"}
                    />
                )}
                <Text
                    className={[
                        "ml-3 flex-1 text-base",
                        selected ? "text-gray-900" : "text-gray-400",
                    ].join(" ")}
                >
                    {selected?.name ?? placeholder}
                </Text>
                <Feather name="chevron-down" size={18} color="#9ca3af" />
            </Pressable>

            {/* Search Modal - Pop-up Style */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-center items-center bg-black/50 px-6"
                >
                    <View className="bg-white w-full h-[70%] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <View className="px-6 py-4 border-b border-gray-100 bg-white">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-xl font-bold text-gray-900">{label || placeholder}</Text>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <Feather name="x-circle" size={28} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>

                            <StyledTextInput
                                placeholder="Search..."
                                value={searchQuery}
                                icon="search"
                                onChangeText={(text) => setSearchQuery(text)}
                            />
                        </View>

                        {/* List of results */}
                        <FlatList
                            data={filteredOptions}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <View className="mt-10 items-center">
                                    <Text className="text-gray-400">No results found</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    className="py-4 border-b border-gray-50 flex-row justify-between items-center"
                                >
                                    <Text className={`text-base flex-1 ${item.id === value ? "text-mj-primary font-bold" : "text-gray-900"}`}>
                                        {item.name}
                                    </Text>
                                    {item.id === value && (
                                        <Feather name="check-circle" size={20} color="#4CB8AD" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

export default StyledAuthModal;