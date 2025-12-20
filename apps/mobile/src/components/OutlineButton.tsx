import {Pressable, Text} from "react-native";


type Props = {
    title: string;
    className?: string;
    onPress?: () => void;
};


function OutlineButton(
    {
        title,
        className = "",
        onPress
    }: Props
) {
    return (
        <Pressable
            onPress={onPress}
            className={`bg-white rounded-xl w-[10.999rem] py-[1rem] border-gray-300 border-2 ${className}`}
            style={({pressed}) => ({
                opacity: pressed ? 0.85 : 1,
            })}
        >
            <Text className="text-base font-semibold text-center text-mj-teal-400">
                {title}
            </Text>
        </Pressable>
    );
}

export default OutlineButton;