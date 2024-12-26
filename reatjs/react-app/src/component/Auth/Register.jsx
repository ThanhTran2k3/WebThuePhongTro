import React, { createRef, useState } from 'react';
import './Auth.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import Swal from 'sweetalert2';
const Register = () => {

    const usernameref = createRef();
    const emailref= createRef();
    const phoneNumberref = createRef();
    const passwordref = createRef();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    

    const togglePassword = (input, value) => {
        input(!value);
    };

    const comfigPass = (event)=>{
        const password = passwordref.current.value.trim();
        const confirmPassword = event.target.value;
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp!');
        } else {
            setError('');
        }
    }



    const handleLogin = async (event) => {
        event.preventDefault()
        const userName = usernameref.current.value.trim();
        const email = emailref.current.value.trim();
        const phoneNumber = phoneNumberref.current.value.trim();
        const password = passwordref.current.value.trim();
        


        if (!userName || !password || !email || !phoneNumber) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }


        const data = { 
            userName: userName, 
            email: email,
            phoneNumber: phoneNumber,
            password: password
        };

        await register(data,navigate)
    };

    return (
        <div className="form-03-main w-40 mb-5 mt-5 bg-light border ">
            <div className="logo">
                <img src='/user.png' alt=''/>
            </div>

            <div className="form-floating mb-4">
                <input className="form-control" name="userName" ref={usernameref} placeholder="Tên đăng nhập" required />
                <label  className="control-label">Tên đăng nhập</label>
                <span className="text-danger"></span>
            </div>

            
            <div className="form-floating mb-4">
                <input className="form-control" type='number' name="phoneNumber" ref={phoneNumberref} placeholder="Số điện thoại" 
                onInput={(e) => {
                    if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                    }
                }} 
                required />
                <label className="control-label">Số điện thoại</label>
                
            </div>

            <div className="form-floating mb-4">
                <input className="form-control" name="email" ref={emailref} placeholder="Email" required></input>
                <label className="control-label">Email</label>
            </div>
            <div className="form-floating mb-4">
                <input type={showPassword ? 'text' : 'password'} ref={passwordref}  className="form-control" name="password" placeholder="Mật khẩu"  required></input>
                <label className="control-label">Mật khẩu</label>
                <span onClick={()=>togglePassword(setShowPassword,showPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                    <i id="eyeIcon" className={`fa-solid ${showPassword?'fa-eye-slash':'fa-eye'}`}></i>
                </span>
            </div>
            <div className="form-floating mb-4">
                <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm passwordXác nhận mật khẩu" required onChange={comfigPass}></input>
                <label className="control-label">Xác nhận mật khẩu</label>
                <span onClick={()=>togglePassword(setShowConfirmPassword,showConfirmPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                    <i id="eyeIcon" className={`fa-solid ${showConfirmPassword?'fa-eye-slash':'fa-eye'}`}></i>
                </span>
            </div>
            {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

            <div className="mb-4">
                <div className="_btn_04">
                    <button onClick={handleLogin} className="btn createButton" disabled={error}>Đăng ký</button>
                </div>
            </div>

            <div className="text-center">
                <Link to={'/'}>Trở về</Link>
            </div>
            
        </div>
    );
};

export default Register;