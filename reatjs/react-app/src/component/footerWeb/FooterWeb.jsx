import React from 'react';
import './FooterWeb.css'
import { Link } from "react-router-dom";

const FooterWeb = () => {
    return (
       <footer className="footer mt-auto py-3 bg-light border-top d-flex justify-content-center align-items-center">
            <div className="footer-content">
                <div className="w-50">
                    <h5 className="my-2">Liên hệ</h5>
                    <p className="lead mb-2">
                        <i className="fa-solid fa-envelope"></i>
                        <span className="baseFont info-color ml-5">@users.Email</span>
                    </p>
                    <p className="lead mb-2">
                        <i className="fa-solid fa-phone"></i>
                        <span className="baseFont info-color ml-5">@users.PhoneNumber</span>
                    </p>
                </div>
                <div className="w-50">
                    <h5 className="my-2">Liên kết</h5>
                    <Link to="/" className="text-primary">
                        <i className="fa-brands fa-facebook"></i>
                    </Link>
                    <Link to="/" className="text-dark">
                        <i className="fa-brands fa-tiktok"></i>
                    </Link>
                    <Link to="/" className="text-danger">
                        <i className="fa-brands fa-youtube"></i>
                    </Link>
                </div>
            </div>
        </footer>

    );
};

export default FooterWeb;




