import {Pressable, Text} from "react-native";

type ButtonVariant = "outline" | "destructive" | "secondary";

type Props = {
    title: string;
    variant?: ButtonVariant;
    className?: string;
    onPress?: () => void;
    disabled?: boolean;
    size?: 'default' | 'compact';
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
        container: "bg-white",
        text: "text-mj-blue",
    },
};

function OutlineButton(
    {
        title,
        variant = "outline",
        className = "",
        onPress,
        disabled = false,
        size = 'default'
    }: Props) {
    const styles = variantStyles[variant];
    const heightClass = size === 'compact' ? 'h-16' : 'h-[70px]';

    return (
        <Pressable
            onPress={onPress}
            className={`rounded-xl ${heightClass} justify-center ${styles.container} ${disabled ? "opacity-50" : ""} ${className}`}
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
