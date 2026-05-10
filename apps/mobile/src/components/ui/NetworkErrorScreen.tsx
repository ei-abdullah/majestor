import React from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {QueryClient} from "@tanstack/react-query";

import {useNetworkErrorStore} from "@/src/stores/networkErrorStore";

interface Props {
    queryClient: QueryClient;
}

export default function NetworkErrorScreen({queryClient}: Props) {
    const {hasNetworkError, setNetworkError} = useNetworkErrorStore();

    if (!hasNetworkError) return null;

    const handleRetry = async () => {
        setNetworkError(false);
        await queryClient.refetchQueries();
    };

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <LinearGradient
                colors={["#F5F7FF", "#EEF3FF"]}
                style={[StyleSheet.absoluteFillObject, styles.container]}
            >
                <View style={styles.iconContainer}>
                    <Feather name="wifi-off" size={38} color="#3A6FF8" opacity={0.5}/>
                </View>

                <Text style={styles.title}>Can't reach the server</Text>
                <Text style={styles.subtitle}>
                    Check your internet connection and try again.
                </Text>

                <Pressable
                    onPress={handleRetry}
                    style={styles.button}
                >
                    <LinearGradient
                        colors={["#3A6FF8", "#6FD0C5"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.buttonGradient}
                    >
                        <Feather name="refresh-cw" size={15} color="white"/>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </LinearGradient>
                </Pressable>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 36,
        zIndex: 9999,
    },
    iconContainer: {
        backgroundColor: '#EEF3FF',
        width: 88,
        height: 88,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#C7D7FD',
    },
    title: {
        color: '#1A2340',
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 22,
        letterSpacing: -0.5,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: '#5A6275',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 36,
    },
    button: {
        width: '100%',
    },
    buttonGradient: {
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 15,
    },
});