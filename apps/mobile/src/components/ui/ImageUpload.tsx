import React from 'react';
import {View, Pressable} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {cssInterop} from 'nativewind';

type Props = {
    onImagesChange: (images: string[]) => void;
    className?: string;
    disabled?: boolean;
};

cssInterop(LinearGradient, {
    className: "style",
});

const ImageUpload = ({onImagesChange, className = "", disabled = false}: Props) => {
    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            onImagesChange(newImages);
        }
    };

    return (
        <Pressable
            onPress={handleImageUpload}
            disabled={disabled}
            className={`${className}`}
            style={({pressed}) => ({
                opacity: pressed && !disabled ? 0.85 : 1,
            })}
        >
            <View
                className={`
                    flex items-center justify-center 
                    bg-gradient-to-br from-blue-50 to-teal-50
                    rounded-2xl 
                    border-2 border-dashed border-mj-teal
                    py-12 px-6
                    ${disabled ? 'opacity-50' : ''}
                `}
                style={{
                    backgroundColor: '#F0F7FF',
                }}
            >
                {/* Icon with a gradient background */}
                <View >
                    <LinearGradient
                        colors={['#3A6FF8', '#8DDDD3']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        className="rounded-full p-4"
                        style={{
                            shadowColor: '#3A6FF8',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <Feather
                            name="image"
                            size={30}
                            color="#FFFFFF"
                        />
                    </LinearGradient>
                </View>
            </View>
        </Pressable>
    );
};

export default ImageUpload;
