import React from "react";
import {Image} from "expo-image";
import {View, ScrollView, RefreshControl} from "react-native";

type ErrorNotLoadProps = {
    onRefetch?: () => void;
    isRefreshing?: boolean;
};

const ErrorNotLoad = ({onRefetch, isRefreshing = false}: ErrorNotLoadProps) => {
    return (
        <ScrollView
            contentContainerStyle={{flex: 1}}
            refreshControl={
                onRefetch ? (
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefetch}
                        tintColor="#3A6FF8"
                        colors={["#3A6FF8"]}
                        progressBackgroundColor="#fff"
                    />
                ) : undefined
            }
        >
            <View className={"flex-1 justify-center items-center w-full"}>
                <Image
                    source={require("@/assets/illustrations/cancel.svg")}
                    style={{width: 200, height: 200}}
                />
            </View>
        </ScrollView>
    )
};


export default ErrorNotLoad;