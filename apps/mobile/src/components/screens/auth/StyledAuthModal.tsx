import React, {useState, useMemo} from "react";
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
import StyledTextInput from "@/src/components/ui/StyledTextInput";

type Option = {
    id: string | number;
    name: string;
};

type Props = {
    value?: string | number;
    onChange: (value: string | number) => void;
    options: Option[];
    placeholder?: string;
    icon?: keyof typeof Feather.glyphMap;
    label?: string;
};

const StyledAuthModal = (
    {
        value,
        onChange,
        options,
        placeholder = "Select",
        icon,
        label
    }: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [search, setSearch] = useState("");

    const selected = options.find((option) => option.id === value);

    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(option =>
            option.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const handleSelect = (option: Option) => {
        onChange(option.id);
        setIsVisible(false);
        setSearch("");
    };

    return (
        <View>
            {/* Trigger */}
            <Pressable
                onPress={() => setIsVisible(true)}
                className={[
                    "flex-row items-center rounded-xl px-6 h-16 py-2 bg-white border border-gray-50",
                    isVisible ? "border-mj-primary shadow-authCard" : ""
                ].join(" ")}
                style={{elevation: 1}}
            >
                {icon && (
                    <Feather
                        name={icon}
                        size={18}
                        color={selected ? "#4CB8AD" : "#9ca3af"}
                    />
                )}
                <Text className={`ml-3 flex-1 text-base ${selected ? "text-gray-900" : "text-gray-400"}`}>
                    {selected?.name ?? placeholder}
                </Text>
                <Feather name="chevron-down" size={18} color="#9ca3af"/>
            </Pressable>

            {/* Modal */}
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
                                <Text className="text-xl font-bold text-gray-900">
                                    {label || placeholder}
                                </Text>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <Feather name="x-circle" size={28} color="#9ca3af"/>
                                </TouchableOpacity>
                            </View>

                            <StyledTextInput
                                placeholder="Search..."
                                value={search}
                                icon="search"
                                onChangeText={setSearch}
                            />
                        </View>

                        {/* List */}
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 24}}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <View className="mt-10 items-center">
                                    <Text className="text-gray-400">No results found</Text>
                                </View>
                            }
                            renderItem={({item}) => {
                                const isSelected = item.id === value;
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item)}
                                        className="py-4 border-b border-gray-50 flex-row justify-between items-center"
                                    >
                                        <Text
                                            className={`text-base flex-1 ${isSelected ? "text-mj-primary font-bold" : "text-gray-900"}`}>
                                            {item.name}
                                        </Text>
                                        {isSelected && (
                                            <Feather name="check-circle" size={20} color="#4CB8AD"/>
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

export default StyledAuthModal;
