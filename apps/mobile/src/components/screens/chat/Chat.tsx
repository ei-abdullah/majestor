import {View, Text, ActivityIndicator} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {useCallback, useEffect, useRef, useState} from "react";
import {GiftedChat, IMessage, Bubble, Send, InputToolbar} from "react-native-gifted-chat";
import {Client} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import {WEBSOCKET_URL} from "@/src/constants";
import * as encoding from "text-encoding";

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
    const {user, accessToken} = useAuthStore();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const stompClient = useRef<Client | null>(null);
    const [connected, setConnected] = useState<Boolean>(false);

    useEffect(() => {
        if (!user || !accessToken) return;

        const client = new Client({
            webSocketFactory: () => new SockJs(WEBSOCKET_URL),

            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },

            onConnect: () => {
                setConnected(true);

                client.subscribe(`/user/${user.email}/private`, (message) => {
                    if (message.body) {
                        const body = JSON.parse(message.body);
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
                });
            },
            onStompError: (frame) => {
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, [user, accessToken]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (!stompClient.current || !connected || !user) return;

        const msgText = newMessages[0].text;

        const payload = {
            senderName: user.email,
            receiverName: receiverEmail,
            message: msgText,
            date: new Date().toISOString(),
            status: "MESSAGE"
        };

        stompClient.current.publish({
            destination: "/app/private-message",
            body: JSON.stringify(payload)
        });

        setMessages(previous => GiftedChat.append(previous, newMessages));
    }, [connected, user, receiverEmail]);

    if (!user) return <ActivityIndicator size="large" color="#3A6FF8"/>;

    return (
        <View className="flex-1 bg-white">
            <View className="bg-mj-blue p-4 pt-12 items-center">
                <Text className="text-lg font-bold text-white">
                    {receiverUsername || receiverEmail}
                </Text>
            </View>

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.email,
                }}
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: '#3A6FF8',
                            },
                            left: {
                                backgroundColor: '#F0F4FF',
                            },
                        }}
                        textStyle={{
                            right: {
                                color: '#fff',
                            },
                            left: {
                                color: '#121826',
                            },
                        }}
                    />
                )}
                renderInputToolbar={(props) => (
                    <InputToolbar
                        {...props}
                        containerStyle={{
                            backgroundColor: 'white',
                            borderTopColor: '#E6ECFF',
                            borderTopWidth: 1,
                            padding: 5,
                        }}
                        primaryStyle={{alignItems: 'center'}}
                    />
                )}
                renderSend={(props) => (
                    <Send {...props} containerStyle={{justifyContent: 'center', alignItems: 'center', height: '100%', marginRight: 10}}>
                        <View className="bg-mj-blue rounded-2xl py-2 px-4">
                            <Text className="text-white font-bold">Send</Text>
                        </View>
                    </Send>
                )}
                textInputProps={{
                    style: {
                        backgroundColor: '#F0F4FF',
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingTop: 10,
                        marginRight: 10,
                        color: '#121826',
                    }
                }}
            />
        </View>
    );
}

export default Chat;
