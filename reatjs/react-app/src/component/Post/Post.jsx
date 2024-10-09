import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { likePost, showPost } from '../../api/postApi';
import moment from 'moment';


const Post = (props) => {
    const [isLike,setLike] = useState(false)
    const { userInfo, updateUser,updatePostOfUser} = useUser();
    const navigate = useNavigate();
    const location = useLocation().pathname;
    useEffect(() => {
        if (userInfo) {
            setLike(userInfo.likePost.some(s => s.postId === props.postId));
        } else {
            setLike(false);
        }
    }, [userInfo, props.postId]);

    const handleLikePost = async() => {
        if(userInfo){
            const result = await likePost(userInfo,props.postId)
            const updatedUserInfo = {
                ...userInfo,
                likePost: result,
            };
            sessionStorage.setItem('userinfo', JSON.stringify(updatedUserInfo));
            updateUser(updatedUserInfo);
            setLike(!isLike)
        }
        else
            navigate('/login')
        
    };

    const handleShow = async() =>{
        showPost(userInfo,props.postId,updatePostOfUser)
    }

    const handleEditPost = () => {
        navigate(`/user/manager/post/edit/${props.postId}`);
    };

    const handleExtendPost = () => {
        navigate(`/user/manager/post/extend/${props.postId}`);
    };

    const handleServicePost = () => {
        navigate(`/user/manager/post/service/${props.postId}`);
    };
    

    return (
        <div className='d-flex post border border-2 bg-light w-100'>
            <div className='col-md-3'>
                <Link to={`/post/${props.postId}`}>
                        <img
                            src={`http://localhost:8080${props.filteredAnh[0].urlImage}`}
                            className={`w-100 img-fluid ${props.postCategory.postCategoryId !== 2 ? 'img-large' : 'img-small'}`}
                            alt="Hình ảnh bài đăng"
                        />
                </Link>
            </div>

            <div className='col-md-8 d-flex flex-column m-3'>
                <Link to={`/post/${props.postId}`}>
                    <h5 className="card-title mb-2">{props.title}</h5>
                </Link>
                
                <span className="card-area lead mb-2">
                    {props.area} m<sup>2</sup>
                </span>
                <p className="card-price lead mb-2">
                    {props.rentPrice.toLocaleString()} đ/ tháng
                </p>
                <p className="baseFont">
                    {props.district + ', ' + props.city}
                </p>

                <div className='post-detail mt-auto d-flex'>
                    {props.postCategory && props.postCategory.postCategoryId === 3 && (
                        <p className="lead mb-0">
                            <i className="fa-solid fa-medal priority-text"></i>
                            <span className="priority-text">Tin ưu tiên</span>
                        </p>
                    )}

                    {location !== '/user/manager/post' && !location.includes('/user/manager/post/extend') ? (
                        <div className='favorite-button ms-auto'>
                            <button className="heart-button" onClick={handleLikePost}>
                                <i className={`${isLike ? 'fas' : 'far'} fa-heart`}></i>
                            </button>
                        </div>
                    ): (
                        <div className='justify-content-between ms-auto d-flex'>
                            <button className='btn-manager'>
                                <label>
                                    <i className="fa-solid fa-stopwatch w-20"></i>
                                    <span className='baseFont ps-1'>{moment(props.expirationDate).format('DD-MM-YYYY')}</span>
                                </label>
                            </button>
                            {props.approvalStatus === true && new Date(props.expirationDate).getTime() > new Date().getTime() &&(
                                <>
                                <button className='btn-manager ms-3' onClick={handleShow}>
                                    <label>
                                        <i className={`${props.status?'fa-solid fa-eye-slash':'fa-solid fa-eye'} w-20`}></i>
                                        <span className='baseFont ps-1'>{props.status?'Ẩn':'Hiện'}</span>
                                    </label>
                                </button>
                                <button className='btn-manager ms-3' onClick={handleServicePost}>
                                    <label>
                                        <span className='baseFont'>Dịch vụ</span>
                                    </label>
                                </button>
                                </>
                            )}
                            
                            <button className='btn-manager ms-3' onClick={handleEditPost}>
                                <label>
                                    <span className='baseFont'>Chỉnh sửa</span>
                                </label>
                            </button>
                            {new Date(props.expirationDate).getTime() < new Date().getTime() &&(
                                <button className='btn-manager ms-3' onClick={handleExtendPost}>
                                    <label>
                                        <span className='baseFont ps-1'>Gia hạn</span>
                                    </label>
                                </button>
                            )}
                           
                        </div>
                    )}
                   
                </div>

            </div>
        </div>
    );
};

export default Post;