import React from 'react';
import './Error.css'
import { Link, useLocation } from 'react-router-dom';
const Error = () => {
    const location = useLocation();
    const status = location.state?.status || 404;
    const message = location.state?.message || 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại.';

    return (
        <div className="error-container">
            <h1>{status}</h1>
            <p>{message}</p>
            <Link to="/">Trở về trang chủ</Link>
        </div>
    );
}

export default Error;
