import React from "react";
import {View} from "react-native";

type Props = {
    className?: string;
    children: React.ReactNode;
}


export default function Card({className = "", children}: Props) {
    return <View className={`px-4 py-12 bg-mj-bg-white rounded-xl shadow-authcard ${className}`}>
        {children}
    </View>
}