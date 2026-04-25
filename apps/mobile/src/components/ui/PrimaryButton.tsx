import {Pressable, Text} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {cssInterop} from "nativewind";
import {Feather} from "@expo/vector-icons";

type Props = {
    title?: string;
    className?: string;
    icon?: keyof typeof Feather.glyphMap | null;
    iconSize?: number;
    onPress?: () => void;
    disabled?: boolean;
    size?: 'default' | 'compact';
};

cssInterop(LinearGradient, {
    className: "style",
});

function PrimaryButton(
    {
        title = "",
        className = "",
        icon = null,
        iconSize = 18,
        onPress,
        disabled = false,
        size = 'default'
    }: Props) {
    const heightClass = size === 'compact' ? 'h-16' : 'h-[70px]';

    return (
        <LinearGradient
            colors={disabled ? ["#9ca3af", "#d1d5db"] : ["#3A6FF8", "#8DDDD3"]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`flex items-center justify-center ${heightClass} py-2 rounded-xl overflow-hidden ${className}`}
        >
            <Pressable
                onPress={onPress}
                className="flex justify-center items-center"
                style={({pressed}) => ({
                    opacity: pressed ? 0.85 : 1,
                })}
                disabled={disabled}
            >
                {icon &&
                    <Feather name={icon} size={iconSize ? iconSize : 18} color={"#fff"}/>
                }
                {title !== "" &&
                    <Text className="text-white font-sans-semibold text-base text-center">
                        {title}
                    </Text>
                }
            </Pressable>
        </LinearGradient>
    );
}

export default PrimaryButton;
