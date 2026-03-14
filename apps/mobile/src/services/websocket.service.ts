import { Client } from '@stomp/stompjs';
import { WEBSOCKET_URL } from '../constants';

// Note: The 'text-encoding' polyfill is often not needed in modern React Native environments
// as Hermes (the default JS engine) supports TextDecoder.
// If you encounter issues, you might need to add it back.
// import { TextDecoder } from 'text-encoding';
// global.TextDecoder = TextDecoder;

let stompClient: Client | null = null;

export const connect = (username: string, onMessageReceived: (message: any) => void) => {
  console.log('Connecting to WebSocket with username:', username);

  stompClient = new Client({
    brokerURL: WEBSOCKET_URL,
    connectHeaders: {},
    debug: function (str) {
      console.log('STOMP Debug: ', str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    stompClient?.subscribe(`/user/${username}/private`, (message) => {
      const msg = JSON.parse(message.body);
      console.log('Private message received: ', msg);
      onMessageReceived(msg);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  stompClient.onWebSocketError = (event) => {
    console.error('WebSocket error', event);
  }

  stompClient.activate();
};

export const disconnect = () => {
  stompClient?.deactivate();
  console.log('Disconnected');
};

export const sendPrivateMessage = (senderName: string, receiverName: string, message: string) => {
  if (stompClient && stompClient.connected) {
    const chatMessage = {
      senderName,
      receiverName,
      message,
      status: 'MESSAGE',
    };
    stompClient.publish({
      destination: '/app/private-message',
      body: JSON.stringify(chatMessage),
    });
    console.log('Private message sent: ', chatMessage);
  } else {
    console.error('Cannot send message, STOMP client is not connected.');
  }
};

