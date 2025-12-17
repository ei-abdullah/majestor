import {Text, Pressable, TouchableOpacity} from "react-native"
import {memo} from "react"

type Props = {
    label: string;
    active: boolean;
    onPress: () => void;
}

export const TabButton = memo(function TabButton({label, active, onPress}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={active ? "flex-1 py-3 rounded-xl items-center bg-white" : "flex-1 py-3 rounded-xl items-center bg-transparent"}
        >
            <Text
                className={active ? "font-semibold text-mj-text-main" : "font-medium text-mj-text-secondary"}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
})
