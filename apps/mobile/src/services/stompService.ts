import {Client, IMessage, StompSubscription} from '@stomp/stompjs';
import SockJS from "sockjs-client";
import {WEBSOCKET_URL} from '../constants';
import * as Sentry from "@sentry/react-native";

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
                this.pendingSubscription.forEach(callback => callback());
                this.pendingSubscription = [];
            },
            onStompError: (frame) => {
                Sentry.captureMessage(`STOMP Broker Error: ${frame.headers['message']}`);
            },
            onWebSocketError: (event) => {
                Sentry.captureException(new Error(`WebSocket Error: ${JSON.stringify(event)}`));
            },
            onDisconnect: () => {
                this.status = 'DISCONNECTED';
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
        };

        if (this.status === 'CONNECTED') {
            subscribeAction();
        } else {
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
            Sentry.captureMessage(`Attempted to publish to ${destination} while disconnected.`);
        }
    }

    public unsubscribe(topic: string): void {
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic)?.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }
}

export const stompService = StompService.getInstance();