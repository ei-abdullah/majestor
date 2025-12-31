import {Pressable} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {cssInterop} from "nativewind";
import {Feather} from "@expo/vector-icons";
import {Link, Href} from "expo-router";

type Props = {
    href: Href;
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
    return (
        <Link href={href} asChild>
            <Pressable
                className={`absolute bottom-8 rounded-full shadow-lg ${className}`}
                style={({pressed}) => ({
                    opacity: pressed ? 0.85 : 1,
                })}
            >
                <LinearGradient
                    colors={["#3A6FF8", "#8DDDD3"]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                >
                    <Feather name={icon} size={iconSize} color="#fff"/>
                </LinearGradient>
            </Pressable>
        </Link>
    );
}

export default FloatingActionButton;

