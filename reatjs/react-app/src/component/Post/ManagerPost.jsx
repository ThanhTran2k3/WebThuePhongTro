import React, { useEffect, useState } from 'react';
import Post from './Post';
import { useUser } from '../../UserContext';


const ManagerPost = () => {

    const [listPost, setListPost] = useState([])
    const [activeButton, setActiveButton] = useState('postDisplays');
    const { postOfUser } = useUser();
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    };
    useEffect(()=>{
        if(activeButton==='postDisplays')
            setListPost(postOfUser.filter(item => item.status === true && item.approvalStatus === true && new Date(item.expirationDate).getTime() > new Date().getTime()))
        else if(activeButton==='postHidden')
            setListPost(postOfUser.filter(item => item.status === false && item.approvalStatus === true && new Date(item.expirationDate).getTime() > new Date().getTime()))
        else if(activeButton==='postExpired')
            setListPost(postOfUser.filter(item => new Date(item.expirationDate).getTime() < new Date().getTime()))
        else if(activeButton==='postPending')
            setListPost(postOfUser.filter(item => item.approvalStatus === null))
        else
            setListPost(postOfUser.filter(item => item.approvalStatus === false))
    },[activeButton,postOfUser])

    return (
        
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton==='postDisplays'?'red-underline':''}`} onClick={() => handleButtonClick('postDisplays')}>
                    Tin đang hiển thị
                </button>
                <button className={`btn ${activeButton==='postHidden'?'red-underline':''}`} onClick={() => handleButtonClick('postHidden')}>
                    Tin đang ẩn
                </button>
                <button className={`btn ${activeButton==='postExpired'?'red-underline':''}`} onClick={() => handleButtonClick('postExpired')}>
                    Tin hết hạn
                </button>
                <button className={`btn ${activeButton==='postPending'?'red-underline':''}`} onClick={() => handleButtonClick('postPending')}>
                    Tin chờ duyệt
                </button>
                <button className={`btn ${activeButton==='postRejected'?'red-underline':''}`} onClick={() => handleButtonClick('postRejected')}>
                    Tin bị từ chối
                </button>
            </div>
                {listPost.length !==0? (
                    
                    listPost.map((item)  => (
                        <Post
                                key={item.postId}
                                postId={item.postId}
                                filteredAnh= {item.postImages}
                                postCategory= {item.postCategory}
                                title = {item.title}
                                area ={item.area}
                                rentPrice = {item.rentPrice}
                                city = {item.city}
                                district = {item.district}
                                expirationDate = {item.expirationDate}
                                status ={item.status}
                                approvalStatus = {item.approvalStatus}
                        />
                    ))
                ) : (
                    <div className="no-posts">
                        <p>Không có bài viết để hiển thị.</p>
                    </div>

                )}
            </div>
    );
};

export default ManagerPost;