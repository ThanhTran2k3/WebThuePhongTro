import React, { useEffect, useState } from 'react';
import { getInvoiceOfUser } from '../../api/invoiceApi';
import { useUser } from '../../UserContext';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const HistoryPayment = () => {

    const [listInvoiceOfUser, setListInvoiceOfUser] = useState([])
    const [activeButton, setActiveButton] = useState('all');
    const { userInfo } = useUser();
    const [listInvoice, setListInvoice] = useState([])
    const navigate = useNavigate()
    

    useEffect(()=>{
        const fetchData = async () => {
            const result = await getInvoiceOfUser(userInfo,navigate);
            setListInvoiceOfUser(result)
        };
        if (!listInvoiceOfUser || listInvoiceOfUser.length === 0) {  
            fetchData();
        }
    }, [userInfo, listInvoiceOfUser,navigate]); 

    useEffect(()=>{
        if(activeButton==='all')
            setListInvoice(listInvoiceOfUser)
        else if(activeButton==='payment')
            setListInvoice(listInvoiceOfUser.filter(item => item.services.serviceName==='Nạp tiền'))
        else
            setListInvoice(listInvoiceOfUser.filter(item => item.services.serviceName!=='Nạp tiền'))
    },[listInvoiceOfUser,activeButton])

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
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
                    listInvoice.map((item) => (
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
                    ))
                ) : (
                    <div className="no-invoices">
                        <p>Không có hóa đơn để hiển thị.</p>
                    </div>
                )}
            </div>

            </div>
    );
};

export default HistoryPayment;