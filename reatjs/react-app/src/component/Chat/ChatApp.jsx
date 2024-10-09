import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from '../../UserContext';

const ChatApp = () => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState('user1'); // Giả sử user hiện tại là 'user1'
    const [userList, setUserList] = useState([]);
    const [activeUserId, setActiveUserId] = useState(null); 
    const { userInfo  } = useUser();
    useEffect(() => {


        const sock = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => sock,
            connectHeaders: {
                Authorization: `Bearer ${userInfo.token}` // Thêm JWT token vào header
            },
            debug: (str) => console.log(str),
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                
                // Đăng ký nhận tin nhắn
                stompClient.subscribe(`/user/${currentUserId}/queue/messages`, (message) => {
                    if (message.body) {
                        const parsedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                        
                        // Thêm người dùng vào danh sách nếu chưa có
                        if (!userList.some(user => user.id === parsedMessage.senderId)) {
                            setUserList((prevList) => [...prevList, { id: parsedMessage.senderId, name: parsedMessage.senderName }]);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
            },
        });

        setClient(stompClient);
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [currentUserId, userList]);

    const sendMessage = () => {
        if (inputMessage && client && activeUserId) {
            const messageData = {
                content: inputMessage,
                senderId: currentUserId,
                senderName: 'User 1', // Tên người gửi
                recipientId: activeUserId,
                timestamp: new Date().toISOString(),
            };

            client.publish({
                destination: '/app/chat',
                body: JSON.stringify(messageData),
            });

            setInputMessage('');
        }
    };

    const handleUserClick = (userId) => {
        setActiveUserId(userId);
        const filteredMessages = messages.filter(
            (msg) => (msg.senderId === userId || msg.recipientId === userId) &&
                     (msg.senderId === currentUserId || msg.recipientId === currentUserId)
        );
        setMessages(filteredMessages);
    };

    return (
        <div className="chat-app">
            <div className="user-list">
                <h4>Người dùng đã nhắn tin</h4>
                {userList.length > 0 ? (
                    userList.map((user) => (
                        <div key={user.id} className={`user ${user.id === activeUserId ? 'active' : ''}`} onClick={() => handleUserClick(user.id)}>
                            {user.name}
                        </div>
                    ))
                ) : (
                    <p>Chưa có tin nhắn</p>
                )}
            </div>

            <div className="chat-window">
                <h4>Tin nhắn</h4>
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                            <strong>{msg.senderName}:</strong> {msg.content} <em>({new Date(msg.timestamp).toLocaleString()})</em>
                        </div>
                    ))}
                </div>
                {activeUserId ? (
                    <div className="message-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button onClick={sendMessage}>Gửi</button>
                    </div>
                ) : (
                    <p>Chọn người để nhắn tin</p>
                )}
            </div>
        </div>
    );
};

export default ChatApp;
