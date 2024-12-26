import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../../UserContext';
import { getDetailChat, update } from '../../api/chatApi';
import './ChatApp.css'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Chat = (props) => {

    const { userInfo } = useUser();
    const [stompClient, setStompClient] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]);
    const currentName = userInfo.userName;
    const messagesEndRef = useRef(null); 
    const [selectedMessage, setSelectedMessage] = useState(null);
    let show = true
    const navigate = useNavigate();


    useEffect(() => {

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
        const fetchdata = async () => {
           const messages = await getDetailChat(userInfo,props.userChat,navigate)
           setMessages(messages)
        };

        fetchdata();
    }, [userInfo,props.userChat,navigate]);

    
    useEffect(() => {
        if (userInfo && props.userChat) {
            const client = new Client({
                webSocketFactory: () => {
                    return new SockJS('http://localhost:8080/ws');
                },
                onConnect: (frame) => {
                    client.subscribe(
                        `/topic/chat/${userInfo.userName}/${props.userChat}`,
                        async (message) => {
                            const receivedMessage = JSON.parse(message.body);
                            const messagetamp = await update(userInfo, receivedMessage.messageId, navigate);
                            setMessages((prevMessages) => [...prevMessages, messagetamp]);
                        }
                    );
                },
            });
    
            client.activate();
            setStompClient(client);
    
            return () => {
                if (client) {
                    client.deactivate();
                }
            };
        }
    }, [userInfo,navigate,props.userChat]);
    

    const sendMessage = () => {
        if (stompClient && stompClient.active && messageContent && props.userChat) {
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
            setMessages((prevMessages) => [...prevMessages, messagetamp]);
            const user = props.listUser.filter((user) => user.userName === props.userChat);
            const notUser = props.listUser.filter((user) => user.userName !== props.userChat);
            props.setListUser([...user, ...notUser]);
            setMessageContent('');
        } else {
            console.error("STOMP client is not connected or message content is empty");
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
                {messages.map((msg) => (
                    <div key={msg.messageId} className={`message ${msg.senderName === currentName ? 'sent' : 'received'}`}>
                    {!msg.status && msg.senderName !== currentName && show &&(
                        <>
                            <p className='text-center'>Tin nhắn chưa đọc</p>
                            {show=false}
                        </>
                    )}
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