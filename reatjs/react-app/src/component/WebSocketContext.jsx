import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Tạo context cho WebSocket
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null); // Sử dụng ref để lưu client WebSocket
    const [connected, setConnected] = useState(false); // Trạng thái kết nối

    useEffect(() => {
        // Khởi tạo WebSocket client
        clientRef.current = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true); 
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setConnected(false);
            },
        });

        // Kích hoạt kết nối
        clientRef.current.activate();

        // Cleanup WebSocket khi component bị unmount
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <WebSocketContext.Provider value={{ client: clientRef.current, connected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Hook để sử dụng WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);
