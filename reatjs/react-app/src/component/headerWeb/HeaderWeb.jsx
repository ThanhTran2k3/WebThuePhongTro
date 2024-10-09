import React, { useEffect, useState } from 'react';
import './HeaderWeb.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';


const HeaderWeb = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, logout  } = useUser();

    useEffect(() => {
        setShowMenu(false); 
    }, [location.pathname]); 


    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleChat = () => {
        console.log("sjflks")
        navigate('/chat')
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
    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-black border-bottom box-shadow">
                <div className="container-fluid ">
                    <Link className="navbar-brand" to="/">
                        <img src='/Logo.jpg' alt='' className='logo-img'></img>
                    </Link>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <div className="search-bar position-absolute w-100 d-flex justify-content-center">
                                <form id="search-form" action="search-results.html" method="get" className="dropdown">
                                    <div className="input-group">
                                        <input id="search-input" className="form-control" type="text" name="query" autoComplete="off" placeholder="Tìm bài đăng" required />
                                        <div id="search-results" className="dropdown-content"></div>
                                        <button className="btn btn-outline-dark bg-white btn-search" type="submit">
                                            <i className="me-1">Tìm kiếm</i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </ul>


                    </div>
                    {userInfo ?(
                        <div className="user-info">
                            <div className='chat-icon' onClick={handleChat}>&#9993;</div>
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
                                        <li>
                                            <Link to={'user/manager'}>
                                                <label>
                                                    <i className="fa-solid fa-user w-20"></i>
                                                    <span>Tài khoản</span>
                                                </label>
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to={`user/favorite/post`}>
                                                <label>
                                                    <i className="fa-solid fa-heart w-20"></i>
                                                    <span>Yêu thích</span>
                                                </label>
                                            </Link>
                                        </li>

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

