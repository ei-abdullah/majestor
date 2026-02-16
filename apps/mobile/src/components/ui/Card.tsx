import React from "react";
import {View} from "react-native";

type Props = {
    className?: string;
    children: React.ReactNode;
}


function Card({className = "", children}: Props) {
    return <View className={`py-10 bg-mj-bg-white rounded-xl ${className}`}>
        {children}
    </View>
}

export default Card;