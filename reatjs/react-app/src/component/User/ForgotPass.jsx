import React, { createRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { getUserByUserName } from '../../api/userApi';
import { sendOTPEmail, verifyOTPEmail } from '../../api/otpApi';
import Swal from 'sweetalert2';
import { changePassOTP } from '../../api/authApi';

const ForgotPass = () => {
    const { userInfo, logout  } = useUser();
    const [user,setUser] = useState({})
    const [verify, setVerify] = useState(false)
    const [succes, setSucces] = useState(false)
    const otpref = createRef();
    const emailref = createRef();
    const newPasswordref = createRef();
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [email,setEmail] =  useState('');
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft <= 0) return; 
    
        if(verify){
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
              }, 1000);
          
              return () => clearInterval(timer); 
        }
       
      }, [timeLeft,verify]);

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      };

    useEffect(() => {
        const fetchData = async () => {
            const user = await getUserByUserName(userInfo,navigate);
            setUser(user);
        };
    
        if (userInfo) {  
            fetchData();
        }
    }, [userInfo,navigate]);


    const togglePassword = (input, value) => {
        input(!value);
    };

    const comfigPass = (event)=>{
        const newPassword = newPasswordref.current.value.trim();
        const confirmPassword = event.target.value;
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp!');
        } else {
            setError('');
        }
    }

    const sendOTP = async ()=>{
        const emailValue = user && user.email ? user.email : emailref.current.value.trim();
        if(!emailref){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập OTP!",
            });
            return;
        }else{
            setEmail(emailValue)
        }
        const data = { 
            email: emailValue, 
        };
        const result = await sendOTPEmail(data)
        setVerify(result)

    }

    const resendOTP = async ()=>{
 
        if(!email){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập OTP!",
            });
            return;
        }
        const data = { 
            email: email, 
        };
        const result = await sendOTPEmail(data)
        setVerify(result)
        setTimeLeft(60)

    }

    const successOTP = async ()=>{
        const otp = otpref.current.value.trim();
        if(!otp){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập OTP!",
            });
            return;
        }
        const result = await verifyOTPEmail(email,otp)
        setSucces(result)
    }

    const handleChangePass = async (event)=>{
        event.preventDefault()
        const newPassword = newPasswordref.current.value.trim();


        if (!newPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }

        const data = {   
            newPassword: newPassword,
            email: email
        }

        await changePassOTP(data,navigate,logout)
    }

    return (
        <div className='m-5'>
            <div className="form-03-main w-40 mb-5 bg-light border rounded">
                {!verify ? (
                    Object.keys(user).length!==0 ? (
                        <>
                            <img src={`http://localhost:8080${user.avatar}`} alt="avatar" className="avatar w-25 h-25" />
                            <div className="d-flex mt-4">
                                <input type="radio" className='me-3'/>
                                <div className="form-floating mb-4 w-100">
                                    <input value={user.email} className="form-control" disabled></input>
                                    <label className="control-label">Email</label>
                                </div>
                            </div>
                            <div className="mb-4 mt-4">
                                <div className="_btn_04">
                                    <button className="btn createButton" onClick={sendOTP}>Gửi OTP</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <img src='/user.png' alt="avatar" className="avatar w-25 h-25" />
                            <div className="d-flex mt-4">
                                <div className="form-floating mb-4 w-100">
                                    <input className="form-control" placeholder='email' ref={emailref}></input>
                                    <label className="control-label">Email</label>
                                </div>
                            </div>
                            <div className="mb-4 mt-4">
                                <div className="_btn_04">
                                    <button className="btn createButton" onClick={sendOTP}>Gửi OTP</button>
                                </div>
                            </div>
                        </>
                    )
                ) : (
                    !succes ? (
                        <>
                            <div className="form-floating mb-3 w-100">
                                <input className="form-control" ref={otpref} placeholder="Mã OTP"></input>
                                <label className="control-label">Mã OTP</label>
                            </div>
                            {timeLeft!==0?(
                                <span className='card-area lead mb-2'>Thời gian còn lại: {formatTime(timeLeft)}</span>
                            ):(
                                <Link onClick={resendOTP} className="btn-link">Làm mới</Link>
                            )}
                            
                            <div className="mb-4 mt-4">
                                <div className="_btn_04">
                                    <button className="btn createButton" onClick={successOTP}>Xác thực</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {Object.keys(user).length!==0 ? (
                                <img src={`http://localhost:8080${user.avatar}`} alt="avatar" className="avatar w-25 h-25 mb-3" />
                            ):(
                                <img src='/user.png' alt="avatar" className="avatar w-25 h-25 mb-3" />
                            )}
                            
                            <div className="form-floating mb-4">
                                <input type={showNewPassword ? 'text' : 'password'}   className="form-control" placeholder="newPassword" ref={newPasswordref} autocomplete="off" ></input>
                                <label className="control-label">Mật khẩu mới</label>
                                <span onClick={()=>togglePassword(setShowNewPassword,showNewPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                                    <i id="eyeIcon" className={`fa-solid ${showNewPassword?'fa-eye-slash':'fa-eye'}`}></i>
                                </span>
                            </div>

                            <div className="form-floating mb-4">
                                <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm password" autocomplete="off" onChange={comfigPass}></input>
                                <label className="control-label">Xác nhận mật khẩu</label>
                                <span onClick={()=>togglePassword(setShowConfirmPassword,showConfirmPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                                    <i id="eyeIcon" className={`fa-solid ${showConfirmPassword?'fa-eye-slash':'fa-eye'}`}></i>
                                </span>
                            </div>
                            {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
                            <div className="mb-4 mt-4">
                                <div className="_btn_04">
                                    <button className="btn createButton" disabled={error} onClick={handleChangePass}>Đổi mật khẩu</button>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default ForgotPass;