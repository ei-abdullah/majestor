import {Client, IMessage, StompSubscription} from '@stomp/stompjs';
import SockJS from "sockjs-client";
import {WEBSOCKET_URL} from '../constants';
import * as Sentry from "@sentry/react-native";

export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

class StompService {
    private static instance: StompService;
    private client: Client;
    status: ConnectionStatus = 'DISCONNECTED';
    private subscriptions: Map<string, StompSubscription> = new Map();
    private topicCallbacks: Map<string, (message: IMessage) => void> = new Map();
    private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();

    private constructor() {
        this.client = new Client({
            webSocketFactory: () => {
                return new SockJS(WEBSOCKET_URL);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                this.setStatus('CONNECTED');
                // Re-subscribe all registered active topic callbacks on connect / reconnect
                this.topicCallbacks.forEach((callback, topic) => {
                    if (this.subscriptions.has(topic)) {
                        try {
                            this.subscriptions.get(topic)?.unsubscribe();
                        } catch {
                            // Ignore stale subscription errors on reconnect
                        }
                    }
                    const subscription = this.client.subscribe(topic, callback);
                    this.subscriptions.set(topic, subscription);
                });
            },
            onStompError: (frame) => {
                Sentry.captureMessage(`STOMP Broker Error: ${frame.headers['message']}`);
            },
            onWebSocketError: (event) => {
                Sentry.captureException(new Error(`WebSocket Error: ${JSON.stringify(event)}`));
            },
            onWebSocketClose: () => {
                this.setStatus('DISCONNECTED');
            },
            onDisconnect: () => {
                this.setStatus('DISCONNECTED');
            }
        });
    }

    private setStatus(newStatus: ConnectionStatus): void {
        this.status = newStatus;
        this.statusListeners.forEach(listener => listener(newStatus));
    }

    public subscribeStatus(listener: (status: ConnectionStatus) => void): () => void {
        this.statusListeners.add(listener);
        listener(this.status);
        return () => {
            this.statusListeners.delete(listener);
        };
    }

    public static getInstance(): StompService {
        if (!StompService.instance) {
            StompService.instance = new StompService();
        }

        return StompService.instance;
    }

    public connect(): void {
        if (this.status === 'DISCONNECTED' && !this.client.active) {
            this.setStatus('CONNECTING');
            this.client.activate();
        } else if (this.client.connected && this.status !== 'CONNECTED') {
            this.setStatus('CONNECTED');
        }
    }

    public disconnect(): void {
        this.topicCallbacks.clear();
        this.subscriptions.clear();
        if (this.status !== "DISCONNECTED" || this.client.active) {
            this.client.deactivate();
            this.setStatus('DISCONNECTED');
        }
    }

    public subscribe(topic: string, callback: (message: IMessage) => void): StompSubscription {
        this.topicCallbacks.set(topic, callback);

        if (this.status === 'CONNECTED' && this.client.connected) {
            if (this.subscriptions.has(topic)) {
                try {
                    this.subscriptions.get(topic)?.unsubscribe();
                } catch {
                    // ignore
                }
            }
            const subscription = this.client.subscribe(topic, callback);
            this.subscriptions.set(topic, subscription);
        }

        return {
            id: topic,
            unsubscribe: () => {
                this.unsubscribe(topic);
            },
        } as StompSubscription;
    }

    public publish(destination: string, body: string): void {
        if (this.status === 'CONNECTED' && this.client.connected) {
            this.client.publish({destination, body});
        } else {
            Sentry.captureMessage(`Attempted to publish to ${destination} while disconnected.`);
        }
    }

    public unsubscribe(topic: string): void {
        this.topicCallbacks.delete(topic);
        if (this.subscriptions.has(topic)) {
            try {
                this.subscriptions.get(topic)?.unsubscribe();
            } catch {
                // ignore
            }
            this.subscriptions.delete(topic);
        }
    }
}

export const stompService = StompService.getInstance();
