import React from "react";
import {Tabs} from "expo-router";
import {StatusBar} from "expo-status-bar";
import CustomTabBar from "@/src/components/ui/CustomTabBar";

export default function TabsLayout() {
    return (
        <React.Fragment>
            <StatusBar style={"dark"}/>
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name={"index"}
                    options={{
                        title: "Home",
                        headerShown: false,
                    }}
                />

                <Tabs.Screen
                    name={"carpool"}
                    options={{
                        title: "Carpool",
                        popToTopOnBlur: false,
                        freezeOnBlur: true
                    }}
                />

                <Tabs.Screen
                    name={"studyhub"}
                    options={{
                        title: "Study Hub"
                    }}
                />

                <Tabs.Screen
                    name={"user"}
                    options={{
                        title: "Settings"
                    }}
                />
            </Tabs>
        </React.Fragment>
    )
}