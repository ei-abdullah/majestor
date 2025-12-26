import {useAuthStore} from "@/src/stores/authStore";
import GradientView from "@/src/components/GradientView";
import {SafeAreaView} from "react-native-safe-area-context";
import {Pressable, Text} from "react-native";

function Home() {
    const {user, clearSession} = useAuthStore();

    return (
        <GradientView>
            <SafeAreaView className="flex-1 px-6 pt-8 justify-start">
                <Text>{user?.username}</Text>
                <Pressable onPress={clearSession}>
                    <Text>Logout</Text>
                </Pressable>
            </SafeAreaView>
        </GradientView>
    );
}

export default Home;