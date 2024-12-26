import React, { useEffect, useState } from 'react';
import './HeaderWeb.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { postSuggestions } from '../../api/postApi';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const HeaderWeb = () => {

    const [clicked, setClicked] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo,setUserInfo, logout  } = useUser();
    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState('');
    const [micQuery, setMicQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(""); 

    const {
        transcript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if(userInfo){
            const client = new Client({
                webSocketFactory: () => {
                    return new SockJS('http://localhost:8080/ws');
                },
                onConnect: (frame) => {
                    client.subscribe(`/topic/chat/${userInfo.userName}`, (message) => {
                        const listUser = JSON.parse(message.body);
                        let count = listUser.reduce((total, user) => total + user.unreadMessageCount, 0)
                        // setUserInfo(prevUserInfo => ({
                        //     ...prevUserInfo,
                        //     unreadMessageCount: count
                        // }));
                        // sessionStorage.setItem('userinfo', JSON.stringify(userInfo));
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

    useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedQuery(query); 
        }, 500);
    
        return () => clearTimeout(timer); 
      }, [query]);
    
      useEffect(() => {
        if (debouncedQuery) {
            const fetchData = async () => {
                const suggestion = await postSuggestions(debouncedQuery)
                setSuggestions(suggestion)
            };
            fetchData()
        }
      }, [debouncedQuery]);

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleChange = async (e) => {
        const query = e.target.value;
        setQuery(query)
    };

    const handleInpuclick = async (e) => {
        if(!clicked){
            const suggestion = await postSuggestions(query)
            setSuggestions(suggestion)
            setClicked(true)
        }
        
    };


    const handleSuggestionClick = async (item) => {
        setQuery(item)
    };

    const handleChat = () => {
        navigate('/chat')
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${query}`)
    };

    const handleReload = () => {
        navigate(0);
    }; 

    const handleLogout = () => {
        Swal.fire({
          title: "Bạn chắc chắn?",
          text: "Bạn sẽ đăng xuất khỏi tài khoản của mình.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đăng xuất",
          cancelButtonText: "Thoát"
        }).then((result) => {
          if (result.isConfirmed) {
            logout()
            navigate('/');
            Swal.fire({
              title: "Đăng xuất!",
              text: "Bạn đã đăng xuất thành công.",
              icon: "success"
            });
          }
        });
    }


    const clickListening = (e) => {
        e.preventDefault();
    };

    const startListening = (e) => {
        SpeechRecognition.startListening({  language: 'vi-VN' });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        
    };

    useEffect(() => {
        setMicQuery(transcript); 
    }, [transcript]);

    useEffect(() => {
        if(micQuery){
            navigate(`/search?query=${micQuery}`)
            setMicQuery('')
        }
            
    }, [micQuery,navigate]);



    if (!browserSupportsSpeechRecognition) {
        return <div>Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.</div>;
    }

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-black border-bottom box-shadow">
                <div className="container-fluid ">
                    {location.pathname ==='/' ?(
                        <img src='/Logo.jpg' onClick={handleReload} alt='logo' className='logo-img'></img>
                    ):(
                        <Link className="navbar-brand" to="/">
                            <img src='/Logo.jpg' alt='logo' className='logo-img'></img>
                        </Link>
                    )}
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <div className="search-bar position-absolute w-100 d-flex justify-content-center">
                                <form id="search-form" className="dropdown">
                                    <div className="input-group">
                                        <input onChange={handleChange} onClick={handleInpuclick} className="form-control search-input" value={query?query:''} type="text" name="query" autoComplete="off" placeholder="Tìm bài đăng" required />
                                        <div id="search-results" className="dropdown-content search-results">
                                            {Array.isArray(suggestions) && suggestions.length > 0 ? (
                                                suggestions.map((item, index) => (
                                                    <div onClick={() => handleSuggestionClick(item)} key={index} className='suggestion'>{item}</div>
                                                ))
                                            ) : (
                                                <div className='suggestion'>Không có kết quả</div>
                                            )}
                                        </div>
                                        <button  className="btn btn-outline-dark bg-white btn-search" onMouseDown={startListening} onMouseUp={stopListening} onClick={clickListening}>
                                            <i className="fa-solid fa-microphone"></i>
                                        </button>
                                        <button className="btn btn-outline-dark bg-white btn-search" onClick={handleSearch}>
                                            <i className="me-1">Tìm kiếm</i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </ul>


                    </div>
                    {userInfo ?(
                        <div className="user-info">
                            <div className='chat-icon' onClick={handleChat}>&#9993;
                            <span className="unread-count">{userInfo.unreadMessageCount}</span></div>
                            <h6>{userInfo.userName}</h6>
                            <div className="profile-menu">
                                <img 
                                    src={`http://localhost:8080${userInfo.avatar}`} 
                                    alt='Avatar'
                                    onClick={handleMenuToggle} 
                                    className="avatar-img"
                            />
                            {showMenu && (
                                <div className="menu">
                                    <ul>
                                    {userInfo &&
                                        <li>
                                            <Link to={`${userInfo.roles.includes('ROLE_USER')?'user/manager':userInfo.roles.includes('ROLE_EMPLOYEE')?'employee/manager/user':'admin/manager/employee'}`}>
                                                <label>
                                                    <i className="fa-solid fa-user w-20"></i>
                                                    <span>Tài khoản</span>
                                                </label>
                                            </Link>
                                        </li>
                                    }
                                        {!userInfo.roles.includes('ROLE_EMPLOYEE')&&!userInfo.roles.includes('ROLE_ADMIN')&&(
                                            <li>
                                                <Link to={`user/favorite/post`}>
                                                    <label>
                                                        <i className="fa-solid fa-heart w-20"></i>
                                                        <span>Yêu thích</span>
                                                    </label>
                                                </Link>
                                            </li>
                                        )}
                                        

                                        <li>
                                            <button onClick={handleLogout} className="logout-button">
                                                <label>
                                                        <i className="fa-solid fa-right-from-bracket w-20"></i>
                                                        <span>Đăng xuất</span>
                                                </label>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            </div>
                        </div>
                    ) : (
                        <Link to={'/login'} className="btn btn-black-white btn-block">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
            
        </header>
    );
};

export default HeaderWeb;


