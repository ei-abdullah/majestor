import React, {useState, useEffect, useCallback} from "react";
import {View, Text, ActivityIndicator, Pressable, KeyboardAvoidingView, Platform} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuthStore} from "@/src/stores/authStore";
import {GiftedChat, IMessage, Bubble, Send, InputToolbar, Time} from "react-native-gifted-chat";
import {Ionicons} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";
import {stompService} from "@/src/services/stompService";

export default function GroupChat() {
    const router = useRouter();
    const headerHeight = useHeaderHeight();

    const {groupId, groupName} = useLocalSearchParams<{
        groupId: string,
        groupName: string
    }>();
    const {user} = useAuthStore();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const connected = stompService.status === "CONNECTED";

    useEffect(() => {
        if (!user || !groupId) return;

        stompService.connect();

        // Subscribe to a group topic
        const topic = `/topic/group/${groupId}`;

        const subscription = stompService.subscribe(topic, (message) => {
            if (message.body) {
                try {
                    const body = JSON.parse(message.body);

                    // GiftedChat message structure
                    const newMessage: IMessage = {
                        _id: Math.random().toString(),
                        text: body.content,
                        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
                        user: {
                            _id: body.senderEmail,
                            name: body.senderName,
                            avatar: body.senderAvatar || undefined,
                        },
                    };

                    // Don't append if it's our own message (GiftedChat already does this locally)
                    if (body.senderEmail !== user.email) {
                        setMessages(previous => GiftedChat.append(previous, [newMessage]));
                    }
                } catch (error) {
                    Sentry.captureException(error);
                }
            }
        });

        return () => {
            stompService.unsubscribe(topic);
        };
    }, [user, groupId]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (!user || !groupId) return;

        const msgText = newMessages[0].text;

        const payload = {
            senderName: user.username,
            senderEmail: user.email,
            content: msgText,
            groupId: parseInt(groupId),
            createdAt: new Date().toISOString(),
        };

        // Send it to the group endpoint
        stompService.publish(`/app/study-group/${groupId}/send`, JSON.stringify(payload));

        setMessages(previous => GiftedChat.append(previous, newMessages));
    }, [user, groupId]);

    if (!user) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#3A6FF8"/>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header */}
            <View className="bg-mj-blue px-4 py-4">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-3">
                        <Ionicons name="chevron-back" size={28} color="white"/>
                    </Pressable>

                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                        <Ionicons name="people" size={20} color="white"/>
                    </View>

                    <View className="flex-1">
                        <Text className="text-lg font-bold text-white" numberOfLines={1}>
                            {groupName || "Group Chat"}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                            <View className={`w-2 h-2 rounded-full ${connected ? 'bg-mj-teal' : 'bg-gray-400'}`}/>
                            <Text className="text-xs text-white/90">
                                {connected ? 'Online' : 'Connecting...'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Chat */}
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
                    isUserAvatarVisible={false}
                    isUsernameVisible={true}
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
                                    marginLeft: 8,
                                }}
                            >
                                <View className={`rounded-full p-2.5 ${isDisabled ? 'bg-gray-300' : 'bg-mj-blue'}`}>
                                    <Ionicons name="send" size={18} color="white"/>
                                </View>
                            </Send>
                        );
                    }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
