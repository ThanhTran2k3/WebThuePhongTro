import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, servicePost } from "../../api/postApi";
import { useUser } from '../../UserContext';
import Post from './Post';
import { getListService } from '../../api/serviceApi';
import Swal from 'sweetalert2';

const PostService = (props) => {
    const [post ,setPost] = useState()
    const { userInfo, updatePostOfUser  } = useUser();
    const { postId } = useParams()
    const [listService , setListService] = useState([])
    const [totalAmount, setTotalAmount] = useState()
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const [serviceSel, setServiceSel] = useState({})

    useEffect(()=>{
        if(postId){
            const fetchData = async () => {
                const post = await getPostById(userInfo,postId,navigate);
                const service = await getListService()
                setListService(service)
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
        const total = sanitizedValue*serviceSel.price
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
                await servicePost(userInfo, post.postId, value, serviceSel.serviceId,updatePostOfUser);
                
                navigate('/user/manager');
            } catch (error) {

                console.error("Error:", error);

            }
        }
           
    }

    const handleChange = (event) => {
        setValue(1)
        const service = listService.find(item=>item.serviceId.toString() === event.target.value)
        setServiceSel(service)
        setTotalAmount(service.price)
    };

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

                {listService.length>0 ? (
                    <div className="form-03-main w-40 mx-auto p-5">
                    
                        <div className="mb-4 d-flex gap-4">
                            {listService.map(item =>(
                                <div key={item.serviceId} className="d-flex align-items-center justify-content-center radio-wrapper w-50">
                                    <input type="radio"  id={item.serviceId} onChange={handleChange} name='payment' className="radio-input"  value={item.serviceId}/>
                                    <label htmlFor={item.serviceName}  className='ms-2 radio-label'>
                                        <i className={`fa-solid ${item.serviceName==='Tin ưu tiên'?'fa-up-long':'fa-up-right-and-down-left-from-center'}`}></i> {item.serviceName}
                                    </label>
                                </div>
                            ))}
                           
                            
                        </div>

                        
                        <div className="form-floating mb-4" >
                            <input onChange={changeMonth} disabled={value===0} value={value}  type='number' className="form-control" step="1" min={1} placeholder='Số ngày' />
                            <label className="control-label">Số ngày</label>
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
                ):(
                    <div className="no-posts">
                        <p>Không có dịch vụ</p>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default PostService;