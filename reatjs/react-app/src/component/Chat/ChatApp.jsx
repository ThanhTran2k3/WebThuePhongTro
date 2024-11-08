import React, { useEffect, useState } from 'react';

import { useUser } from '../../UserContext';
import { getListUserChat } from '../../api/chatApi';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';

const ChatApp = () => {
    const [activeButton, setActiveButton] = useState('');
    const [listUser, setListUser] = useState([]);
    const { userInfo } = useUser();
    const navigate = useNavigate();
    const [currentContent, setCurrentContent] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    useEffect(()=>{
        const fetchData = async()=>{
            const listUser = await getListUserChat(userInfo)
            setListUser(listUser)
        }
        fetchData()
    },[userInfo])

    
    const handleButtonClick = (userName) => {
        setActiveButton(userName); 
        setCurrentContent(<Chat userChat={userName}></Chat>)
    };

    return (
        <div className='d-flex w-100 main'>
            <div className='dashboard m-2 w-25'>
                <button className="create-chat-btn ml-5">
                    <i className="fa-solid fa-user-plus ms-4"></i>
                    <label className="ms-3 mt-2 mb-2">Tạo mới</label>
                </button>
                {listUser.length!==0 &&(
                    listUser.map((item)=>(
                        <button className={`ml-5 ${activeButton === item.userName ? 'button-click' : ''}`} onClick={() => handleButtonClick(item.userName)}>
                            <img src={`http://localhost:8080${item.avatar}`} alt='Avatar' className="avatar-img"/>
                            <label className='m-2'>{item.userName}</label>
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