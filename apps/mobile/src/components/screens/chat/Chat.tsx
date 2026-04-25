import {View, Text, ActivityIndicator, Pressable, KeyboardAvoidingView, Platform} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {useCallback, useEffect, useState} from "react";
import {GiftedChat, IMessage, Bubble, Send, InputToolbar, Time} from "react-native-gifted-chat";
import {Ionicons} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";
import {stompService} from "@/src/services/stompService";

function Chat() {
    const router = useRouter();
    const headerHeight = useHeaderHeight();

    const {receiverEmail, receiverUsername} = useLocalSearchParams<{
        receiverEmail: string,
        receiverUsername: string
    }>();
    const {user} = useAuthStore();

    const [messages, setMessages] = useState<IMessage[]>([]);
    // const [connected, setConnected] = useState<boolean>(false);
    const connected = stompService.status === "CONNECTED";

    useEffect(() => {
        if (!user) return;

        // 1. Ensure the service is trying to connect
        stompService.connect();

        // 2. Define the private subscription path
        const subscriptionPath = `/private/${user.email}`;

        // 3. Use the service to subscribe
        const subscription = stompService.subscribe(subscriptionPath, (message) => {
            if (message.body) {
                try {
                    const body = JSON.parse(message.body);

                    // Only show messages from the person we are chatting with
                    if (body.senderName === receiverEmail) {
                        const newMessage: IMessage = {
                            _id: Math.random().toString(),
                            text: body.message,
                            createdAt: new Date(body.date),
                            user: {
                                _id: body.senderName,
                                name: body.senderName,
                            },
                        };
                        setMessages(previous => GiftedChat.append(previous, [newMessage]));
                    }
                } catch (error) {
                    Sentry.captureException(error);
                }
            }
        });

        // 4. Return a cleanup function to unsubscribe when the screen closes
        return () => {
            stompService.unsubscribe(subscriptionPath);
        };
    }, [user, receiverEmail]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (!user) {
            Sentry.captureMessage("Chat: Cannot send message, user is not available");
            return;
        }

        const msgText = newMessages[0].text;

        const payload = {
            senderName: user.email,
            receiverName: receiverEmail,
            message: msgText,
            date: new Date().toISOString(),
            status: "MESSAGE"
        };

        stompService.publish("/app/private-message", JSON.stringify(payload));

        setMessages(previous => GiftedChat.append(previous, newMessages));
    }, [user, receiverEmail]);

    if (!user) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#3A6FF8"/>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Simple header */}
            <View className="bg-mj-blue px-4 py-4">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-3">
                        <Ionicons name="chevron-back" size={28} color="white"/>
                    </Pressable>

                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                        <Ionicons name="person" size={20} color="white"/>
                    </View>

                    <View className="flex-1">
                        <Text className="text-lg font-sans-bold text-white" numberOfLines={1}>
                            {receiverUsername || receiverEmail}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                            <View className={`w-2 h-2 rounded-full ${connected ? 'bg-mj-teal' : 'bg-gray-400'}`}/>
                            <Text className="text-xs text-white/90">
                                {connected ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Chat messages */}
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={headerHeight}
            >
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user.email,
                    }}
                    keyboardAvoidingViewProps={{keyboardVerticalOffset: headerHeight}}
                    messagesContainerStyle={{
                        backgroundColor: '#F7F9FC',
                        paddingBottom: 8,
                    }}
                    renderBubble={(props) => (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                right: {
                                    backgroundColor: '#3A6FF8',
                                    borderRadius: 16,
                                    marginRight: 8,
                                    marginVertical: 2,
                                },
                                left: {
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 16,
                                    marginLeft: 8,
                                    marginVertical: 2,
                                },
                            }}
                            textStyle={{
                                right: {
                                    color: '#FFFFFF',
                                    fontSize: 15,
                                },
                                left: {
                                    color: '#121826',
                                    fontSize: 15,
                                },
                            }}
                            renderTime={(timeProps) => (
                                <Time
                                    {...timeProps}
                                    timeTextStyle={{
                                        right: {
                                            color: '#FFFFFF',
                                            opacity: 0.7,
                                        },
                                        left: {
                                            color: '#9E9E9E',
                                        },
                                    }}
                                />
                            )}
                        />
                    )}
                    renderInputToolbar={(props) => (
                        <InputToolbar
                            {...props}
                            containerStyle={{
                                backgroundColor: 'white',
                                borderTopColor: '#E6ECFF',
                                borderTopWidth: 1,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                            primaryStyle={{
                                alignItems: 'center',
                            }}
                        />
                    )}
                    renderSend={(props) => {
                        const isDisabled = !props.text || !connected;
                        return (
                            <Send
                                {...props}
                                containerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 0,
                                    // marginBottom: 50,
                                    marginLeft: 8,
                                }}
                            >
                                <View className={`rounded-full p-2.5 ${isDisabled ? 'bg-gray-300' : 'bg-mj-blue'}`}>
                                    <Ionicons name="send" size={18} color="white"/>
                                </View>
                            </Send>
                        );
                    }}
                    textInputProps={{
                        style: {
                            backgroundColor: '#F0F4FF',
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingTop: 10,
                            paddingBottom: 10,
                            // marginBottom: 50,
                            color: '#121826',
                            fontSize: 15,
                            minHeight: 40,
                            maxHeight: 150
                        },
                        placeholder: "Type a message...",
                        placeholderTextColor: '#9E9E9E',
                    }}
                    minComposerHeight={40}
                    maxComposerHeight={150}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Chat;