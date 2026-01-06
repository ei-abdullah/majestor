import React from "react";
import {Tabs} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Feather} from "@expo/vector-icons";
import {Platform} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

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
                        height: 90,
                        backgroundColor: "white",
                        borderTopWidth: 1,
                        borderTopColor: "#E6EBF5",
                        paddingBottom: Platform.OS === "android" ? 20 : 10,
                        paddingTop: Platform.OS === "android" ? 20 : 10
                    }
                }}
            >
                <Tabs.Screen
                    name={"index"}
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({focused, color, size}) => (
                            focused ? (
                                <LinearGradient
                                    colors={["#3A6FF8", "#8DDDD3"]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 12,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Feather
                                        name={"home"}
                                        size={size}
                                        color={"white"}
                                    />
                                </LinearGradient>
                            ) : (
                                <Feather
                                    name={"home"}
                                    size={size}
                                    color={color}
                                />
                            )
                        )
                    }}
                />
                <Tabs.Screen
                    name={"document"}
                    options={{
                        title: "Document",
                        tabBarIcon: ({focused, color, size}) => (
                            focused ? (
                                <LinearGradient
                                    colors={["#3A6FF8", "#8DDDD3"]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 12,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Feather
                                        name={"file"}
                                        size={size}
                                        color={"white"}
                                    />
                                </LinearGradient>
                            ) : (
                                <Feather
                                    name={"file"}
                                    size={size}
                                    color={color}
                                />
                            )
                        )
                    }}
                />

                <Tabs.Screen
                    name={"user"}
                    options={{
                        title: "Settings",
                        tabBarIcon: ({focused, color, size}) => (
                            focused ? (
                                <LinearGradient
                                    colors={["#3A6FF8", "#8DDDD3"]}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 12,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Feather
                                        name={"user"}
                                        size={size}
                                        color={"white"}
                                    />
                                </LinearGradient>
                            ) : (
                                <Feather
                                    name={"user"}
                                    size={size}
                                    color={color}
                                />
                            )
                        )
                    }}
                />
            </Tabs>
        </React.Fragment>
    )
}