import React, { useState } from 'react';

const ChangePass = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [showCurPassword, setShowCurPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePassword = (input, value) => {
        input(!value);
    };

    const comfigPass = (event)=>{
        // const password = passwordref.current.value.trim();
        // const confirmPassword = event.target.value;
        // if (password !== confirmPassword) {
        //     setError('Mật khẩu không khớp!');
        // } else {
        //     setError('');
        // }
    }
    return (
        <div className='m-5'>

            <div className="form-03-main w-40 mb-5">
                
                <div className="form-floating mb-4">
                    <input type={showPassword ? 'text' : 'password'}   className="form-control" name="currentPassword" placeholder="currentPassword"  required></input>
                    <label className="control-label">Current password</label>
                    <span onClick={()=>togglePassword(setShowCurPassword,showCurPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                        <i id="eyeIcon" className={`fa-solid ${showPassword?'fa-eye-slash':'fa-eye'}`}></i>
                    </span>
                </div>

                <div className="form-floating mb-4">
                    <input type={showPassword ? 'text' : 'password'}   className="form-control" name="newPassword" placeholder="newPassword"  required></input>
                    <label className="control-label">New password</label>
                    <span onClick={()=>togglePassword(setShowPassword,showPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                        <i id="eyeIcon" className={`fa-solid ${showPassword?'fa-eye-slash':'fa-eye'}`}></i>
                    </span>
                </div>

                <div className="form-floating mb-4">
                    <input type={showConfirmPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm password" required onChange={comfigPass}></input>
                    <label className="control-label">Confirm password</label>
                    <span onClick={()=>togglePassword(setShowConfirmPassword,showConfirmPassword)} className="position-absolute end-0 top-50 translate-middle-y show_icon">
                        <i id="eyeIcon" className={`fa-solid ${showConfirmPassword?'fa-eye-slash':'fa-eye'}`}></i>
                    </span>
                </div>

            </div>
        </div>
       
    );
};

export default ChangePass;