import {Text, Pressable, TouchableOpacity} from "react-native"
import {memo} from "react"

type Props = {
    label: string;
    active: boolean;
    disabled?: boolean;
    onPress: () => void;
}

const TabButton = memo(function TabButton({label, active, disabled, onPress}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={active ? "flex-1 py-3 rounded-xl items-center bg-white" : "flex-1 py-3 rounded-xl items-center bg-transparent"}
        >
            <Text
                className={active ? "font-sans-semibold text-mj-text-main" : "font-sans-medium text-mj-text-secondary"}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
})

export default TabButton;