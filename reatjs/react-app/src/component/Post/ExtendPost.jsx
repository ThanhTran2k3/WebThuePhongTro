import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extendPost, getPostById } from "../../api/postApi";
import { useUser } from '../../UserContext';
import Post from './Post';
import { getServiceById } from '../../api/serviceApi';
import Swal from 'sweetalert2';

const ExtendPost = (props) => {
    const [post ,setPost] = useState()
    const { userInfo,updatePostOfUser  } = useUser();
    const { postId } = useParams()
    const [service , setService] = useState({})
    const [totalAmount, setTotalAmount] = useState('')
    const [value, setValue] = useState(1);
    const navigate = useNavigate();

    useEffect(()=>{
        if(postId){
            const fetchData = async () => {
                const post = await getPostById(userInfo,postId,navigate);
                const service = await getServiceById(4)
                setService(service)
                setTotalAmount(service.price)
                setPost(post)
            };
            fetchData();
        }
        
    },[postId,userInfo,navigate])


    const changeMonth = (event) =>{
        
        const month =event.target.value
        const sanitizedValue = month.replace(/[^0-9-]/g, '');
        setValue(sanitizedValue);
        const total = sanitizedValue*service.price
        setTotalAmount(total)
    }

    const pay = async ()=>{
        if(props.user.balance<totalAmount){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger ms-4"
                },
                buttonsStyling: false
              });
              swalWithBootstrapButtons.fire({
                title: "Lỗi",
                text: "Số dư của bạn không đủ!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Nạp tiền!",
                cancelButtonText: "Hủy",
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/user/manager/payment')
                } else if (

                  result.dismiss === Swal.DismissReason.cancel
                ) {
                  swalWithBootstrapButtons.fire({
                    title: "Thanh toán thất bại",
                    text: "Số dư của bạn không đủ!",
                    icon: "error"
                  });
                }
              });
        }
        else{
            try {
                await extendPost(userInfo,post.postId,value,service.serviceId,updatePostOfUser)
                
                navigate('/user/manager');
            } catch (error) {

                console.error("Error:", error);

            }
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
            {post && (
                <div className='w-75 mx-auto mt-4'>
                        <Post  
                            key={post.postId}
                            postId={post.postId}
                            filteredAnh={post.postImages}
                            postCategory={post.postCategory}
                            title={post.title}
                            area={post.area}
                            rentPrice={post.rentPrice}
                            city={post.city}
                            district={post.district}
                        />
                        </div>
                    )}
                <div className="form-03-main w-40 mx-auto p-5">
                    
                
                    
                    <div className="form-floating mb-4" >
                        <input onChange={changeMonth} value={value} type='number' className="form-control" step="1" min={1} placeholder='Số tháng'/>
                        <label className="control-label">Số tháng</label>
                    </div>

                    <div className="form-floating mb-4 d-flex">
                        <input value={totalAmount}  type="number" className="form-control" disabled />
                        <label className="control-label">Tổng tiền</label>
                        <span className="input-group-text">đ</span>
                    </div>
                    <span className="text-danger"></span>

                    

                    <button  className="button-info payment" onClick={pay}>
                        <label>Thanh toán</label>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExtendPost;