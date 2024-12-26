import React, { createRef, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { addService, editService } from '../../api/serviceApi';
import { useUser } from '../../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const FormService = (props) => {
    const [service, setService] = useState(props.service);
    const { userInfo } = useUser();
    const navigate = useNavigate();
    const servicenameref = createRef();
    const priceref = createRef();
    const location = useLocation().pathname;

    useEffect(()=>{
        if (props.service) {
            setService(props.service);  
        }
    },[props.service])
    
    const handleService = async (event) => {
        event.preventDefault()
        const serviceName = servicenameref.current.value.trim();
        const price = priceref.current.value.trim();
       
        if (!serviceName || !price) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đầy đủ thông tin!",
            });
            return;
        }

        const data = { 
            serviceName: serviceName,
            price: parseFloat(price)
        };

        if(location==='/admin/manager/service/add'){
            await addService(userInfo,data,navigate)
        }
        else
            await editService(userInfo,service.serviceId,data,navigate)
        
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setService((prevService) => ({
            ...prevService,
            [name]: value
        }));
    };

    return (
        <div className='d-flex justify-content-center align-items-center flex-column'>
            <img src='/service.jpg' alt='ảnh service' className='anh-service mt-5'/>
            <div className="form-03-main w-40 mx-auto p-5">
                <div className="form-floating mb-4 d-flex">
                    <input value={service.serviceName|| ''} onChange={handleInputChange} name="serviceName" type="text" className="form-control" ref={servicenameref} required/>
                    <label className="control-label">Tên dịch vụ</label>
                </div>

                <div className="form-floating mb-4 d-flex">
                    <input value={service.price || '0'} onChange={handleInputChange} type="number" name="price" className="form-control" ref={priceref} min="0" step="1000" required/>
                    <label className="control-label">Giá tiền</label>
                    <span className="input-group-text">đ</span>
                </div>

                <button onClick={handleService} className="button-info payment">
                    <label>Thêm mới</label>
                </button>
            </div>  
        </div>
    );
};

export default FormService;