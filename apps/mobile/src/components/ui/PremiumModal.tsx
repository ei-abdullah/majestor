import React from 'react';
import {Modal, View, Text, Pressable} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {usePremiumModalStore} from '@/src/stores/premiumModalStore';
import Card from './Card';
import {LinearGradient} from 'expo-linear-gradient';

const PremiumModal = () => {
    const {isVisible, message, close} = usePremiumModalStore();

    const handleUpgrade = async () => {
        close();
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center px-6"
                  style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
                <Card className="w-full overflow-hidden border-2 border-mj-yellow">
                    <LinearGradient colors={['#FBCB43', '#FDD76A']} className="py-6 items-center">
                        <View className="bg-white/30 p-4 rounded-full">
                            <Feather name="award" size={40} color="#7D5C13"/>
                        </View>
                        <Text className="text-2xl font-sans-extrabold text-mj-yellow-900 mt-2 tracking-tighter">
                            MAJESTOR ELITE
                        </Text>
                    </LinearGradient>

                    <View className="p-8 items-center">
                        <Text className="text-center text-mj-text-main text-lg font-sans-bold mb-4 leading-6">
                            {message}
                        </Text>

                        <Text className="text-center text-mj-text-secondary text-sm mb-8 leading-5">
                            Join the Elite tier to unlock unlimited study groups, increased storage, and premium
                            resources.
                        </Text>

                        <Pressable
                            className="w-full bg-mj-blue-600 py-4 rounded-2xl items-center shadow-blue mb-3"
                            onPress={handleUpgrade}
                        >
                            <Text className="text-white font-sans-extrabold text-base uppercase">Upgrade Now</Text>
                        </Pressable>

                        <Pressable
                            onPress={close}
                            className="py-2"
                        >
                            <Text className="text-mj-text-muted font-sans-bold text-xs uppercase tracking-widest">Maybe
                                Later</Text>
                        </Pressable>
                    </View>
                </Card>
            </View>
        </Modal>
    );
};

export default PremiumModal;