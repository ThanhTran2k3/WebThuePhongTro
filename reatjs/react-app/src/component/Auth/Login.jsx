import React, { createRef, useEffect, useRef, useState } from 'react';
import './Auth.css'
import { login } from '../../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import Swal from 'sweetalert2';

const Login = () => {
    const { userInfo, updateUser  } = useUser();
    const usernameref = createRef();
    const passwordref = createRef();
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const loginButtonRef = useRef(null);
    const [enterCount, setEnterCount] = useState(0);

        
    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
        handleEnterAction();
    })

    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setEnterCount(prev => prev + 1);
        }
    };

    const handleEnterAction = () => {
        if (enterCount === 1) {
            usernameref.current.focus();
        } else if (enterCount === 2) {
            passwordref.current.focus();
        } else if (enterCount === 3) {
            loginButtonRef.current.click();
            setEnterCount(0);
        }
      }

    const togglePassword = ()=>{
        setShowPassword(!showPassword)
    }


    

      
    const handleLogin = async (event) => {
        event.preventDefault()
        const userName = usernameref.current.value.trim();
        const password = passwordref.current.value.trim();


        if (!userName || !password) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return
        }


        const data = { 
            userName: userName, 
            password: password
        };

      
        await login(data,updateUser, navigate);
       
        
    };


    return (
        <div className="form-03-main w-40 mb-5 mt-5 bg-light border">
            <div className="logo">
                <img src='/user.png' alt=''/>
            </div>
            <div className="form-floating mb-4">
                <input className="form-control" type="text" onKeyDown={handleKeyDown} ref={usernameref} required placeholder="Tên đăng nhập hoặc email"/>
                <label className="control-label">Tên đăng nhập hoặc email</label>
            </div>
            

            <div className="form-floating mb-4">
                <input type={showPassword?'text':'password'} onKeyDown={handleKeyDown}  ref={passwordref} className="form-control _ge_de_ol" placeholder="Mật khẩu" required/>
                <label className="control-label">Mật khẩu</label>
                <span onClick={togglePassword} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                    <i id="eyeIcon" className={`fa-solid ${showPassword?'fa-eye-slash':'fa-eye'}`}></i>
                </span>
            </div>

            <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id=""/>
                    <label className="form-check-label">
                        Ghi nhớ?
                    </label>
                </div>
                <div>
                    <a href='sfsfs'>Quên mật khẩu?</a>
                </div>
            </div>

            <div className="mb-4">
                <div className="_btn_04">
                    <button onClick={handleLogin} ref={loginButtonRef} className="btn createButton">Đăng nhập</button>
                </div>
            </div>
            <div className="text-center">
                <Link to={'/register'}>Đăng kí</Link>
            </div>
    
        </div>

    );
};

export default Login;