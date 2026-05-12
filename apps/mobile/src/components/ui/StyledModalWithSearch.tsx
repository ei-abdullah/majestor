import React, {useState, useMemo, useCallback} from "react";
import {
    Pressable,
    View,
    Text,
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
    size?: 'default' | 'compact';
};

// Memoized list item component for better performance
const ListItem = React.memo(({
    item,
    isSelected,
    onPress
}: {
    item: Option;
    isSelected: boolean;
    onPress: () => void;
}) => (
    <Pressable
        onPress={onPress}
        className="py-4 border-b border-gray-50 flex-row justify-between items-center"
    >
        <Text
            className={`text-base flex-1 ${isSelected ? "text-mj-primary font-sans-bold" : "text-gray-900"}`}>
            {item.name}
        </Text>
        {isSelected && (
            <Feather name="check-circle" size={20} color="#4CB8AD"/>
        )}
    </Pressable>
));

const StyledModalWithSearch = (
    {
        value,
        onChange,
        options,
        placeholder = "Select",
        icon,
        label,
        size = 'default'
    }: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [search, setSearch] = useState("");

    const selected = options.find((option) => option.id === value);
    const heightClass = size === 'compact' ? 'h-16' : 'h-[70px]';

    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(option =>
            option.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const handleSelect = useCallback((option: Option) => {
        onChange(option.id);
        setIsVisible(false);
        setSearch("");
    }, [onChange]);

    const renderItem = useCallback(({item}: {item: Option}) => {
        const isSelected = item.id === value;
        return (
            <ListItem
                item={item}
                isSelected={isSelected}
                onPress={() => handleSelect(item)}
            />
        );
    }, [value, handleSelect]);

    const keyExtractor = useCallback((item: Option) => item.id.toString(), []);

    const getItemLayout = useCallback((_data: ArrayLike<Option> | null | undefined, index: number) => ({
        length: 57, // Approximate height of each item (py-4 + border)
        offset: 57 * index,
        index,
    }), []);

    return (
        <View>
            {/* Trigger */}
            <Pressable
                onPress={() => setIsVisible(true)}
                className={[
                    `flex-row items-center rounded-xl px-6 ${heightClass} py-2 bg-white border border-gray-50`,
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
                <Text className={`ml-3 flex-1 text-sm ${selected ? "text-gray-900" : "text-gray-400"}`}>
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
                                <Text className="text-xl font-sans-bold text-gray-900">
                                    {label || placeholder}
                                </Text>
                                <Pressable
                                    onPress={() => setIsVisible(false)}
                                >
                                    <Feather name="x-circle" size={28} color="#9ca3af"/>
                                </Pressable>
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
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 24}}
                            keyboardShouldPersistTaps="handled"
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            updateCellsBatchingPeriod={50}
                            initialNumToRender={10}
                            windowSize={10}
                            getItemLayout={getItemLayout}
                            ListEmptyComponent={
                                <View className="mt-10 items-center">
                                    <Text className="text-gray-400">No results found</Text>
                                </View>
                            }
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

export default StyledModalWithSearch;
