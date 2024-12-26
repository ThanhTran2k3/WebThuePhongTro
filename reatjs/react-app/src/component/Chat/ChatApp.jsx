import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { getListUserChat, updateMessage } from '../../api/chatApi';
import { useLocation, useNavigate } from 'react-router-dom';
import Chat from './Chat';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatApp = () => {

    const [activeButton, setActiveButton] = useState('');
    const [listUser, setListUser] = useState([]);
    const { userInfo, setUserInfo } = useUser();
    const navigate = useNavigate();
    const [currentContent, setCurrentContent] = useState(null);
    const location = useLocation();
    const user = location.state?location.state.user:''
    

    useEffect(() => {
        if(userInfo){
            const client = new Client({
                webSocketFactory: () => {
                    return new SockJS('http://localhost:8080/ws');
                },
                onConnect: (frame) => {
                    client.subscribe(`/topic/chat/${userInfo.userName}`, (message) => {
                        const listUser = JSON.parse(message.body);
                        // let count = listUser.reduce((total, user) => total + user.unreadMessageCount, 0)
                        // setUserInfo(prevUserInfo => ({
                        //     ...prevUserInfo,
                        //     unreadMessageCount: count
                        // }));
                        // sessionStorage.setItem('userinfo', JSON.stringify(userInfo));
                        setListUser(listUser)
                    });
                },
            });
            client.activate();
            return () => {
                if (client) {
                    client.deactivate();
                }
            };
            
        }
       
    }, [userInfo]);

    useEffect(()=>{
        if (!userInfo) {
            navigate('/login');
            return
        }
        const fetchData = async()=>{
            let listUser = await getListUserChat(userInfo,navigate);
            if (user) {
                const exists = listUser.some(item => item.userName === user.userName);
                if(!exists){
                    listUser = [user,...listUser]  
                }
                  
            }
            setListUser(listUser)
            if(listUser.length!==0){
                setActiveButton(listUser[0].userName); 
                setCurrentContent(<Chat userChat={listUser[0].userName} listUser={listUser} setListUser={setListUser} ></Chat>)
            }
            
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' 
        });

        if(listUser.length===0)
            fetchData()
        
    },[userInfo,navigate,user,listUser])

    useEffect(()=>{

        const fetchData = async()=>{
            await updateMessage(userInfo,activeButton,navigate);
        }
        if(activeButton)
            fetchData()
        
    },[activeButton,userInfo,navigate])


    
    const handleButtonClick = async (userName) => {
        if (userName !== activeButton) {
            setActiveButton(userName); 
            setCurrentContent(<Chat userChat={userName} listUser={listUser} setListUser={setListUser} ></Chat>)
        }
        
    };

    return (
        <div className='d-flex w-100 main'>
            <div className='dashboard m-2 w-25'>
                {listUser.length!==0 &&(
                    listUser.map((item)=>(
                        <button key={item.userName} className={`ml-5 ${activeButton === item.userName ? 'button-click' : ''}`} onClick={() => handleButtonClick(item.userName)}>
                            <img src={`http://localhost:8080${item.avatar}`} alt='Avatar' className="avatar-img"/>
                            <label className='m-2'>{item.userName}
                                {item.unreadMessageCount>0&&(
                                    <span className="unread-message">{item.unreadMessageCount}</span>
                                )} 
                            </label>
                        </button>

                       
                    ))
                
                )}
            </div>
            
     
            <div style={{ flex: 1,backgroundColor: '#f4f6fd'}}>
                {currentContent}
            </div>
        </div>
    );
};

export default ChatApp;