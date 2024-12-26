import React, { createRef, useState } from 'react';
import Swal from 'sweetalert2';
import { changePass } from '../../api/authApi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const ChangePass = (props) => {
    const { userInfo, logout  } = useUser();
    const passwordref = createRef();
    const newPasswordref = createRef();
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showCurPassword, setShowCurPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    const handleChangePass = async (event)=>{
        event.preventDefault()
        const password = passwordref.current.value.trim();
        const newPassword = newPasswordref.current.value.trim();


        if (!password|| !newPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }

        const data = {   
            oldPassword: password,
            newPassword: newPassword
        }

        await changePass(userInfo,data,navigate,logout)
    }


    return (
        <div className='m-5'>

            <div className="form-03-main w-40 mb-5 bg-light border rounded">
                
                <div className="form-floating mb-4">
                    <input type={showCurPassword ? 'text' : 'password'}   className="form-control" name="currentPassword" placeholder="currentPassword" ref={passwordref}  required></input>
                    <label className="control-label">Mật khẩu hiện tại</label>
                    <span onClick={()=>togglePassword(setShowCurPassword,showCurPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                        <i id="eyeIcon" className={`fa-solid ${showCurPassword?'fa-eye-slash':'fa-eye'}`}></i>
                    </span>
                </div>

                <div className="form-floating mb-4">
                    <input type={showNewPassword ? 'text' : 'password'}   className="form-control" name="newPassword" placeholder="newPassword" ref={newPasswordref}  required></input>
                    <label className="control-label">Mật khẩu mới</label>
                    <span onClick={()=>togglePassword(setShowNewPassword,showNewPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                        <i id="eyeIcon" className={`fa-solid ${showNewPassword?'fa-eye-slash':'fa-eye'}`}></i>
                    </span>
                </div>

                <div className="form-floating mb-4">
                    <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm password" required onChange={comfigPass}></input>
                    <label className="control-label">Xác nhận mật khẩu</label>
                    <span onClick={()=>togglePassword(setShowConfirmPassword,showConfirmPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                        <i id="eyeIcon" className={`fa-solid ${showConfirmPassword?'fa-eye-slash':'fa-eye'}`}></i>
                    </span>
                </div>
                {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
               <Link to={'/forgot-pass'}>Quên mật khẩu?</Link>
               <div className="mb-4 mt-4">
                    <div className="_btn_04">
                        <button onClick={handleChangePass} className="btn createButton" disabled={error} >Đổi mật khẩu</button>
                    </div>
                </div>
            </div>
           
           
        </div>
       
    );
};

export default ChangePass;