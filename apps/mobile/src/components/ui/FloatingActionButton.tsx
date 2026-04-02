import {Pressable, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {cssInterop} from "nativewind";
import {Feather} from "@expo/vector-icons";
import {router, Href, useRouter} from "expo-router";

type Props = {
    href: Href<string | object>;
    icon: keyof typeof Feather.glyphMap;
    iconSize?: number;
    className?: string;
};

cssInterop(LinearGradient, {
    className: "style",
});

function FloatingActionButton(
    {
        href,
        icon,
        iconSize = 24,
        className = ""
    }: Props) {
    
    const router = useRouter();

    const handlePress = () => {
        router.push(href as any);
    };

    return (
        <Pressable
            onPress={handlePress}
            className={`rounded-full shadow-blue ${className}`}
            style={({pressed}) => ({
                opacity: pressed ? 0.85 : 1,
            })}
        >
            <LinearGradient
                colors={["#3A6FF8", "#8DDDD3"]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                className="w-16 h-16 rounded-full flex-row items-center justify-center"
            >
                <View className="flex-row items-center justify-center">
                    <Feather name="plus" size={14} color="#fff" style={{marginRight: -2}} />
                    <Feather name={icon} size={22} color="#fff"/>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

export default FloatingActionButton;

