import {Pressable, Text} from "react-native";

type ButtonVariant = "outline" | "destructive" | "secondary";

type Props = {
    title: string;
    variant?: ButtonVariant;
    className?: string;
    onPress?: () => void;
    disabled?: boolean;
};

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
    outline: {
        container: "bg-white border-gray-300 border-2",
        text: "text-mj-teal-400",
    },
    destructive: {
        container: "bg-red-50",
        text: "text-red-600",
    },
    secondary: {
        container: "bg-gray-100 border-gray-300 border-2",
        text: "text-gray-700",
    },
};

function OutlineButton(
    {
        title,
        variant = "outline",
        className = "",
        onPress,
        disabled = false
    }: Props) {
    const styles = variantStyles[variant];

    return (
        <Pressable
            onPress={onPress}
            className={`rounded-xl py-5 ${styles.container} ${disabled ? "opacity-50" : ""} ${className}`}
            style={({pressed}) => ({
                opacity: pressed && !disabled ? 0.85 : 1,
            })}
            disabled={disabled}
        >
            <Text className={`text-base font-semibold text-center ${styles.text}`}>
                {title}
            </Text>
        </Pressable>
    );
}

export default OutlineButton;
