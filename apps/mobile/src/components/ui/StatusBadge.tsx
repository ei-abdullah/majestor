import React from "react";
import {View, Text} from "react-native";

type StatusType = "pending" | "accepted" | "rejected";

type Props = {
    status: StatusType;
    className?: string;
};

const statusConfig: Record<StatusType, {
    label: string;
    icon: string;
    bgColor: string;
    textColor: string;
}> = {
    pending: {
        label: "PENDING",
        icon: "⏳",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
    },
    accepted: {
        label: "ACCEPTED",
        icon: "✓",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
    },
    rejected: {
        label: "REJECTED",
        icon: "✗",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
    },
};

function StatusBadge({status, className = ""}: Props) {
    const config = statusConfig[status];

    return (
        <View
            className={`flex-row items-center justify-center py-3 px-4 rounded-xl ${config.bgColor} ${className}`}
        >
            <Text className={`text-lg ${config.textColor} mr-2`}>
                {config.icon}
            </Text>
            <Text className={`text-base font-sans-bold ${config.textColor}`}>
                {config.label}
            </Text>
        </View>
    );
}

export default StatusBadge;

