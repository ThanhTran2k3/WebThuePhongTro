import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from '../../UserContext';
import { getDetailChat } from '../../api/chatApi';
import './ChatApp.css'
import moment from 'moment';

const Chat = (props) => {
    const { userInfo } = useUser();
    const [stompClient, setStompClient] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]);
    const currentName = userInfo.userName;
    const messagesEndRef = useRef(null); 
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
        const fetchdata = async () => {
           const messages = await getDetailChat(userInfo,props.userChat)
        //    const message = messages.map((msg) => ({
        //         senderName: msg.sender.username,
        //         avatarSender: msg.sender.avatar,
        //         receiverName: msg.receiver.username,
        //         avatarReceiver: msg.receiver.avatar,
        //         content: msg.content,
        //         timestamp: msg.timestamp
        //     }));
           setMessages(messages)
        };

        fetchdata();
    }, [userInfo,props.userChat]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => {
                return new SockJS('http://localhost:8080/ws');
            },
            connectHeaders: {
                Authorization: `Bearer ${userInfo.token}`,
            },
            onConnect: (frame) => {
                client.subscribe(`/user/${currentName}/queue/messages`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                });
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [userInfo,currentName]);

    const sendMessage = () => {
        if (stompClient && messageContent && props.userChat) {
            const message = {
                senderName: currentName,
                receiverName: props.userChat,
                content: messageContent,
                timestamp: new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString(),
            };
            stompClient.publish({
                destination: '/app/sendMessage',
                body: JSON.stringify(message),
            });
            const messagetamp = {
                senderName: message.senderName,
                avatarSender: userInfo.avatar,
                receiverName: message.receiverName,
                content: message.content,
                timestamp: message.timestamp,
            };
            setMessages(prevMessages => [...prevMessages, messagetamp]);
            setMessageContent('');
        }
    };

    const handleMessageClick = (msg) => {
        if(msg===selectedMessage)
            setSelectedMessage(null)
        else
            setSelectedMessage(msg);
      };

    return (
        <div className="chat-container main">
            <div className="messages bg-light" ref={messagesEndRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderName === currentName ? 'sent' : 'received'}`}>
                    {msg.senderName === currentName ? (
                        <>
                            {selectedMessage === msg && (
                                <span className="message-time me-3">
                                {moment(msg.timestamp).format('DD/MM/YYYY HH:mm')}
                                </span>
                            )}
                            <label className='message-label sent-label' onClick={() => handleMessageClick(msg)}>{msg.content}</label>
                            <img src={`http://localhost:8080${msg.avatarSender}`} alt="Avatar" className="avatar-img right" />
                        </>
                        ) : (
                        <>
                            <img src={`http://localhost:8080${msg.avatarSender}`} alt="Avatar" className="avatar-img left" />
                            <label className="message-label received-label" onClick={() => handleMessageClick(msg)}>{msg.content}</label>
                            {selectedMessage === msg && (
                                <span className="message-time ms-3">
                                {moment(msg.timestamp).format('DD/MM/YYYY HH:mm')}
                                </span>
                            )}
                        </>
                    )}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Nhập tin nhắn"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                />
                <button className="send-button" onClick={sendMessage}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default Chat;