import React from "react";
import {Image} from "expo-image";

import GradientView from "@/src/components/GradientView";
import {Pressable} from "react-native";
import Card from "@/src/components/Card";


const ErrorNotLoad = () => {
    return (
        <React.Fragment>
            <GradientView className={"flex-1 justify-center items-center w-full"}>
                <Card className={"w-10/12 justify-center items-center bg-red-50 border border-red-200 mb-4 p-2"}>
                    <Image
                        source={require("@/assets/illustrations/cancel.svg")}
                        style={{width: 200, height: 200, marginVertical: 20}}
                    />
                </Card>
            </GradientView>
        </React.Fragment>
    )
};


export default ErrorNotLoad;