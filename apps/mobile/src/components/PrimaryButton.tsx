import {Pressable, Text} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {cssInterop} from "nativewind";

type Props = {
    title: string;
    className?: string;
    onPress?: () => void;
    disabled?: boolean;
};

cssInterop(LinearGradient, {
    className: "style",
});

function PrimaryButton({title, className = "",  onPress, disabled = false}: Props) {
    return (
        <LinearGradient
            colors={["#3A6FF8", "#8DDDD3"]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-[11rem] rounded-xl overflow-hidden  ${className}`}
        >
            <Pressable
                onPress={onPress}
                className="flex justify-center items-center py-[1.1rem]"
                style={({pressed}) => ({
                    opacity: pressed ? 0.85 : 1,
                })}
                disabled={disabled}
            >
                <Text className="text-white font-semibold text-base text-center">
                    {title}
                </Text>
            </Pressable>
        </LinearGradient>
    );
}

export default PrimaryButton;