import React from "react";
import {View} from "react-native";

type Props = {
    className?: string;
    children: React.ReactNode;
}


function Card({className = "", children}: Props) {
    return <View className={`mx-2 py-12 bg-mj-bg-white rounded-xl shadow ${className}`}>
        {children}
    </View>
}

export default Card;