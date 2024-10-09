import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const PrivateChat = ({ currentUser, recipient }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Khởi tạo kết nối WebSocket với SockJS
        const socket = new SockJS('http://localhost:8080/ws'); // URL của WebSocket
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu bị ngắt kết nối
        });

        stompClient.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            // Đăng ký lắng nghe các tin nhắn gửi đến queue của người dùng hiện tại
            stompClient.subscribe(`/queue/messages/${currentUser.id}`, (messageOutput) => {
                const message = JSON.parse(messageOutput.body);
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        };

        stompClient.activate(); // Kích hoạt kết nối

        setStompClient(stompClient);

        return () => {
            if (stompClient !== null) {
                stompClient.deactivate(); // Ngắt kết nối khi component unmount
            }
        };
    }, [currentUser]);

    const sendMessage = () => {
        if (stompClient && message) {
            const chatMessage = {
                senderId: currentUser.id,  // ID người gửi
                recipientId: recipient.id, // ID người nhận
                content: message,
                type: 'CHAT'
            };
            // Gửi tin nhắn đến server
            stompClient.publish({
                destination: "/app/sendMessage", // Đường dẫn đến endpoint trên server
                body: JSON.stringify(chatMessage),
            });
            setMessage("");
        }
    };

    return (
        <div>
            <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.senderId === currentUser.id ? 'You' : recipient.username}: </b>{msg.content}
                    </div>
                ))}
            </div>
            <div>
                <input 
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '80%', padding: '5px' }}
                />
                <button onClick={sendMessage} style={{ width: '20%', padding: '5px' }}>Send</button>
            </div>
        </div>
    );
};

export default PrivateChat;
