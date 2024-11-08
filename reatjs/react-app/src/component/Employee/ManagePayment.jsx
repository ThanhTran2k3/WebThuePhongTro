import React, { useEffect, useState } from 'react';
import { getAllInvoice } from '../../api/invoiceApi';
import { useUser } from '../../UserContext';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

const ManagePayment = () => {

    const [activeButton, setActiveButton] = useState('all');
    const { userInfo } = useUser();
    const [listInvoice, setListInvoice] = useState([])
    const navigate = useNavigate()
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const [service, setService] = useState(null);            
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    
    
    

    useEffect(() => {
        const fetchData = async (pageNum, service) => {
            const result = await getAllInvoice(userInfo, navigate, pageNum, service);
            setListInvoice(result.content);
            setTotalPage(result.totalPage);
            setPage(result.currentPage);
        };
        fetchData(newPage, service);
    }, [service,newPage,navigate,userInfo]);

    useEffect(() => {
        if (activeButton) {
            if (activeButton === 'payment') {
                setService('Nạp tiền');
            } else if (activeButton === 'service') {
                setService('Service');
            } else {
                setService(null);
            }
        }
    }, [activeButton]);

    const handleButtonClick = async(buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
    };
    
    return (
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton==='all'?'red-underline':''}`} onClick={() => handleButtonClick('all')}>
                    Tất cả
                </button>
                <button className={`btn ${activeButton==='payment'?'red-underline':''}`} onClick={() => handleButtonClick('payment')}>
                    Nạp tiền
                </button>
                <button className={`btn ${activeButton==='service'?'red-underline':''}`} onClick={() => handleButtonClick('service')}>
                    Dịch vụ
                </button>
                
            </div>
            <div className="invoice-list">
                {listInvoice.length !== 0 ? (
                    <>
                        {listInvoice.map((item) => (
                            <div key={item.invoiceId} className="invoice-item d-flex">
                                <div className='w-50'>
                                    <h5>{item.services.serviceName}</h5>
                                    <p>Ngày thanh toán: {moment(item.issueDate).format('DD-MM-YYYY')}</p>
                                    <p>Nội dung: {item.content}</p>
                                </div>
                                <div className='mt-4'>
                                    <p className={`fw-bold ${item.services.serviceName==='Nạp tiền'?'text-green':'text-danger'}`}>{`${item.services.serviceName==='Nạp tiền'?'+ ':'- '}` + item.totalAmount.toLocaleString()+' đ'}</p>
                                </div>
                                
                            
                                
                            </div>
                        ))}
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={page} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                        </div>
                    </>
                ) : (
                    <div className="no-invoices">
                        <p>Không có hóa đơn để hiển thị.</p>
                    </div>
                )}
               
            </div>
            
            </div>
    );
};

export default ManagePayment;