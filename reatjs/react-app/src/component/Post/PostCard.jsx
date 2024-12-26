import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Post.css'
import { likePost } from '../../api/postApi';
import { useUser } from '../../UserContext';


const PostCard = (props) => {

    const { userInfo, updateUser} = useUser();
    const navigate = useNavigate();
    const [isLike,setLike] = useState(false)
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

    return (
        <div className="col-4 mb-5" key={props.postId}>
            <div className="card gap-3 card-width d-block">
                <Link to={`/post/${props.postId}`}>
                    <img
                        src={`http://localhost:8080${props.filteredAnh[0].urlImage}`}
                        className={`w-100 img-fluid ${props.postCategory.postCategoryId !== 2 ? 'img-large' : 'img-small'}`}
                        alt="Hình ảnh bài đăng"
                    />
                    {props.postCategory && props.postCategory.postCategoryId === 2 && (
                        <div className="img-servie2 d-flex">
                            {props.filteredAnh.slice(1, 4).map((item) => (
                                <img
                                    key={item.postImageId}
                                    src={`http://localhost:8080${item.urlImage}`}
                                    className="img-fluid"
                                    alt="Hình ảnh bài đăng"
                                />
                            ))}
                        </div>
                    )}
                </Link>

                
                <div className="head-card">
                    <div className="priority">
                        {props.postCategory && props.postCategory.postCategoryId === 3 && (
                            <p className="lead mb-0">
                                <i className="fa-solid fa-medal"></i>
                                <span className="priority-text">Tin ưu tiên</span>
                            </p>
                        )}
                    </div>
                    <div className='favorite'>
                        <button className="heart-button" onClick={handleLikePost}>
                            <i className={`${isLike?'fas':'far'} fa-heart`}></i>
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <Link to={`/post/${props.postId}`} className="title-link">
                        <h5 className="card-title mb-2">{props.title}</h5>
                    </Link>

                    <span className="card-area lead mb-2">
                        {props.area} m<sup>2</sup>
                    </span>
                    <p className="card-price lead mb-2">
                        {props.rentPrice.toLocaleString()} đ/ tháng
                    </p>

                    <p className="lead mb-0">
                        <i className="fa-solid fa-user"></i>
                        <Link to={`/user/${props.userName}`} >
                            <span className="priority-text">{props.userName} </span>
                        </Link>
                        
                    </p>
                    <p className="lead mb-2">
                        <i className="fas fa-map-marker-alt"></i>
                        <span className="card-location">{props.city}</span>
                    </p>
                    
                </div>
            </div>
        </div>
    );
};

export default PostCard;