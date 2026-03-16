import {View, Text, ActivityIndicator} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {useCallback, useEffect, useRef, useState} from "react";
import {GiftedChat, IMessage} from "react-native-gifted-chat";
import {Client} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import {WEBSOCKET_URL} from "@/src/constants";
import GradientView from "@/src/components/ui/GradientView";
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

                client.subscribe('/user/queue/private', (message) => {
                    if (message.body) {
                        const body = JSON.parse(message.body);
                        const newMessage: IMessage = {
                            _id: Math.random().toString(),
                            text: body.message,
                            createdAt: new Date(body.date),
                            user: {
                                _id: body.senderId,
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

    if (!user) return <ActivityIndicator/>;

    return (
        <GradientView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{padding: 15, borderBottomWidth: 1, borderColor: '#eee'}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {receiverUsername || receiverEmail}
                </Text>
            </View>

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.email,
                }}
            />
        </GradientView>
    );
}

export default Chat;