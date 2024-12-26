import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import { getUserByUserName } from "../../api/userApi";
import ChangePass from "../User/ChangePass";
import EditUser from "../User/EditUser";
import ManagePayment from "./ManagePayment";
import UserManager from "./UserManager";
import ApprovePost from "./ApprovePost";




const EmployeeDashboard = () => {
    const [currentContent, setCurrentContent] = useState(<UserManager />);
    const navigate = useNavigate();
    const [user,setUser] = useState({})
    const [activeButton, setActiveButton] = useState('userManager');
    const { userInfo } = useUser();
    const location = useLocation(); 

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);


    useEffect(() => {
        const fetchData = async () => {

                const user = await getUserByUserName(userInfo,navigate);
                setUser(user);
           
        };
    
        if (userInfo) {  
            fetchData();
        }
    }, [userInfo,navigate]);



    useEffect(() => {

        if (location.pathname === '/employee/manager/user') {
            setCurrentContent(<UserManager />);
            setActiveButton('userManager')
        } else if (location.pathname === '/employee/manager/post') {
            setCurrentContent(<ApprovePost />);
            setActiveButton('postManager')
        } 
         else if (location.pathname === '/employee/manager/edit/profile') {
            setCurrentContent(<EditUser />);
            setActiveButton('userProfile')
        } else if (location.pathname === '/employee/manager/payment/history') {
            setCurrentContent(<ManagePayment />);
            setActiveButton('historyMoney')
        }
        else{
            setCurrentContent(<ChangePass />);
            setActiveButton('changePass')
        }
            
        
    }, [location.pathname, user]);



    const handleNavigation = (content,buttonName) => {
         setCurrentContent(content);
         setActiveButton(buttonName);
        
        if(buttonName==='userManager')
            navigate('/employee/manager/user')
        else if(buttonName==='postManager')
            navigate('/employee/manager/post')
        else if(buttonName==='userProfile')
            navigate('/employee/manager/edit/profile')
        else if(buttonName==='historyMoney')
            navigate('/employee/manager/payment/history')
        else
            navigate('/employee/manager/change/password')

     };

    const exitClick = () => {
        navigate('/')
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || !userInfo.roles.includes('ROLE_USER')) {
            return 'N/A';
        }
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
    }

   

    return (
        <div className='d-flex w-100'>
             <div className='user-dashboard'>
                <div className="user-info d-flex">
                        <div className="avatar-user">
                            <img src={`http://localhost:8080${user.avatar}`} alt="" className="avatar" />
                        </div>
                        <div className='user-details'>
                            {/* <button className='userName-click' onClick={() => handleNavigation(<UserInfo />,'userInfo')}> */}
                                <label className='userName-click'>{user.userName}</label>
                            {/* </button> */}
                            <label className='price'>{formatCurrency(user.balance)}</label>
                        </div>
                    
                </div>
                <div className='dashboard'>

                    <button className={activeButton === 'userManager' ? 'button-click' : ''} onClick={() => handleNavigation(<UserManager/>,'userManager')}>
                        <label>
                            <i className="fa-solid fa-user w-20"></i>
                            <span>Quản lý người dùng</span>
                        </label>
                    </button>
                   
                    <button className={activeButton === 'postManager' ? 'button-click' : ''} onClick={() => handleNavigation(<ApprovePost/>,'postManager')}>
                        <label>
                            <i className="fa-solid fa-table-list w-20"></i>
                            <span>Quản lý bài đăng</span>
                        </label>
                    </button>

                    <button className={activeButton === 'userProfile' ? 'button-click' : ''} onClick={() => handleNavigation(<EditUser/>,'userProfile')}>
                        <label>
                            <i className="fa-solid fa-user-pen w-20"></i>
                            <span>Thông tin cá nhân</span>
                        </label>
                    </button>
                    

                    <button className={activeButton === 'changePass' ? 'button-click' : ''} onClick={() => handleNavigation(<ChangePass />,'changePass')}>
                        <label>
                            <i className="fa-solid fa-lock w-20"></i>
                            <span>Đổi mật khẩu</span>
                        </label>
                    </button>

                    <button className={activeButton === 'historyMoney' ? 'button-click' : ''} onClick={() => handleNavigation(<ManagePayment />,'historyMoney')}>
                        <label>
                            <i className="fa-solid fa-file-invoice-dollar w-20"></i>
                            <span>Lịch sử nạp tiền</span>
                        </label>
                    </button>

                    <button onClick={exitClick}>
                        <label>
                            <i className="fa-solid fa-arrow-right-from-bracket w-20"></i>
                            <span>Thoát</span>
                        </label>
                    </button>
                </div>
                
            </div>
            <div style={{ flex: 1,backgroundColor: '#f4f6fd'}}>
                {currentContent}
            </div>
        </div>
    );
};

export default EmployeeDashboard;