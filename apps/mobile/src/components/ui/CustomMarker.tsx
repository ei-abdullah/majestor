import {Text, View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";


function CustomMarker({color, icon, label}: { color: string, icon: string, label?: string}) {
    return (
        <View style={styles.markerContainer}>
            <View style={[styles.markerContent, {backgroundColor: color}]}>
                <Ionicons name={icon as any} size={20} color="white"/>
                {label && (
                    <Text style={styles.markerLabel}>{label}</Text>
                )}
            </View>
            <View style={[styles.markerArrow, {borderTopColor: color}]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
    },
    markerContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerLabel: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        marginTop: -2,
    },
});

export default CustomMarker;