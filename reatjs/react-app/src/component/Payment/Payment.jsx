import React, { createRef } from 'react';
import { useUser } from '../../UserContext';
import './Payment.css'
import { paymentMomo } from '../../api/paymentApi';
import Swal from 'sweetalert2';


const Payment = () => {
    const { userInfo  } = useUser();
    const paymenteref = createRef();

    const handlePayment = async(event) =>{
        event.preventDefault()
        const payment = paymenteref.current.value.trim();
        if (!payment) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập số tiền!",
            });
            return;
        }
        await paymentMomo(userInfo,payment)
    }
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="form-03-main w-40 mx-auto m-5 p-5">

                    <div className="form-floating mb-4" >
                        <input value={userInfo.userName}  className="form-control" disabled/>
                        <label className="control-label">Tên tài khoản</label>
                    </div>

                    <div className="form-floating mb-4 d-flex">
                        <input ref={paymenteref} type="number" className="form-control" min="1000" step="1000" placeholder="0.00" required />
                        <label className="control-label">Số tiền nạp</label>
                        <span className="input-group-text">đ</span>
                    </div>
                    <span className="text-danger"></span>

                    <div className="mb-4">
                            <label className="mb-4">Phương thức thanh toán</label>
                            <div className="d-flex align-items-center justify-content-center">
                                <input type="radio"/>
                                <img className='image-payment ms-3' src="/momo.jpg" alt="" />
                                <label className='ms-2 mx-auto'>Momo</label>
                            </div>
                    </div>

                    <button onClick={handlePayment}  className="button-info payment">
                        <label>Nạp</label>
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Payment;