import {PrimaryButton} from "@/src/components/PrimaryButton";
import {OutlineButton} from "@/src/components/OutlineButton";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
    return (
        <SafeAreaView className={"flex-1 justify-center flex-row gap-4 items-end p-4"}>
            <PrimaryButton title={"Primary"} />
            <OutlineButton title={"Found it?"}/>
        </SafeAreaView>
    );
}

