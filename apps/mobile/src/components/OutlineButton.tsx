import {Pressable, Text} from "react-native";


type Props = {
    title: string;
    onPress?: () => void;
};


export function OutlineButton({title, onPress}: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-xl w-[9.999rem] py-[1rem] border-gray-300 border-2"
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
