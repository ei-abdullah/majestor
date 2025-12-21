import React from "react";
import {Tabs} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Feather} from "@expo/vector-icons";
import {Platform} from "react-native";

export default function TabsLayout() {
    return (
        <React.Fragment>
            <StatusBar style={"dark"}/>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#3A6FF8",
                    tabBarShowLabel: false,
                    popToTopOnBlur: true,
                    headerShown: false,
                    tabBarStyle: {
                        height: 80,
                        backgroundColor: "white",
                        borderTopWidth: 1,
                        borderTopColor: "#E6EBF5",
                        paddingBottom: Platform.OS === "android" ? 20 : 0,
                        paddingTop: Platform.OS === "android" ? 20 : 0
                    }
                }}
            >
                <Tabs.Screen
                    name={"index"}
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({focused, color, size}) => (
                            <Feather
                                name={"home"}
                                size={size}
                                color={color}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name={"document"}
                    options={{
                        title: "Document",
                        tabBarIcon: ({focused, color, size}) => (
                            <Feather
                                name={"file"}
                                size={size}
                                color={color}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name={"user"}
                    options={{
                        title: "Settings",
                        tabBarIcon: ({focused, color, size}) => (
                            <Feather
                                name={"user"}
                                size={size}
                                color={color}
                            />
                        )
                    }}
                />
            </Tabs>
        </React.Fragment>
    )
}