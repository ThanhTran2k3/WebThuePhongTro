import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import PostList from './PostList';
import Post from './Post';
import { Pagination } from '@mui/material';

const FavoritePost = () => {

    const { userInfo  } = useUser();
    const [listPost, setListPost] = useState([])

    useEffect(()=>{
        setListPost(userInfo.likePost)
    },[userInfo.likePost])

    return (

        <div className='m-5 p-5'>
            {listPost.length !== 0 ? (
                <>
                    {listPost.map((item)  => (
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
                                expirationDate= {item.expirationDate}
                                approvalStatus={item.approvalStatus}
                                status={item.status}
                                userName ={item.userName}
                        />
                    ))}
                    {/* <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                    </div> */}
                </>
            ) : (
                <div className="no-posts">
                    <p>Không có bài viết để hiển thị.</p>
                </div>
            )}
            
        </div>

    );
};

export default FavoritePost;