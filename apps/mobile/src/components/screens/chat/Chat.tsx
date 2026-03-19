
import {View, Text, ActivityIndicator, Pressable} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {useCallback, useEffect, useRef, useState} from "react";
import {GiftedChat, IMessage, Bubble, Send, InputToolbar, Time} from "react-native-gifted-chat";
import {Client} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import {WEBSOCKET_URL} from "@/src/constants";
import * as encoding from "text-encoding";
import {Ionicons} from "@expo/vector-icons";

const _global = global as any;
if (!_global.TextEncoder) {
    _global.TextEncoder = encoding.TextEncoder;
    _global.TextDecoder = encoding.TextDecoder;
}

function Chat() {
    const router = useRouter();
    const {receiverEmail, receiverUsername} = useLocalSearchParams<{
        receiverEmail: string,
        receiverUsername: string
    }>();
    const {user} = useAuthStore();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const stompClient = useRef<Client | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const client = new Client({
            webSocketFactory: () => {
                console.log('🔌 Creating WebSocket connection to:', WEBSOCKET_URL);
                return new SockJs(WEBSOCKET_URL);
            },

            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            reconnectDelay: 5000,

            onConnect: (frame) => {
                console.log('✅ WebSocket connected successfully');
                setConnected(true);

                const subscriptionPath = `/private/${user.email}`;
                console.log('📬 Subscribing to:', subscriptionPath);

                client.subscribe(subscriptionPath, (message) => {
                    if (message.body) {
                        const body = JSON.parse(message.body);
                        console.log('📩 Private message received:', body);

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
                    }
                });
            },

            onStompError: (frame) => {
                console.error('❌ STOMP error:', frame.headers['message']);
                console.error('Details:', frame.body);
            },

            onWebSocketError: (event) => {
                console.error('❌ WebSocket error:', event);
            },

            onWebSocketClose: (event) => {
                console.warn('⚠️ WebSocket closed:', event);
                setConnected(false);
            },

            debug: (str) => {
                console.log('🔍 STOMP debug:', str);
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            console.log('🔌 Disconnecting WebSocket');
            client.deactivate();
        };
    }, [user, receiverEmail]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (!stompClient.current || !connected || !user) {
            console.warn('⚠️ Cannot send: not connected');
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

        console.log('📤 Sending message:', payload);

        stompClient.current.publish({
            destination: "/app/private-message",
            body: JSON.stringify(payload)
        });

        setMessages(previous => GiftedChat.append(previous, newMessages));
    }, [connected, user, receiverEmail]);

    if (!user) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#3A6FF8"/>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Simple header */}
            <View className="bg-mj-blue px-4 py-4 pt-14">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-3">
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable>

                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                        <Ionicons name="person" size={20} color="white" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-lg font-bold text-white" numberOfLines={1}>
                            {receiverUsername || receiverEmail}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                            <View className={`w-2 h-2 rounded-full ${connected ? 'bg-mj-teal' : 'bg-gray-400'}`} />
                            <Text className="text-xs text-white/90">
                                {connected ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Chat messages */}
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.email,
                }}
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
                                marginLeft: 8,
                            }}
                        >
                            <View className={`rounded-full p-2.5 ${isDisabled ? 'bg-gray-300' : 'bg-mj-blue'}`}>
                                <Ionicons name="send" size={18} color="white" />
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
                        color: '#121826',
                        fontSize: 15,
                        minHeight: 40,
                    },
                    placeholder: "Type a message...",
                    placeholderTextColor: '#9E9E9E',
                }}
            />
        </View>
    );
}

export default Chat;