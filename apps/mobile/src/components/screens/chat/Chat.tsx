
import {View, Text, ActivityIndicator, KeyboardAvoidingView, Platform} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {useCallback, useEffect, useRef, useState} from "react";
import {GiftedChat, IMessage, Bubble, Send, InputToolbar, MessageText, Time} from "react-native-gifted-chat";
import {Client} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import {WEBSOCKET_URL} from "@/src/constants";
import * as encoding from "text-encoding";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

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

                client.subscribe(`/private/${user.email}`, (message) => {
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
            <View className="flex-1 bg-mj-bg-light items-center justify-center">
                <ActivityIndicator size="large" color="#3A6FF8"/>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-mj-bg-light" edges={['top']}>
            {/* Header with gradient */}
            <LinearGradient
                colors={['#3A6FF8', '#6FD0C5']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                className="px-4 py-4"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        {/* Back button */}
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color="white"
                            onPress={() => router.back()}
                            style={{marginRight: 12}}
                        />

                        {/* User avatar */}
                        <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                            <Ionicons name="person" size={20} color="white" />
                        </View>

                        {/* User info */}
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-white" numberOfLines={1}>
                                {receiverUsername || receiverEmail}
                            </Text>
                            <View className="flex-row items-center gap-1.5">
                                <View className={`w-2 h-2 rounded-full ${connected ? 'bg-mj-success' : 'bg-mj-text-muted'}`} />
                                <Text className="text-xs text-white/80">
                                    {connected ? 'Connected' : 'Connecting...'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Chat area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={0}
            >
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user.email,
                    }}
                    messagesContainerStyle={{
                        backgroundColor: '#F7F9FC',
                    }}
                    renderBubble={(props) => (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                right: {
                                    backgroundColor: '#3A6FF8',
                                    borderRadius: 16,
                                    marginRight: 0,
                                    marginVertical: 4,
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                },
                                left: {
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 16,
                                    marginLeft: 0,
                                    marginVertical: 4,
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    shadowColor: '#121826',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 4,
                                    elevation: 2,
                                },
                            }}
                            textStyle={{
                                right: {
                                    color: '#FFFFFF',
                                    fontSize: 15,
                                    lineHeight: 20,
                                },
                                left: {
                                    color: '#121826',
                                    fontSize: 15,
                                    lineHeight: 20,
                                },
                            }}
                            renderTime={(timeProps) => (
                                <Time
                                    {...timeProps}
                                    timeTextStyle={{
                                        right: {
                                            color: '#FFFFFF',
                                            opacity: 0.7,
                                            fontSize: 11,
                                        },
                                        left: {
                                            color: '#9E9E9E',
                                            fontSize: 11,
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
                                backgroundColor: '#FFFFFF',
                                borderTopWidth: 1,
                                borderTopColor: '#E6ECFF',
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                marginBottom: 0,
                            }}
                            primaryStyle={{
                                alignItems: 'center',
                            }}
                        />
                    )}
                    renderSend={(props) => (
                        <Send
                            {...props}
                            disabled={!props.text || !connected}
                            containerStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginRight: 0,
                                marginLeft: 8,
                                marginBottom: 0,
                            }}
                        >
                            <View className={`rounded-full p-2.5 ${!props.text || !connected ? 'bg-mj-text-muted/30' : 'bg-mj-blue'}`}>
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color="white"
                                />
                            </View>
                        </Send>
                    )}
                    textInputProps={{
                        style: {
                            backgroundColor: '#F0F4FF',
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingTop: 10,
                            paddingBottom: 10,
                            marginRight: 0,
                            marginLeft: 0,
                            color: '#121826',
                            fontSize: 15,
                            lineHeight: 20,
                            minHeight: 40,
                        },
                        placeholder: "Type a message...",
                        placeholderTextColor: '#9E9E9E',
                        multiline: true,
                        maxLength: 1000,
                    }}
                    alwaysShowSend={true}
                    scrollToBottom={true}
                    scrollToBottomComponent={() => (
                        <View className="bg-white rounded-full p-2 shadow-sm items-center justify-center"
                              style={{
                                  shadowColor: '#121826',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.1,
                                  shadowRadius: 4,
                                  elevation: 3,
                              }}>
                            <Ionicons name="chevron-down" size={20} color="#3A6FF8" />
                        </View>
                    )}
                    infiniteScroll={true}
                />
            </KeyboardAvoidingView>

            {/* Connection lost banner */}
            {!connected && (
                <View className="absolute top-20 left-4 right-4 bg-mj-warning px-4 py-3 rounded-xl flex-row items-center shadow-lg"
                      style={{
                          shadowColor: '#FBCB43',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 5,
                      }}>
                    <Ionicons name="warning" size={20} color="#121826" />
                    <Text className="text-sm font-semibold text-mj-text-main ml-2">
                        Connection lost. Reconnecting...
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

export default Chat;