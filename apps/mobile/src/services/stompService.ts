import {Client, IMessage, StompSubscription} from '@stomp/stompjs';
import {WEBSOCKET_URL} from '../constants';
import SockJS from "sockjs-client";

type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

class StompService {
    private static instance: StompService;
    private client: Client;
    status: ConnectionStatus = 'DISCONNECTED';
    private subscriptions: Map<string, StompSubscription> = new Map();
    private pendingSubscription: Array<() => void> = [];

    private constructor() {
        this.client = new Client({
            webSocketFactory: () => {
                return new SockJS(WEBSOCKET_URL);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                this.status = 'CONNECTED';
                console.log('STOMP Service: Connected successfully.');
                this.pendingSubscription.forEach(callback => callback());
                this.pendingSubscription = [];
            },

            onStompError: (frame) => {
                console.error('STOMP Service: Broker reported error: ' + frame.headers['message']);
                console.error('STOMP Service: Additional details: ' + frame.body);
            },

            onWebSocketError: (event) => {
                console.error('STOMP Service: WebSocket error', event);
            },

            onDisconnect: () => {
                this.status = 'DISCONNECTED';
                console.log('STOMP Service: Disconnected.');
            }
        });
    }

    public static getInstance(): StompService {
        if (!StompService.instance) {
            StompService.instance = new StompService();
        }

        return StompService.instance;
    }

    public connect(): void {
        if (this.status === 'DISCONNECTED') {
            this.status = 'CONNECTING';
            this.client.activate();
        }
    }

    public disconnect(): void {
        if (this.status !== "DISCONNECTED") {
            this.client.deactivate();
        }
    }

    public subscribe(topic: string, callback: (message: IMessage) => void): StompSubscription {
        const subscribeAction = () => {
            if (this.subscriptions.has(topic)) {
                this.subscriptions.get(topic)?.unsubscribe();
            }
            const subscription = this.client.subscribe(topic, callback);
            this.subscriptions.set(topic, subscription);
            console.log(`STOMP Service: Subscribed to ${topic}`);
        };

        if (this.status === 'CONNECTED') {
            subscribeAction();
        } else {
            console.log(`STOMP Service: Queuing subscription for ${topic}`);
            this.pendingSubscription.push(subscribeAction);
        }

        // Return an object with a working unsubscribe method
        return {
            unsubscribe: () => {
                this.unsubscribe(topic);
            },
        } as StompSubscription;
    }

    public publish(destination: string, body: string): void {
        if (this.status === 'CONNECTED') {
            this.client.publish({destination, body});
        } else {
            console.error('Cannot publish: STOMP client is not connected.');
        }
    }

    public unsubscribe(topic: string): void {
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic)?.unsubscribe();
            this.subscriptions.delete(topic);
            console.log(`STOMP Service: Unsubscribed from ${topic}`);
        }
    }
}

export const stompService = StompService.getInstance();