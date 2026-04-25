import React from "react"
import {Text} from "react-native";

const ErrorText = ({ message }: { message: string }) => {
    return <Text className={"text-mj-error text-xs font-sans-semibold"}>
        {message}
    </Text>
}

export default ErrorText