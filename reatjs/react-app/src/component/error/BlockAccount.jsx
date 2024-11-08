import React from 'react';
import { Link } from 'react-router-dom';



const BlockAccount = () => {



    return (
        <div class="error-container">
            <i class="fas fa-lock"></i>
            <h2>Tài khoản của bạn đã bị khóa</h2>
            <p>Vui lòng liên hệ quản trị viên để biết thêm chi tiết.</p>
            <Link to="/">Trở về trang chủ</Link>
        </div>
    );
};

export default BlockAccount;
