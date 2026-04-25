import React from "react";
import {View, Text, TouchableOpacity,} from "react-native";
import {ErrorBoundaryProps} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import * as Sentry from "@sentry/react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function ErrorBoundary({error, retry}: ErrorBoundaryProps) {
    React.useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#F5F7FF'}}>
            <LinearGradient
                colors={["#F5F7FF", "#EEF3FF"]}
                style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32}}
            >
                <View style={{
                    backgroundColor: '#FFEBEE',
                    width: 80,
                    height: 80,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                }}>
                    <Feather name="alert-triangle" size={36} color="#C62828"/>
                </View>

                <Text style={{color: '#1A2340', fontFamily: 'Inter_800ExtraBold', fontSize: 24, letterSpacing: -0.5, marginBottom: 10, textAlign: 'center'}}>
                    Something went wrong
                </Text>
                <Text style={{color: '#5A6275', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 32}}>
                    An unexpected error occurred. Our team has been notified. Please try again.
                </Text>

                {__DEV__ && (
                    <View style={{
                        backgroundColor: '#FFF8E1',
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 32,
                        width: '100%',
                        borderWidth: 1,
                        borderColor: '#FFE082',
                    }}>
                        <Text style={{color: '#C6941F', fontFamily: 'Inter_700Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6}}>
                            Error (dev only)
                        </Text>
                        <Text style={{color: '#5A6275', fontSize: 12, lineHeight: 18, fontFamily: 'monospace'}} numberOfLines={6}>
                            {error.message}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={retry}
                    activeOpacity={0.85}
                    style={{width: '100%'}}
                >
                    <LinearGradient
                        colors={["#3A6FF8", "#6FD0C5"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={{borderRadius: 20, paddingVertical: 16, alignItems: 'center'}}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                            <Feather name="refresh-cw" size={16} color="white"/>
                            <Text style={{color: 'white', fontFamily: 'Inter_800ExtraBold', fontSize: 15}}>
                                Try Again
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
}