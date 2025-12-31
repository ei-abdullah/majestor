import React, {useState, useRef} from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Pressable,
    Text,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import {cssInterop} from 'nativewind';
import PrimaryButton from './PrimaryButton';

type Props = {
    images: string[];
    onImagesChange: (images: string[]) => void;
    className?: string;
    height?: number;
    showAddButton?: boolean;
};

cssInterop(LinearGradient, {
    className: "style",
});

const {width: screenWidth} = Dimensions.get('window');

const ImageCarousel = ({images, onImagesChange, className = "", height = 300, showAddButton = true}: Props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleImageUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            onImagesChange([...images, ...newImages]);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (screenWidth - 48));
        setActiveIndex(index);
    };

    if (images.length === 0) return null;

    return (
        <View className={`relative ${className}`}>
            {/* Carousel Container */}
            <View className="relative overflow-hidden rounded-2xl">

                {/* ScrollView */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={screenWidth - 48}
                    snapToAlignment="center"
                    contentContainerStyle={{
                        paddingHorizontal: 0,
                    }}
                >
                    {images.map((uri, index) => (
                        <View
                            key={index}
                            style={{
                                width: screenWidth - 48,
                                height: height,
                            }}
                            className="justify-center items-center bg-gray-100 rounded-2xl overflow-hidden"
                        >
                            <Image
                                source={{uri}}
                                style={{
                                    width: screenWidth - 48,
                                    height: height,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Pagination Dots */}
            {images.length > 1 && (
                <View className="flex-row justify-center items-center mt-4 gap-2">
                    {images.map((_, index) => (
                        <Pressable
                            key={index}
                            onPress={() => {
                                scrollViewRef.current?.scrollTo({
                                    x: index * (screenWidth - 48),
                                    animated: true,
                                });
                            }}
                        >
                            <View
                                className={`rounded-full transition-all ${
                                    index === activeIndex
                                        ? 'bg-mj-blue w-8 h-2'
                                        : 'bg-gray-300 w-2 h-2'
                                }`}
                            />
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <View className="absolute bottom-3 left-3 bg-black/60 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-semibold">
                        {activeIndex + 1} / {images.length}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default ImageCarousel;

